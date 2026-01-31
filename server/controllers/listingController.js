import imagekit from "../config/imagekit.js";
import prisma from "../config/prisma.js";
import fs from "fs"

//Controller for adding Listing to Database
export const addListing = async (req, res) => {
    try {
        //First Step : Get user Id
        console.log(await req.auth());
        const { userId } = await req.auth();
        if (req.plan !== "premium") {
            //Count the Total Number of added list using the userId
            //Means user is in free plan
            const listingCount = await prisma.listing.count({
                where: { ownerId: userId }
            })

            if (listingCount >= 5) {
                return res.status(400).json({ message: "you have reached the free listing limit" })
            }
        }
        const accountDetails = JSON.parse(req.body.accountDetails);

        //Converting the Data in the Neon database standard
        accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        accountDetails.price = parseFloat(accountDetails.price);

        //convert the data in lowwer case
        accountDetails.platform = accountDetails.platform.toLowerCase();
        accountDetails.niche = accountDetails.niche.toLowerCase();

        //Remove the @ from the username
        accountDetails.username.startsWith("@") ? accountDetails.username.slice(1) : null

        //Uploading the images to the cloud
        const uploadImages = req.files.map(async (file) => {
            const response = await imagekit.files.upload({
                file: fs.createReadStream(file.path),
                fileName: `${Date.now()}.png`,
                folder: "flip-earn",
                transformation: { pre: "w-1280,h-auto" }
            });
            return response.url;
        })

        //Wait for all uploads to complete
        const images = await Promise.all(uploadImages);
        console.log(images);

        //Add the listing to the database
        const listing = await prisma.listing.create({
            data: {
                ownerId: userId,
                images,
                ...accountDetails
            }
        })

        return res.status(201).json({ message: "Account Listed successfully", listing })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}


//Controller for getting all public listing
export const getAllPublicListing = async (req, res) => {
    try {
        const listing = await prisma.listing.findMany({
            where: { status: "active" },
            include: { owner: true },
            orderBy: { createdAt: "desc" },
        })

        if (!listing || listing.length === 0) {
            return res.json({ listing: [] })
        }
        return res.json({ listing: listing })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}

//Controller for Getting all the users listings
export const getAllUserListing = async (req, res) => {
    try {
        //Extract the UserId
        const { userId } = req.auth();

        //Find all the listing of the Users except deleted
        const listing = await prisma.listing.findMany({
            where: { ownerId: userId, status: { not: "deleted" } },
            orderBy: { createdAt: "desc" }
        })

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        const balance = {
            earned: user.earned,
            withdrawn: user.withdrawn,
            available: user.earned - user.withdrawn
        }

        if (!listing || listing.length === 0) {
            return res.json({ listing: [], balance })
        }
        return res.json({ listing, balance })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}

// Controller for Updating the Listings in the DataBase 
export const updateListing = async (req, res) => {
    try {
        //Extract the userId
        const { userId } = req.auth();
        const accountDetails = JSON.parse(req.body.accountDetails);

        if (req.files.length + accountDetails.images.length > 5) {
            return res.status(400).json({ message: "You can only upload up to 5 images" })
        }

        //Converting the Data in the Neon database standard
        accountDetails.followers_count = parseFloat(accountDetails.followers_count);
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
        accountDetails.price = parseFloat(accountDetails.price);

        //convert the data in lowwer case
        accountDetails.platform = accountDetails.platform.toLowerCase();
        accountDetails.niche = accountDetails.niche.toLowerCase();

        //Remove the @ from the username
        accountDetails.username.startsWith("@") ? accountDetails.username.slice(1) : null

        const listing = await prisma.listing.update({
            where: { id: accountDetails.id, ownerId: userId },
            data: { accountDetails }
        })

        if (!listing) {
            return res.status(404).json({ message: "Listing Not Found" })
        }

        if (listing.status === "sold") {
            return res.status(400).json({ message: "You cannot update the sold listings" })
        }

        if (req.files.length > 0) {
            //Uploading the images to the cloud
            const uploadImages = req.files.map(async (file) => {
                const response = await imagekit.files.upload({
                    file: fs.createReadStream(file.path),
                    fileName: `${Date.now()}.png`,
                    folder: "flip-earn",
                    transformation: { pre: "w-1280,h-auto" }
                });
                return response.url;
            })

            //Wait for all uploads to complete
            const images = await Promise.all(uploadImages);
            console.log(images);

            //Update the images
            const listing = await prisma.listing.update({
                where: { id: accountDetails.id, id: ownerId },
                data: {
                    ownerId: userId,
                    ...accountDetails,
                    images: [...accountDetails.images, ...images]
                }
            })
            return res.json({ message: "Account updated successfully", listing })
        }
        return res.json({ message: "Account updated successfully", listing })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}

export const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.auth();

        const listing = await prisma.listing.findUnique({
            where: { id: id, ownerId: userId }
        })

        if (!listing) {
            return res.status(404).json({ message: "Listing Not Found" })
        }

        if (listing.status === 'active' || listing.status === 'inactive') {
            await prisma.listing.update({
                where: { id: id, ownerId: userId },
                data: {
                    status: listing.status === "active" ? "inactive" : "active"
                }
            })
        } else if (listing.status === "ban") {
            return res.status(400).json({ message: "Your Listing is banned" })
        } else if (listing.status === "sold") {
            return res.status(400).json({ message: "Your Listing is sold" })
        }
        return res.json({ message: "Listing Status Updated Successfully" })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}

//Controller to Delete user listing
export const deleteUserListing = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { listingId } = req.params

        //Const find the listing 
        const listing = await prisma.listing.findFirst({
            where: { id: listingId, ownerId: userId },
            include: { owner: true },
        })

        if (!listing) {
            return res.status(400).json({ message: "Listing Not Found" })
        }

        if (listing.status === "sold") {
            return res.status(400).json({ message: "Your Listing is sold" })
        }

        // If password has been changed, send the new password to the owner
        if (listing.isCredentialChanged) {
            //send image to owner
        }

        await prisma.listing.update({
            where: { id: listingId },
            data: { status: "deleted" }
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.code || error.message })
    }
}