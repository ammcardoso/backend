import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
    const vehicles = await prisma.vehicle.findMany()

    vehicles.forEach(vehicle => {
        console.log(`${vehicle.plate} - ${vehicle.type} (${vehicle.confidence})`)
    })
}

test()
