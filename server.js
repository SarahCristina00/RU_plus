const express = require("express");
const path = require("path");
const app = express();
const rotasRecarga = require("./routes/rotasRecarga");

app.use(express.static("public"));
app.use(express.json());

app.use("/recargas", rotasRecarga);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
