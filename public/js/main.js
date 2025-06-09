import { fetchUserData } from "./api.js";
import { atualizarHeaderUI, atualizarExtratoDisplay, atualizarSaldoDisplay, atualizarPaginacao, limparDashboard } from "./ui.js";

document.addEventListener('DOMContentLoaded', () => {

    const elements = {
        matriculaInput: document.getElementById('matricula-input'),
        btnCarregarMatricula: document.getElementById('btn-carregar-matricula'),
        saldoDisplay: document.querySelector('#dashboard .saldo'),
        extratoDados: document.getElementById('extrato-dados'),
        paginacaoContainer: document.getElementById('paginacao-container'),
        loginForm: document.getElementById('login-form'),
        userDisplay: document.getElementById('user-display'),
        matriculaLogadaSpan: document.getElementById('matricula-logada'),
        btnSair: document.getElementById('btn-sair'),
    };
    
    async function carregarDados(page=1) {
        const matricula = elements.matriculaInput.value.trim();
        if (!matricula) {
            alert("Por favor, digite uma matrícula.");
            return;
        }

        elements.saldoDisplay.textContent = "Carregando saldo...";
        elements.extratoDados.textContent = `Carregando histórico...`;
        elements.paginacaoContainer.innerHTML = '';

        try {
            const { dadosSaldo, dadosHistorico } = await fetchUserData(matricula, page);
            
            atualizarHeaderUI(matricula, elements);
            atualizarSaldoDisplay(dadosSaldo.saldo, elements.saldoDisplay);
            atualizarExtratoDisplay(dadosHistorico.items, elements.extratoDados);
            atualizarPaginacao(dadosHistorico.totalPages, dadosHistorico.currentPage, elements.paginacaoContainer, carregarDados);

        } catch (error) {
            alert(error.message);
            deslogar();
        }
    }

    function deslogar() {
        atualizarHeaderUI(null, elements);
        limparDashboard(elements);
    }

    elements.btnCarregarMatricula.addEventListener('click', () => carregarDados(1));
    elements.btnSair.addEventListener('click', deslogar);
});