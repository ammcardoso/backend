import express, { Request, Response } from 'express';

const app = express();
const PORT = 3001;
const mockVehicles = [
    {
        id: 1,
        plate: "ABC1D23",
        type: "car",
        detectionTime: "2025-08-22T20:42:33.000Z",
        confidence: 98.50,
        imageUrl: "/images/car.png"
    },
    {
        id: 2,
        plate: "XYZ9E87",
        type: "motorcycle",
        detectionTime: "2025-08-22T20:43:10.000Z",
        confidence: 94.75,
        imageUrl: "/images/motorcycle.png"
    },
    {
        id: 3,
        plate: "QWE4R56",
        type: "truck",
        detectionTime: "2025-08-22T20:44:02.000Z",
        confidence: 91.20,
        imageUrl: "/images/truck.png"
    },
    {
        id: 4,
        plate: "JKL7M89",
        type: "bus",
        detectionTime: "2025-08-22T20:45:18.000Z",
        confidence: 89.90,
        imageUrl: "/images/bus.png"
    }
];
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Olá, mundo! Bem-vindo à API de Veículos!' });
});

app.get('/api/vehicles', (req: Request, res: Response) => {
    console.log('Requisição para /api/vehicles recebida!');
    res.json(mockVehicles);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});

