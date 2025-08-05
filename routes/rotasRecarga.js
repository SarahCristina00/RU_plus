const express = require("express");
const router = express.Router();
const ControladorRecarga = require("../controllers/ControladorRecarga");

// Rotas
router.get("/saldo/:matricula", (req, res) =>
  ControladorRecarga.getSaldo(req, res),
);
router.get("/historico/:matricula", (req, res) =>
  ControladorRecarga.getHistorico(req, res),
);
router.post("/recarga", (req, res) =>
  ControladorRecarga.realizarRecarga(req, res),
);

module.exports = router;
