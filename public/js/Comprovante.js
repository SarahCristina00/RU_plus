document.addEventListener("DOMContentLoaded", () => {
    const dados = JSON.parse(localStorage.getItem("dadosComprovante"));

    if (dados) {
        // Preenche os valores usando 'dados.nome' como fallback
        document.getElementById("matricula").textContent = dados.nome || "---";
        document.getElementById("valor").textContent = dados.valor
            ? dados.valor.toFixed(2)
            : "0,00";
        document.getElementById("dataHora").textContent =
            dados.dataHora || new Date().toLocaleString("pt-BR");
        document.getElementById("metodoPagamento").textContent =
            dados.metodoPagamento || "Não informado";
        document.getElementById("codigoTransacao").textContent =
            dados.codigoTransacao || "---";
    } else {
        alert("Dados do comprovante não encontrados.");
    }
});
