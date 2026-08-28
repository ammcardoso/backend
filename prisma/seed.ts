import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando seed do banco de dados...')

    await prisma.vehicle.deleteMany()

    const vehicles = await prisma.vehicle.createMany({
        data: [
            {
                plate: "ABC1D23",
                type: "car",
                detectionTime: new Date("2025-08-22T20:42:33.000Z"),
                confidence: 98.50,
                imageUrl: "/images/car.png"
            },
            {
                plate: "XYZ9E87",
                type: "motorcycle",
                detectionTime: new Date("2025-08-22T20:43:10.000Z"),
                confidence: 94.75,
                imageUrl: "/images/motorcycle.png"
            },
            {
                plate: "QWE4R56",
                type: "truck",
                detectionTime: new Date("2025-08-22T20:44:02.000Z"),
                confidence: 91.20,
                imageUrl: "/images/truck.png"
            },
            {
                plate: "JKL7M89",
                type: "bus",
                detectionTime: new Date("2025-08-22T20:45:18.000Z"),
                confidence: 89.90,
                imageUrl: "/images/bus.png"
            }
        ]
    })

    console.log(`${vehicles.count} veículos registrados com sucesso!`)
}

main()
    .catch((e) => {
        console.error('Erro ao popular o banco:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })