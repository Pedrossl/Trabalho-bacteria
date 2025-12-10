import cors from "cors";
import express from "express";
import sqlite3 from "sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./bacteria.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Conectado ao banco SQLite");
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

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
