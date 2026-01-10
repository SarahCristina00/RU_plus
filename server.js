require('dotenv').config();

const express = require("express");
const path = require("path");
const app = express();
const rotasRecarga = require("./routes/rotasRecarga");

app.use(express.static("public"));
app.use(express.json());

app.use("/recargas", rotasRecarga);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    const dataHora = new Date().toISOString();
    console.log(`[LOG - ${dataHora}] Requisição recebida: ${req.method} ${req.url}`);
    next();
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});

app.use((err, req, res, next) => {
    console.error('ERRO CRÍTICO NO SERVIDOR:', err.stack);
    res.status(500).json({ 
        erro: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
        detalhe: err.message 
    });
});