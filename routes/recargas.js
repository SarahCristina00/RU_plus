const express = require("express");
const router = express.Router();
let historico = {};

let saldos = {
  202312345: 25.0,
  202398765: 10.5,
};

router.get("/saldo/:matricula", (req, res) => {
  const matricula = req.params.matricula;

  if (saldos[matricula] !== undefined) {
    res.json({
      matricula: matricula,
      saldo: saldos[matricula],
    });
  } else {
    res.status(404).json({ erro: "Matrícula não encontrada." });
  }
});

router.post("/:matricula", (req, res) => {
  const matricula = req.params.matricula;
  const { valor } = req.body;

  if (typeof valor !== "number" || valor <= 0) {
    return res.status(400).json({ erro: "Valor de recarga inválido." });
  }

  saldos[matricula] += valor;

  if (!historico[matricula]) {
    historico[matricula] = [];
  }

  historico[matricula].push({
    data: new Date().toISOString(),
    valor: valor,
  });

  res.json({
    mensagem: `Recarga de R$${valor.toFixed(2)} realizada com sucesso.`,
    saldoAtual: saldos[matricula],
  });

  router.get("/historico/:matricula", (req, res) => {
    const matricula = req.params.matricula;

    if (!historico[matricula]) {
      return res
        .status(404)
        .json({ erro: "Nenhum histórico encontrado para esta matrícula." });
    }

    res.json({
      matricula,
      recargas: historico[matricula],
    });
  });
});

module.exports = router;
