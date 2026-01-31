import { Inngest } from "inngest";
import prisma from "../config/prisma.js";

export const inngest = new Inngest({ id: "profile-marketplace" });

// 1. Fixed Creation Logic
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { data } = event;

        // --- CRITICAL FIX HERE ---
        // Added 'await'. Without this, 'user' is a Promise (true), so the code 
        // assumes the user exists and skips the 'create' block below.
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
            // This block was never running before because of the missing await
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

// 2. Fixed Deletion Logic (Handles "User Not Found" errors gracefully)
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { data } = event;

        const listings = await prisma.listing.findMany({ where: { ownerId: data.id } });
        const chats = await prisma.chat.findMany({ where: { OR: [{ ownerUserId: data.id }, { chatUserId: data.id }] } });
        const transactions = await prisma.transaction.findMany({ where: { userId: data.id } });

        if (listings.length === 0 && chats.length === 0 && transactions.length === 0) {
            try {
                await prisma.user.delete({
                    where: { id: data.id }
                });
            } catch (error) {
                // If user is already gone (P2025), we don't need to crash
                if (error.code === 'P2025') {
                    console.log("User already deleted or not found.");
                } else {
                    throw error;
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
        // Upsert is safer than update: it creates the user if they were missed previously
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