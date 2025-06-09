import { fetchUserData, realizarRecarga } from "./api.js";
import { mostrarDashboard, mostrarRecarga, prepararTelaRecarga, mostrarNotificacao,atualizarHeaderUI, atualizarExtratoDisplay, atualizarSaldoDisplay, atualizarPaginacao, limparDashboard } from "./ui.js";

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
        dashboardView: document.getElementById('dashboard'),
        recargaView: document.getElementById('recarga'),
        btnIrRecarga: document.getElementById('btn-ir-recarga'),
        btnVoltarDashboard: document.getElementById('btn-voltar-dashboard'),
        valorRecargaInput: document.getElementById('valor-recarga'),
        opcoesPagamento: document.querySelector('.forma-pagamento'),
        btnRecarregarAgora: document.getElementById('btn-recarregar-agora'),
        notificacaoSucesso: document.querySelector('.notificacao-sucesso'),
        saldoRecargaDisplay: document.querySelector('#dashboard .saldo'),
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

            prepararTelaRecarga(dadosSaldo.saldo, elements);

            if (elements.btnIrRecarga) elements.btnIrRecarga.style.display = 'block';

        } catch (error) {
            alert(error.message);
            deslogar();
        }
    }

    function deslogar() {
        atualizarHeaderUI(null, elements);
        limparDashboard(elements);
        if (elements.btnIrRecarga) elements.btnIrRecarga.style.display = 'none';
    }

        async function handleRecarregar() {
        const matricula = elements.matriculaLogadaSpan.textContent;
        const valor = parseFloat(elements.valorRecargaInput.value.replace(',', '.'));
        const metodoPagamento = elements.opcoesPagamento.querySelector('.selected')?.textContent.trim();

        if (isNaN(valor) || valor <= 0) return alert('Por favor, insira um valor de recarga válido.');
        if (!metodoPagamento) return alert('Por favor, selecione uma forma de pagamento.');

        try {
            const resultado = await realizarRecarga(matricula, valor, metodoPagamento);
            mostrarNotificacao(resultado.mensagem, elements.notificacaoSucesso);
            // Opcional: recarregar os dados para atualizar o saldo e extrato
            await carregarDados(); 
            mostrarDashboard(elements);
        } catch (error) {
            alert(error.message);
        }
    }

    elements.btnCarregarMatricula.addEventListener('click', () => carregarDados(1));
    elements.btnSair.addEventListener('click', deslogar);
    elements.btnIrRecarga.addEventListener('click', () => mostrarRecarga(elements));
    elements.btnVoltarDashboard.addEventListener('click', () => mostrarDashboard(elements));
    elements.btnRecarregarAgora.addEventListener('click', handleRecarregar);
});