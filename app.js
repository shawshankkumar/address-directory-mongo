const express= require('express');
const app=express();
const MongoClient = require("mongodb").MongoClient;
app.use(express.json());//Middleware
app.use(express.urlencoded({extended:true}));//Middleware

//add mongodb link to make sure this works

const client = new MongoClient("", {
  useUnifiedTopology: true,
});

let collection;
const testfunc = async() =>{
    try{
        await client.connect();
        console.log("Connect ho gya.");
        collection = client.db().collection("directory");// the data being stored, pulled and manipulated is in the collection "directory"
     }
    catch(err){
        console.error(err);
        process.exit(-1);
    }
}

//to display the data in the database

app.get('/', async(req, res) => {
    let datain= await collection.find({}).toArray();;
    res.json(datain);
});

//post takes in data and stores it in the collection

app.post('/', async(req,res) => {
    let datain=req.body;
    await collection.insertOne(datain);
    res.send("Your data has been saved, it is now secure with us.");
});

//put replaces or makes changes in the data 

app.put('/', async(req,res)=>{
    let datain=req.body;
    let datainrep=datain.name;
    let data= await collection.findOne({name: datainrep});
    data.address=datain.address;
    await collection.replaceOne({name: datainrep}, data);
    res.send("Replaced successfully");
});

//deletes entries in the collection

app.delete('/', async(req,res)=>{
    let datain=req.body;
    await collection.deleteOne({name: datain.name});
    res.send("Deleted");
});

//calls the test function and activates a port

testfunc().then(() => {
    app.listen(6789, ()=> {
        console.log("Who dareth awaken the server?");
    })
})