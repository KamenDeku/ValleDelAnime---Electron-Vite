import express from 'express';

const app = express();
app.use(express.json());

app.listen(process.env.APP_PORT)
console.log("Server listening on " + process.env.APP_PORT)
