const express = require("express");
const router = express.Router();
<<<<<<< HEAD

let usuarios = {
  "202376010": {
    saldo: 30.0,
    historico:[
      { dataHora: "2025-06-09T10:00:00-03:00", tipo: 'Recarga', valor: 30.00 },
      { dataHora: "2025-06-08T12:10:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-07T19:18:00-03:00", tipo: 'Jantar', valor: -1.40 },
      { dataHora: "2025-06-07T13:05:00-03:00", tipo: 'Recarga', valor: 20.00 },
      { dataHora: "2025-06-07T12:08:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-06T19:15:00-03:00", tipo: 'Jantar', valor: -1.40 },
      { dataHora: "2025-06-06T12:11:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-05T19:20:00-03:00", tipo: 'Jantar', valor: -1.40 },
      { dataHora: "2025-06-05T12:09:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-04T19:19:00-03:00", tipo: 'Jantar', valor: -1.40 },
      { dataHora: "2025-06-04T12:12:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-03T19:17:00-03:00", tipo: 'Jantar', valor: -1.40 },
      { dataHora: "2025-06-03T12:10:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-02T19:16:00-03:00", tipo: 'Jantar', valor: -1.40 },
      { dataHora: "2025-06-02T12:13:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-01T14:00:00-03:00", tipo: 'Recarga', valor: 15.00 },
    ]
  },
  "202312345": {
    saldo: -25.0,
    historico:[
      { dataHora: "2025-06-09T11:00:00-03:00", tipo: 'Recarga', valor: 10.00 },
      { dataHora: "2025-06-08T19:25:00-03:00", tipo: 'Jantar', valor: -1.40 },
    ]
  },
  "202398765": {
    saldo: 10.5,
    historico:[
      { dataHora: "2025-06-08T12:10:00-03:00", tipo: 'Almoço', valor: -1.40 },
      { dataHora: "2025-06-07T19:18:00-03:00", tipo: 'Jantar', valor: -1.40 },
      { dataHora: "2025-06-07T13:05:00-03:00", tipo: 'Recarga', valor: 20.00 },
      { dataHora: "2025-06-07T12:08:00-03:00", tipo: 'Almoço', valor: -1.40 },
    ]
  },
=======
let historico = {};
]//matriculas de exemplo para teste
let saldos = {
  202312345: 25.0,
  202398765: 10.5,
>>>>>>> 837a9a274076f2749a23c4332c793362cdb19c0e
};

//obter usuário

<<<<<<< HEAD
router.get("/saldo/:matricula", (req, res) => {
  const {matricula} = req.params;
  const usuario = usuarios[matricula];

  if (usuario) {
    res.json({saldo: usuario.saldo});
=======
  if (saldos[matricula] !== undefined) {
    res.json({
      matricula: matricula,
      saldo: saldos[matricula],
    });
    //caso a matricula não exista nos dados, retorna erro
>>>>>>> 837a9a274076f2749a23c4332c793362cdb19c0e
  } else {
    res.status(404).json({ erro: "Matrícula não encontrada." });
  }
});

<<<<<<< HEAD
//obter extrato do usuário
router.get('/historico/:matricula',(req,res)=>{
  const {matricula} = req.params;
  const usuario = usuarios[matricula];

  const page = parseInt(req.query.page)||1;
  const limit = parseInt(req.query.limit)|| 10;

  if(usuario && usuario.historico){
    const historicoOrdenado = usuario.historico.sort((a,b)=> new Date (b.dataHora)-new Date (a.dataHora));
    const totalItems = historicoOrdenado.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const items = historicoOrdenado.slice(startIndex, endIndex);
=======
router.post("/:matricula", (req, res) => {
  const matricula = req.params.matricula;
  const { valor } = req.body;
// se for digitado algo diferente de um numero ou um numero menor ou igual a 0, retorna erro
  if (typeof valor !== "number" || valor <= 0) {
    return res.status(400).json({ erro: "Valor de recarga inválido." });
  }
// atuaiza o sado com o valor da recarga
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
>>>>>>> 837a9a274076f2749a23c4332c793362cdb19c0e

    res.json({
      items: items,
      totalItems: totalItems,
      totalPages: totalPages,
      currentPage: page
    });
  }else{
    res.status(404).json({erro:"Histórico não encontrato para esta matrícula."});
  }

})

//add recarga
router.post("/recarga", (req, res) => {
  const { matricula, valor } = req.body;
  const usuario = usuarios[matricula];

  if (!usuario) { 
    return res.status(404).json({ erro: "Matrícula não encontrada." }); 
  }

  const valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico) || valorNumerico <= 0) { 
    return res.status(400).json({ erro: "Valor inválido." }); 
  }
  
  usuario.saldo += valorNumerico;
  usuario.historico.push({ dataHora: new Date().toISOString(), tipo: 'Recarga', valor: valorNumerico });
  
  res.json({ mensagem: `Recarga de R$ ${valorNumerico.toFixed(2)} realizada!`, novoSaldo: usuario.saldo });

});

module.exports = router;
