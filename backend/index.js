import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));

const DB_PATH = process.env.DB_PATH || "./bacteria.db";
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Conectado ao banco SQLite:", DB_PATH);
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS registros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tensao REAL,
    tempoOperacao REAL,
    nivelRadiacao REAL,
    potencia REAL,
    repeticoes INTEGER,
    timestamp TEXT
  )
`);

app.post("/dados", (req, res) => {
  const { tensao, tempoOperacao, nivelRadiacao, potencia, repeticoes } =
    req.body;

  const timestamp = new Date().toISOString();

  db.run(
    `INSERT INTO registros (tensao, tempoOperacao, nivelRadiacao, potencia, repeticoes, timestamp)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tensao, tempoOperacao, nivelRadiacao, potencia, repeticoes, timestamp],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Erro ao salvar dados" });
      }

      const registro = {
        id: this.lastID,
        tensao,
        tempoOperacao,
        nivelRadiacao,
        potencia,
        repeticoes,
        timestamp,
      };

      return res.json({
        message: "Dados recebidos com sucesso",
        recebido: registro,
      });
    }
  );
});

app.get("/historico", (req, res) => {
  db.all(
    "SELECT * FROM registros ORDER BY timestamp DESC LIMIT 50",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar histórico" });
      }
      res.json(rows);
    }
  );
});

app.get("/estatisticas", (req, res) => {
  db.all(
    `SELECT
      COUNT(*) as total,
      AVG(tensao) as tensaoMedia,
      AVG(tempoOperacao) as tempoMedio,
      AVG(nivelRadiacao) as radiacaoMedia,
      AVG(potencia) as potenciaMedia,
      MIN(tensao) as tensaoMin,
      MAX(tensao) as tensaoMax,
      MIN(nivelRadiacao) as radiacaoMin,
      MAX(nivelRadiacao) as radiacaoMax
    FROM registros`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar estatísticas" });
      }
      res.json(rows[0]);
    }
  );
});

app.get("/todos", (req, res) => {
  db.all("SELECT * FROM registros ORDER BY timestamp DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
