import { Inngest } from "inngest";
import prisma from "../config/prisma.js";

export const inngest = new Inngest({ id: "profile-marketplace" });

// 1. Fixed Creation Logic
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { data } = event;

        // FIXED: Added 'await' here. Before this, 'user' was a Promise (always true),
        // causing the code to skip the create block and fail on update.
        const user = await prisma.user.findFirst({
            where: { id: data.id }
        });

        if (user) {
            await prisma.user.update({
                where: { id: data.id },
                data: {
                    email: data?.email_addresses[0]?.email_address,
                    name: (data?.first_name || "") + " " + (data?.last_name || ""),
                    image: data?.image_url,
                }
            });
        } else {
            await prisma.user.create({
                data: {
                    id: data.id,
                    email: data?.email_addresses[0]?.email_address,
                    name: (data?.first_name || "") + " " + (data?.last_name || ""),
                    image: data?.image_url,
                }
            });
        }
    },
);

// 2. Fixed Deletion Logic
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { data } = event;

        const listings = await prisma.listing.findMany({
            where: { ownerId: data.id },
        });

        const chats = await prisma.chat.findMany({
            where: { OR: [{ ownerUserId: data.id }, { chatUserId: data.id }] }
        });

        const transactions = await prisma.transaction.findMany({
            where: { userId: data.id }
        });

        if (listings.length === 0 && chats.length === 0 && transactions.length === 0) {
            // FIXED: Wrapped in try/catch to handle cases where user doesn't exist
            try {
                await prisma.user.delete({
                    where: { id: data.id }
                });
            } catch (error) {
                // If the error code is P2025, it means the record to delete wasn't found.
                // We can safely ignore this as the desired state (user deleted) is achieved.
                if (error.code === 'P2025') {
                    console.log("User already deleted or not found, skipping.");
                } else {
                    throw error; // Rethrow real errors
                }
            }
        } else {
            await prisma.listing.updateMany({
                where: { ownerId: data.id },
                data: { status: "inactive" }
            });
        }
    }
);

// 3. Robust Update Logic
const syncUserUpdatation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { data } = event;

        // Use upsert to be safe: Update if exists, Create if it doesn't.
        // This prevents crashes if the 'created' event was missed.
        await prisma.user.upsert({
            where: { id: data.id },
            update: {
                email: data?.email_addresses[0]?.email_address,
                name: (data?.first_name || "") + " " + (data?.last_name || ""),
                image: data?.image_url
            },
            create: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: (data?.first_name || "") + " " + (data?.last_name || ""),
                image: data?.image_url
            }
        });
    }
);

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdatation];