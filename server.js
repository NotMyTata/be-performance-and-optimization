const express = require('express');
const { PrismaClient } =  require('./generated/prisma');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
    console.log(`Server Connection Pool is running in http://localhost:${port}`);
})

app.get('/', (_, res) => {
    res.send('Hello World!!!!!');
})