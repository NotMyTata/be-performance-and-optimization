const express = require('express')
const { PrismaClient, VehicleType } =  require('./generated/prisma')
const { body, validationResult } = require('express-validator')

// const prisma = new PrismaClient({
//     log: ['query', 'info'],
// })
const prisma = new PrismaClient({
    log: ['info'],
})
const app = express()
const port = 3000

app.use(express.json())

prisma.$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
})




app.get('/wni', async (req, res) => {
    try {
        const id = req.query.id
        const wnis = await prisma.wni.findFirst({
            where: { id: Number(id) },
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

        const wni = await prisma.wni.create({
            data: { nik, name, vehicleId }
        })
        // const wni_idx = await prisma.wni_index.create({
        //     data: { nik, name, vehicleId }
        // })

        res.json(wni)
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured");
    }
})




app.get('/vehicle', async (req, res) => {
    try {
        const id = req.query.id

        const vehicle = await prisma.vehicle.findFirst({
            where: { id: Number(id) }
        });

        res.json(vehicle);
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
        .isLength({ min: 6, max: 8 }).withMessage('Number plate\'s length must be >= 6 and <= 8'),
], async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({ errors: errors.array() })
        }

        const { name, type, plate } = req.body

        const vehicle = await prisma.vehicle.create({
            data: { name, type, plate }
        })
        // const vehicle_idx = await prisma.vehicle_index.create({
        //     data: { name, type, plate }
        // })

        res.json(vehicle)
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured");
    }
})




app.get('/indexNo', async (req, res) => {
    const type = req.query.type

    const start = Date.now()
    const result = await prisma.vehicle.findMany({
        where: { type: type }
    })
    const end = Date.now()

    res.json({
        data_count: result.length,
        time: `${end-start}ms`
    });
})

app.get('/indexYes', async (req, res) => {
    const type = req.query.type

    const start = Date.now()
    const result = await prisma.vehicle_index.findMany({
        where: { type: type }
    })
    const end = Date.now()

    res.json({
        data_count: result.length,
        time: `${end-start}ms`
    });
})

app.listen(port, () => {
    console.log(`Server DB Indexing & Query Opt is running in http://localhost:${port}`)
})









app.get('/', async (_, res) => {
    await Promise.all(
        Array.from({ length: 50 }).map(() =>
            prisma.vehicle.findMany({ where: { type: 'Car' } })
        )
    )
    res.send("HihihiHa")
})









// Bulk Insert

app.post('/wni/fake', async (_, res) => {
    try {
        const n = 999999;

        const wniData = [];
        const wni_indexData = [];

        for (let i = 1; i <= n; i++) {
            const name = Math.random() < 0.5 ? "Sule" : "Prikitiw";
            const nik = "1234567890" + String(i).padStart(6, "0");

            wniData.push({ nik, name, vehicleId: i });
            wni_indexData.push({ nik, name, vehicleId: i });
        }

        await prisma.wni.createMany({ data: wniData, skipDuplicates: true });
        await prisma.wni_index.createMany({ data: wni_indexData, skipDuplicates: true });     

        res.send("Nice")
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured")
    }
})

app.post('/vehicle/fake', async (_, res) => {
    try {
        const n = 999999;

        const vehicles = [];
        const vehicles_index = [];

        for (let i = 1; i <= n; i++) {
            const types = Object.values(VehicleType);
            const type = types[Math.floor(Math.random() * types.length)];
            let name;
            switch(type){
                case VehicleType.Car: name = "Civic"; break;
                case VehicleType.Motorcycle: name = "Scoopy"; break;
                case VehicleType.Bicycle: name = "Polygon"; break;
                case VehicleType.Boat: name = "Yamaha 24Ft"; break;
                case VehicleType.Plane: name = "Boeing 737"; break;
            }
            const plate = `L${i}A`;

            vehicles.push({ name, type, plate });
            vehicles_index.push({ name, type, plate });
        }

        await prisma.vehicle.createMany({ data: vehicles, skipDuplicates: true });
        await prisma.vehicle_index.createMany({ data: vehicles_index, skipDuplicates: true });

        res.send("Nice");
    } catch(error) {
        res.status(500).json(error instanceof Error? error.message : "Error occured")
    }
})


// Insert one by one inside loop

// app.post('/wni/fake', async (_, res) => {
//     try {
//         const n = 9999;
//         for(let i = 1; i <= n; i++){
//             const name = Math.random() < 0.5? "Sule" : "Prikitiw"

//             await prisma.wni.create({
//                 data: { nik: `123456789012${i < 1000? i < 100? i < 10? '000'+i : '00'+i : '0'+i : i}`, name, vehicleId: i }
//             })
//             await prisma.wni_index.create({
//                 data: { nik: `123456789012${i < 1000? i < 100? i < 10? '000'+i : '00'+i : '0'+i : i}`, name, vehicleId: i }
//             })
//         }        

//         res.send("Nice")
//     } catch(error) {
//         res.status(500).json(error instanceof Error? error.message : "Error occured")
//     }
// })

// app.post('/vehicle/fake', async (_, res) => {
//     try {
//         const n = 9999;
//         for(let i = 1; i <= n; i++){
//             const types = Object.values(VehicleType);
//             const type = types[Math.floor(Math.random() * types.length)];
//             let name
//             switch(type){
//                 case VehicleType.Car: name = "Civic"; break;
//                 case VehicleType.Motorcycle: name = "Scoopy"; break;
//                 case VehicleType.Bicycle: name = "Polygon"; break;
//                 case VehicleType.Boat: name = "Yamaha 24Ft"; break;
//                 case VehicleType.Plane: name = "Boeing 737"; break;
//             }

//             await prisma.vehicle.create({
//                 data: { name, type, plate: `L${i}A` }
//             })
//             await prisma.vehicle_index.create({
//                 data: { name, type, plate: `L${i}A` }
//             })
//         }

//         res.send("Nice");
//     } catch(error) {
//         res.status(500).json(error instanceof Error? error.message : "Error occured")
//     }
// })