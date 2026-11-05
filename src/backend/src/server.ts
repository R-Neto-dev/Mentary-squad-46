import express from "express";
import cors from "cors";
import multer from "multer";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { pool } from "./db";
import {
  extractFile,
  isUnsupportedFormatError,
} from "./extractor";

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Mentary - Squad 46", version: "0.1.0" },
  },
  apis: ["./src/**/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Verifica se a API está no ar
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * @openapi
 * /health/db:
 *   get:
 *     summary: Verifica a conexão com o banco
 *     responses:
 *       200:
 *         description: Banco conectado
 *       500:
 *         description: Falha na conexão
 */
app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query("select now() as agora");
    res.json({ status: "ok", agora: result.rows[0].agora });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "erro", message: "Falha ao conectar no banco" });
  }
});

/**
 * @openapi
 * /extract:
 *   post:
 *     summary: Extrai e separa questões de um arquivo
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Prévia das questões extraídas
 *       400:
 *         description: Arquivo ausente, inválido ou maior que 10 MB
 *       415:
 *         description: Formato não suportado
 */
app.post("/extract", upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    res.status(400).json({
      status: "erro",
      message: "Envie um arquivo no campo multipart 'file'.",
    });
    return;
  }

  try {
    const result = await extractFile(req.file);
    res.json({ status: "ok", data: result });
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "O arquivo excede o limite de 10 MB."
      : error.message;
    res.status(400).json({ status: "erro", message });
    return;
  }
  if (isUnsupportedFormatError(error)) {
    res.status(415).json({ status: "erro", message: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({
    status: "erro",
    message: error instanceof Error ? error.message : "Falha ao extrair o arquivo.",
  });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));