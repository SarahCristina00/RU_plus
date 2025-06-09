import { fetchUserData } from "./api";
import { atualizarExtratoDisplay, atualizarSaldoDisplay, atualizarPaginacao } from "./ui";

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
    
    async function carregarDadosMatricula(page=1) {
        const matricula = matriculaInput.value.trim();
        if (!matricula) {
            alert("Por favor, digite uma matrícula.");
            return;
        }

        saldoDisplay.textContent = "Carregando saldo...";
        extratoDados.textContent = `Carregando histórico...`;
        paginacaoContainer.innerHTML = '';

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

    // 3. Adiciona os Event Listeners
    elements.btnCarregarMatricula.addEventListener('click', () => carregarDados(1));
    elements.matriculaInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') carregarDados(1);
    });
    elements.btnSair.addEventListener('click', deslogar);
});