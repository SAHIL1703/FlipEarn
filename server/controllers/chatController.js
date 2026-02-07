import prisma from "../config/prisma.js";


//Controller For geting Chat (Create if not available)
export const getChat = async (req, res) => {
    try {
        //User
        const { userId } = await req.auth();
        const { listingId, chatId } = req.body;

        const listing = await prisma.listing.findUnique({
            where: { id: listingId }
        })

        if (!listing) {
            return res.status(400).json({ message: "Listing not Found" })
        }

        //Find the Listing Chats
        let existingChat = null;
        if (chatId) {
            existingChat = await prisma.chat.findFirst({
                where: { id: chatId, OR: [{ chatUserId: userId }, { ownerUserId: userId }] },
                include: { listing: true, ownerUser: true, chatUser: true, messages: true }
            })
        } else {
            existingChat = await prisma.chat.findFirst({
                where: { listingId, chatUserId: userId, ownerUserId: listing.ownerId },
                include: { listing: true, ownerUser: true, chatUser: true, messages: true }
            })
        }

        if (existingChat) {
            res.json({ chat: existingChat })
            if (existingChat.isLastMessageRead === false) {
                const lastMessage = existingChat.messages[existingChat.messages.length - 1]
                const isLastMessageSendByMe = lastMessage.sender_id === userId;

                if (!isLastMessageSendByMe) {
                    await prisma.chat.update({
                        where : {id : existingChat.id},
                        data : {isLastMessageRead : true},
                    })
                }
            }
            return null;
        }

        //Create New Chat
        const newChat = await prisma.chat.create({
            data : {
                listingId,
                chatUserId : userId,
                ownerUserId : listing.ownerId,
            }
        })

        const chatWithData = await prisma.chat.findUnique({
            where : {id : newChat.id},
            include : {listing : true, ownerUser : true , chatUser: true}
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}

//Controller For Getting All Chats for User
export const getAllUserChats = async(req,res)=>{
    try {
        const {userId} = await req.auth();
        const chat = await prisma.chat.findMany({
            where : {OR : [{chatUserId : userId , ownerUserId : userId}]},
            include : {listing : true, ownerUser : true, chatUser : true},
            orderBy : {updatedAt : "desc"}
        })

        if(!chat || chat.length === 0){
            
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}