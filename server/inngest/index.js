
import { Inngest } from "inngest";
import prisma from "../config/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "profile-marketplace" });

//Inngest Function to save a user data
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        //Find the Data
        const { data } = event

        //Check if user already exists in database
        const user = prisma.user.findFirst({
            where: { id: data.id }
        })

        if (user) {
            //Update user data if it exsits
            await prisma.user.update({
                where: { id: data.id },
                data: {
                    email: data?.email_addresses[0]?.email_address,
                    name: data?.first_name + " " + data?.last_name,
                    image: data?.image_url,
                }
            })
            return
        }

        //Suppose the user is not available
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        })

    },
);

//Inngest Function to delete the user from database
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { data } = event

        //Extract the listing of the user which the user is created
        const listings = await prisma.listing.findMany({
            where: { ownerId: data.id },
        })

        // Extract the Chats of the user which is done by the user 
        const chats = await prisma.chat.findMany({
            where: { OR: [{ ownerUserId: data.id }, { chatUserId: data.id }] }
        })

        //Extract the Transactions of the User
        const transactions = await prisma.transaction.findMany({
            where: { userId: data.id }
        })

        //Delete the user when all the above fields length == 0 why because the user is done any chat , transaction , or added the listings throught thier account can led to ambiguty
        if (listings.length == 0 && chats.length == 0 && transactions.length == 0) {
            await prisma.user.delete(
                { where: { id: data.id } }
            )
        } else {
            await prisma.listing.updateMany({
                where: { ownerId: data.id },
                data: { status: "inactive" }
            })
        }

    }
)

//Inngest function to Update the User data in the database
const syncUserUpdatation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { data } = event

        //Update the user
        await prisma.user.update({
            where: { id: data.id },
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url
            }
        })

    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdatation];