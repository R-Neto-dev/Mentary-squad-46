import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { pool } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));