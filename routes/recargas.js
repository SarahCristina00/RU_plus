const express = require("express");
const router = express.Router();

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
    saldo: 25.0,
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
};

//obter usuário

router.get("/saldo/:matricula", (req, res) => {
  const {matricula} = req.params;
  const usuario = usuarios[matricula];

  if (usuario) {
    res.json({saldo: usuario.saldo});
  } else {
    res.status(404).json({ erro: "Matrícula não encontrada." });
  }
});

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
