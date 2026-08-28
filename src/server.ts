import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.get('/api/vehicles', async (req: Request, res: Response) => {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
});

app.get('/api/vehicles/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
        where: { id: Number(id) }
    });

    if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado.' });
    }
    
    res.json(vehicle);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});