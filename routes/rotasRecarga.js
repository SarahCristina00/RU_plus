const express = require("express");
const router = express.Router();
const ControladorRecarga = require("../controllers/ControladorRecarga");

const controlador = new ControladorRecarga();

// Rotas
router.get("/saldo/:matricula", (req, res) =>
  controlador.getSaldo(req, res),
);

router.get("/historico/:matricula", (req, res) =>
  controlador.getHistorico(req, res),
);

router.post("/recarga", (req, res) => controlador.recarregar(req, res));

module.exports = router;
