import express, { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors';
import { z, ZodError } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json())

// Schemas de validação para autenticação
const registerSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    name: z.string().optional()
})

const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória')
})

// Chave secreta para JWT (em produção, isso vai para variável de ambiente)
const JWT_SECRET = 'seu_jwt_secret_super_seguro_aqui'

// Interface para estender o Request do Express
interface AuthRequest extends Request {
    user?: {
        id: number
        email: string
        name?: string | null
    }
}

/**
 * Middleware de autenticação
 * - Extrai token do header Authorization
 * - Verifica se token é válido
 * - Busca usuário no banco
 * - Anexa usuário à requisição para uso posterior
 */
const authMiddleware = async (req: AuthRequest, res: Response, next: any) => {
    try {
        // 1. Extrair token do header Authorization
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({ error: 'Token de acesso não fornecido' })
        }

        // Header deve ser: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Formato do token inválido' })
        }

        // 2. Verificar se token é válido
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }

        // 3. Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true } // Não buscar a senha
        })

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' })
        }

        // 4. Anexar usuário à requisição
        req.user = user

        // 5. Continuar para a próxima função (rota final)
        next()

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Token inválido' })
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expirado' })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

// Rota simples só para conferir se o servidor está no ar
app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
});

/**
 * GET /api/auth/me
 * - Rota protegida para verificar se token está funcionando
 * - Retorna informações do usuário logado
 */
app.get('/api/auth/me', authMiddleware, (req: AuthRequest, res: Response) => {
    // Se chegou até aqui, o middleware já validou o token
    return res.status(200).json({
        message: 'Usuário autenticado',
        user: req.user
    })
})

/**
 * POST /api/auth/register
 * - Valida os dados de entrada
 * - Verifica se o email já existe
 * - Cria hash da senha
 * - Salva usuário no banco
 * - Retorna token JWT
 */
app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
        // 1. Validar dados de entrada
        const { email, password, name } = registerSchema.parse(req.body)

        // 2. Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ error: 'Email já está em uso' })
        }

        // 3. Criar hash da senha (10 rounds é um bom padrão de segurança)
        const hashedPassword = await bcrypt.hash(password, 10)

        // 4. Criar usuário no banco
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        })

        // 5. Gerar token JWT
        const token = jwt.sign(
            { userId: user.id }, // Payload: informações que queremos no token
            JWT_SECRET,
            { expiresIn: '7d' } // Token expira em 7 dias
        )

        // 6. Retornar sucesso (sem a senha!)
        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

/**
 * POST /api/auth/login
 * - Valida os dados de entrada
 * - Busca usuário pelo email
 * - Compara senha fornecida com hash salvo
 * - Retorna token JWT se autenticação for bem-sucedida
 */
app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
        // 1. Validar dados de entrada
        const { email, password } = loginSchema.parse(req.body)

        // 2. Buscar usuário no banco
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos' })
        }

        // 3. Comparar senha fornecida com hash salvo
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou senha incorretos' })
        }

        // 4. Gerar token JWT
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: '7d' }
        )

        // 5. Retornar sucesso
        return res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message })
        }
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
})


/**
 * GET /api/vehicles
 * - Busca todos os veículos direto no banco via Prisma
 * - Retorna um array de veículos
 */
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

/**
 * GET /api/vehicles/:id
 * - Converte o :id da URL para número
 * - Se o veículo existir, retorna 200 com o veículo
 * - Se não existir, retorna 404 com uma mensagem clara
 * - Se o id for inválido (NaN, negativo), retorna 400
 */
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

/**
 * Schemas Zod
 * - createVehicleSchema: criação (campos obrigatórios)
 * - updateVehicleSchema: atualização parcial (todos opcionais)
 */
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

// Atualizar as rotas existentes para usar o middleware

/**
 * POST /api/vehicles - AGORA PROTEGIDA
 * - Apenas usuários autenticados podem criar veículos
 */
app.post('/api/vehicles', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { plate, type, detectionTime, confidence, imageUrl } = createVehicleSchema.parse(req.body)

        const vehicle = await prisma.vehicle.create({
            data: { plate, type, detectionTime, confidence, imageUrl }
        })

        return res.status(201).json({
            message: 'Veículo criado com sucesso',
            vehicle
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0].message })
        }
        return res.status(500).json({ error: 'Erro ao criar veículo' })
    }
})

const updateVehicleSchema = createVehicleSchema.partial()

/**
 * PUT /api/vehicles/:id - AGORA PROTEGIDA
 */
app.put('/api/vehicles/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        const data = updateVehicleSchema.parse(req.body)

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data
        })

        return res.status(200).json({
            message: 'Veículo atualizado com sucesso',
            vehicle
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues[0]?.message ?? 'Dados inválidos' })
        }
        return res.status(500).json({ error: 'Erro ao atualizar veículo' })
    }
})

/**
 * DELETE /api/vehicles/:id - AGORA PROTEGIDA
 */
app.delete('/api/vehicles/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'ID inválido' })
    }

    try {
        await prisma.vehicle.delete({ where: { id } })

        return res.status(200).json({
            message: 'Veículo deletado com sucesso'
        })
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar veículo' })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});