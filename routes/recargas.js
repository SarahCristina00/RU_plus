const express = require("express");
const router = express.Router();

//exemplo de dados
let saldos = {
  "202312345": 25.00, // exemplo de aluno
  "202398765": 10.50
};

// GET /recargas/saldo/:matricula

router.get("/saldo/:matricula", (req, res) => {
  const matricula = req.params.matricula;

  if (saldos[matricula] !== undefined) {
    res.json({
      matricula: matricula,
      saldo: saldos[matricula]
    });
  } else {
    res.status(404).json({ erro: "Matrícula não encontrada." });
  }
});

module.exports = router;