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


// Rota para realizar recarga com validação de entrada
const validarEntradaRecarga = (req, res, next) => {
    const { matricula, valor } = req.body;

    if (!matricula || !valor) {
        return res.status(400).json({ erro: 'Matrícula e valor são obrigatórios.' });
    }

    const valorNumerico = parseFloat(valor);
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        return res.status(400).json({ erro: 'O valor da recarga deve ser um número positivo.' });
    }

    if (valorNumerico > 300) { 
         return res.status(400).json({ erro: 'O valor máximo por recarga é R$ 300,00.' });
    }

    next(); 
};


router.post("/recarga", validarEntradaRecarga, (req, res) => controlador.recarregar(req, res));

module.exports = router;