import { PrismaClient, Prisma } from '@prisma/client'

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
                confidence: new Prisma.Decimal('98.50'),
                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80"
            },
            {
                plate: "XYZ9E87",
                type: "motorcycle",
                detectionTime: new Date("2025-08-22T20:43:10.000Z"),
                confidence: new Prisma.Decimal('94.75'),
                imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80"
            },
            {
                plate: "QWE4R56",
                type: "truck",
                detectionTime: new Date("2025-08-22T20:44:02.000Z"),
                confidence: new Prisma.Decimal('91.20'),
                imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&q=80"
            },
            {
                plate: "JKL7M89",
                type: "bus",
                detectionTime: new Date("2025-08-22T20:45:18.000Z"),
                confidence: new Prisma.Decimal('89.90'),
                imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&q=80"
            },
            {
                plate: "MNO1P23",
                type: "van",
                detectionTime: new Date("2025-08-22T20:45:18.000Z"),
                confidence: new Prisma.Decimal('96.10'),
                imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80"
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