import express, { Request, Response } from 'express';

// Cria uma instância da aplicação Express
const app = express();

// Define a porta em que o servidor vai rodar
// Usamos 3001 para não conflitar com o front-end (que geralmente usa 3000 ou 5173)
const PORT = 3001;

// --- DADOS FALSOS (MOCK) ---
// Vamos criar um array de produtos que segue a mesma estrutura do front-end
const mockProducts = [
    {
        id: 1,
        title: "Notebook de Última Geração",
        description: "Um notebook poderoso para trabalho e lazer.",
        price: 4500.00,
        imageUrl: "/images/notebook.png", // Usando caminhos relativos como no projeto front-end
        isFeatured: true
    },
    {
        id: 2,
        title: "Smartphone Avançado",
        description: "Capture os melhores momentos com uma câmera de alta resolução.",
        price: 2800.00,
        imageUrl: "/images/smartphone.png"
    },
    {
        id: 3,
        title: "Teclado Mecânico RGB",
        description: "Alta performance e feedback tátil para gamers e programadores.",
        price: 350.50,
        imageUrl: "/images/teclado.png",
        isFeatured: true
    },
    {
        id: 4,
        title: "Mouse Ergonômico Sem Fio",
        description: "Conforto e precisão para longas horas de uso.",
        price: 120.00,
        imageUrl: "/images/mouse.png"
    }
];
// --- FIM DOS DADOS FALSOS ---

// Define uma rota inicial (endpoint) para o nosso servidor
// Quando alguém acessar a raiz ('/') com o método GET...
app.get('/', (req: Request, res: Response) => {
    // ...nós responderemos com um objeto JSON.
    res.json({ message: 'Olá, mundo! Bem-vindo à API do nosso Catálogo de Produtos!' });
});

// NOVO ENDPOINT: Listagem de todos os produtos
app.get('/api/products', (req: Request, res: Response) => {
    console.log('Requisição para /api/products recebida!');
    res.json(mockProducts);
});

// Inicia o servidor e o faz "escutar" por requisições na porta definida
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
});

