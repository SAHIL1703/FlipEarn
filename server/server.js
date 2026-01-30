//Create the Basic Server
import express from "express"
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();

//Adding the Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());



app.get("/" , (req,res)=>{
    res.send("Server is Live")
})

app.use("/api/inngest", serve({ client: inngest, functions }));

//Adding PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`);
})