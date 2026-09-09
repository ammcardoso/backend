import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors';
import { z, ZodError } from 'zod'

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json()) 

app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

app.get('/api/vehicles', async (_req: Request, res: Response) => {
    try {
        const vehicles = await prisma.vehicle.findMany();
        return res.status(200).json(vehicles);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Erro ao consultar os veículos.'
        });
    }
});

app.get('/api/vehicles/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: 'ID inválido. Use um número inteiro positivo.'
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

        return res.status(200).json(vehicle);
    } catch (error) {
        return res.status(500).json({
            error: 'Erro interno do servidor.'
        });
    }
});


// Schema de criação de passagem do veículo
export const createVehicleSchema = z.object({
    plate: z.string().length(7, 'Placa deve ter exatamente 7 caracteres.'),
    type: z.enum(['car', 'truck', 'bus', 'motorcycle'], {
        message: 'Tipo inválido. Escolha entre: car, truck, bus ou motorcycle.'
    }),
    detectionTime: z.coerce.date({
        message: 'Informe uma data e hora de detecção válidas.'
    }),
    confidence: z.coerce.number({
        message: 'A confiança deve ser um número válido.'
    }).min(0, 'A confiança mínima é 0.').max(100, 'A confiança máxima é 100.'),
    imageUrl: z.string().min(1, 'O campo imageUrl não pode ser vazio.'),
});

/**
 * POST /api/vehicles — cria com validação
 */
app.post('/api/vehicles', async (req: Request, res: Response) => {
    try {
        const data = createVehicleSchema.parse(req.body) // valida e transforma
        const newVehicle = await prisma.vehicle.create({ data })
        return res.status(201).json(newVehicle)
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'Payload inválido',
                issues: error.issues.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            })
        }
        console.error('POST /api/vehicles error:', error)
        return res.status(500).json({ error: 'Erro interno no servidor ao criar veículo' })
    }
})

const updateVehicleSchema = createVehicleSchema.partial()

/**
 * PUT /api/vehicles/:id — atualização parcial com validação
 */
app.put('/api/vehicles/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido. Use um inteiro positivo.' })
    }

    try {
        const data = updateVehicleSchema.parse(req.body) // valida parciais
        const updated = await prisma.vehicle.update({ where: { id }, data })
        return res.status(200).json(updated)
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'Payload inválido',
                issues: error.issues.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            })
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ error: 'Veículo não encontrado' })
        }
        console.error(`PUT /api/vehicles/${req.params.id} error:`, error)
        return res.status(500).json({ error: 'Erro interno do servidor ao atualizar veículo' })
    }
})

/**
 * DELETE /api/vehicles/:id — remove item (204 se ok)
 */
app.delete('/api/vehicles/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido. Use um inteiro positivo.' })
    }

    try {
        await prisma.vehicle.delete({ where: { id } })
        return res.status(204).send() // sucesso sem body
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ error: 'Veículo não encontrado' })
        }
        console.error(`DELETE /api/vehicles/${req.params.id} error:`, error)
        return res.status(500).json({ error: 'Erro interno ao deletar veículo' })
    }
})


app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});