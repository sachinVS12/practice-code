import express from 'express';

const app = express();

app.post("/", (req, res) => {
   res.send("Helloworld");
});

app.listen(3000, () => {
   console.log("server is running on port 3000");
});
