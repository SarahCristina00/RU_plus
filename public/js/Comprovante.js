const dados = JSON.parse(localStorage.getItem('dadosComprovante'));

if (dados) {
    document.getElementById('nome').textContent = dados.nome;
    document.getElementById('valor').textContent = dados.valor.toFixed(2);
    document.getElementById('dataHora').textContent = dados.dataHora;
    document.getElementById('metodoPagamento').textContent = dados.metodoPagamento;
    document.getElementById('codigoTransacao').textContent = dados.codigoTransacao;
} else {
    alert('Dados do comprovante não encontrados.');
}
