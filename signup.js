const express =require( "express");
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const dbURL = "mongodb+srv://praveenkumartv1:1234@praveendb.ac0h0.mongodb.net/?retryWrites=true&w=majority&appName=praveendb";
const dbName = "receivers";
//app initialization
const app = express();
const corsOptions = {
    origin: 'https://praveenkumartv.github.io', // Your frontend's origin
    optionsSuccessStatus: 200 // Some legacy browsers require this
  };
 
  // Enable CORS for all routes (or specific routes if you prefer)
  app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;




async function connectToDB() {
    try {
        const client = new MongoClient(dbURL);
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

app.post('/registerReceiver', async (req, res) => {
    try {
        const collection = db.collection('details');
        const obj = {
                typeOfDonor,
                businessName,
                contactName,
                mobileNumber,
                emailId,
                address,
                pinCode,
        } = req.body
        await collection.insertOne(obj);
        console.log(obj);

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save receiver details' });
    }
});

app.post('/receiverPosts',async(req,res)=>{
    try{
        const collection=db.collection('receiverPosts');
        const obj={
            foodDescription,
            foodQuantity,
            foodType,
            expiryTime,
            pickupAddress
        }=req.body;
        await collection.insertOne(obj);
        console.log(obj);
        res.status(201).json({message:"Post added successfully"});
    }catch(error){
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save receiver details' });
    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hi");
})



//app running
app.listen(5999,async ()=>{
    await connectToDB();
console.log("App is listening in port 5999")
});
