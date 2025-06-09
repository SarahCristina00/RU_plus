const express = require("express");
const app = express();
const recargaRoutes = require("../routes/recargas");

app.use(express.static("public"));

app.use(express.json());

app.use("/recargas", recargaRoutes);

app.get("/", (req, res) => {
  res.send("RU+ está no ar");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
