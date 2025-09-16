import express from 'express';

const app = express();

app.post("/", (req, res) =>{
   res.send("hello samith r gowda");
});

app.listen(3000, ()=>{
   console.log("server is running on port 3000");
});