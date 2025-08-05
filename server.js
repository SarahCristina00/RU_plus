const express = require("express");
const app = express();
const rotasRecarga = require("./routes/rotasRecarga");

app.use(express.static("public"));
app.use(express.json());

app.use("/recargas", rotasRecarga);

app.get("/", (req, res) => {
  res.send("RU+ está no ar");
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
