document.addEventListener("DOMContentLoaded", () => {
    // Tenta obter os dados da URL primeiro (caso venha como parâmetro)
    const urlParams = new URLSearchParams(window.location.search);
    const comprovanteData = urlParams.get('data');

    let dados;

    if (comprovanteData) {
        // Decodifica os dados da URL
        dados = JSON.parse(decodeURIComponent(comprovanteData));
    } else {
        // Fallback para localStorage
        dados = JSON.parse(localStorage.getItem("dadosComprovante"));
    }

    if (dados) {
        // Preenche os dados do comprovante
        document.getElementById("matricula").textContent = dados.matricula || "---";
        document.getElementById("valor").textContent = dados.valor || "0,00";
        document.getElementById("dataHora").textContent = dados.dataHora || "---";
        document.getElementById("metodoPagamento").textContent = dados.metodoPagamento || "---";
        document.getElementById("codigoTransacao").textContent = dados.codigoTransacao || "---";

        // Adiciona botão de impressão
        document.getElementById("btn-imprimir").addEventListener("click", () => {
            window.print();
        });

        // Adiciona botão para fechar (se for popup)
        if (window.opener) {
            document.getElementById("btn-fechar").addEventListener("click", () => {
                window.close();
            });
        } else {
            document.getElementById("btn-fechar").style.display = "none";
        }
    } else {
        alert("Dados do comprovante não encontrados.");
        if (window.opener) {
            window.close();
        }
    }
});