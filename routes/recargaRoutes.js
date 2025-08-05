const express = require("express");
const router = express.Router();
const RecargaController = require("../controllers/RecargaController");

router.get("/saldo/:matricula", (req, res) =>
  RecargaController.getSaldo(req, res),
);
router.get("/historico/:matricula", (req, res) =>
  RecargaController.getHistorico(req, res),
);
router.post("/recarga", (req, res) => RecargaController.recarregar(req, res));

module.exports = router;
