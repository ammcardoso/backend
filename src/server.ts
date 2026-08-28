import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

const PORT = 3001;

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.get('/api/vehicles', async (req: Request, res: Response) => {
    try {
        const vehicles = await prisma.vehicle.findMany();
        res.json(vehicles);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'Erro ao consultar os veículos.'
        });
    }
});

app.get('/api/vehicles/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'ID deve ser um número inteiro positivo.'
        });
    }

    const vehicle = await prisma.vehicle.findUnique({
        where: { id }
    });

    if (!vehicle) {
        return res.status(404).json({
            error: 'Veículo não encontrado.'
        });
    }

    res.json(vehicle);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});