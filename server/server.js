//Create the Basic Server
import express from "express"
import "dotenv/config";
import cors from "cors";

const app = express();

//Adding the Middleware
app.use(express.json());
app.use(cors());


app.get("/" , (req,res)=>{
    res.send("Server is Live")
})

//Adding PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`);
})