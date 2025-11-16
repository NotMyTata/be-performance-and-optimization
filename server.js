const express = require('express')
const { PrismaClient, VehicleType } =  require('./generated/prisma')
const { body, validationResult } = require('express-validator')

const prisma = new PrismaClient({
    log: ['info'],
})
const app = express()
const port = 3000

app.use(express.json())

app.get('/wni', async (_, res) => {
    try {
        const wnis = await prisma.wni.findMany({
            include: {
                vehicle: true
            }
        })

        res.json(wnis)
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured");
    }
})

app.post('/wni', [
    body('nik')
        .notEmpty().withMessage('NIK required')
        .isString().withMessage('NIK must be a string')
        .trim()
        .isLength({ min: 16, max: 16 }).withMessage('NIK\'s length must be 16'),
    body('name')
        .notEmpty().withMessage('Name required')
        .isString().withMessage('Name must be a string')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Name\'s length must be >= 3 and <= 255'),
    body('vehicleId')
        .notEmpty().withMessage('Vehicle ID required')
        .isInt({ min: 0 }).withMessage('Vehicle ID must be a positive integer'),
], async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({ errors: errors.array() })
        }

        const { nik, name, vehicleId } = req.body

        for(let i = 1; i <= 100; i++){
            const wni = await prisma.wni.create({
                data: { nik: i < 100? i < 10? `abcABCabcABC000${i}` : `abcABCabcABC00${i}` : `abcABCabcABC0${i}`, name, vehicleId: i }
            })
        }

        res.json("yes")
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured");
    }
})

app.get('/vehicle', async (_, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany();

        res.json(vehicles);
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured");
    }
});

app.post('/vehicle', [
    body('name')
        .notEmpty().withMessage('Name required')
        .isString().withMessage('Name must be a string')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Name\'s length must be >= 3 and <= 255'),
    body('type')
        .notEmpty().withMessage('Type required')
        .trim()
        .isIn(Object.values(VehicleType)).withMessage('Type must be a Vehicle Type'),
    body('plate')
        .notEmpty().withMessage('Number plate required')
        .isString().withMessage('Number plate must be a string')
        .trim()
        .isLength({ min: 7, max: 8 }).withMessage('Number plate\'s length must be >= 7 and <= 8'),
], async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({ errors: errors.array() })
        }

        const { name, type, plate } = req.body

        for(let i = 1; i <= 100; i++){
            const vehicle = await prisma.vehicle.create({
                data: { name, type, plate: `L${i}AB` }
            })
        }

        res.json(vehicle)
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured" );
    }
})

app.get('/conpool', async (_, res) => {
    const queries = [];

    for (let i = 0; i < 95; i++) {
        queries.push(
            (async () => {
                const start = Date.now();
                await prisma.vehicle.findMany();
                const end = Date.now();

                return `Query time [${i}]: ${end - start}ms`;
            })()
        );
    }

    const results = await Promise.all(queries);

    res.send(results.join('\n'));
})

app.listen(port, () => {
    console.log(`Server Connection Pool is running in http://localhost:${port}`)
})