import { buscarDadosUsuario, enviarRecarga } from "./api.js";
import {
    mostrarDashboard,
    mostrarRecarga,
    prepararTelaRecarga,
    mostrarNotificacao,
    atualizarHeaderUI,
    atualizarExtratoDisplay,
    atualizarSaldoDisplay,
    atualizarPaginacao,
    limparDashboard,
    abrirModalComprovante
} from "./ui.js";

document.addEventListener('DOMContentLoaded', () => {
    const elementos = {
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
        cartaoForm: document.getElementById('cartao-form'),
        pixInfo: document.getElementById('pix-info')
    };

    // === FUNÇÃO PARA CARREGAR DADOS ===
    async function carregarDados(pagina = 1) {
        const matricula = elementos.matriculaInput.value.trim();
        if (!matricula) {
            alert("Por favor, digite uma matrícula.");
            return;
        }

        elementos.saldoDisplay.textContent = "Carregando saldo...";
        elementos.extratoDados.textContent = "Carregando histórico...";
        elementos.paginacaoContainer.innerHTML = '';

        try {
            const { dadosSaldo, dadosHistorico } = await buscarDadosUsuario(matricula, pagina);

            atualizarHeaderUI(matricula, elementos);
            atualizarSaldoDisplay(dadosSaldo.saldo, elementos.saldoDisplay);
            atualizarExtratoDisplay(dadosHistorico.items, elementos.extratoDados);
            atualizarPaginacao(dadosHistorico.totalPages, dadosHistorico.currentPage, elementos.paginacaoContainer, carregarDados);

            prepararTelaRecarga(dadosSaldo.saldo, elementos);

            if (elementos.btnIrRecarga) elementos.btnIrRecarga.style.display = 'block';

        } catch (erro) {
            alert(erro.message);
            deslogar();
        }
    }

    // === FUNÇÃO PARA SAIR ===
    function deslogar() {
        atualizarHeaderUI(null, elementos);
        limparDashboard(elementos);
        if (elementos.btnIrRecarga) elementos.btnIrRecarga.style.display = 'none';
    }

    // === FUNÇÃO PARA PROCESSAR RECARGA ===
    async function processarRecarga() {
        const matricula = elementos.matriculaLogadaSpan.textContent;
        const valorInput = elementos.valorRecargaInput.value.replace(',', '.');
        const valor = parseFloat(valorInput);
        const metodoPagamentoEl = elementos.opcoesPagamento.querySelector('.selected');
        const metodoPagamento = metodoPagamentoEl ? metodoPagamentoEl.textContent.trim() : null;

        if (isNaN(valor) || valor <= 0) {
            return alert('Por favor, insira um valor de recarga válido.');
        }
        if (!metodoPagamento) {
            return alert('Por favor, selecione uma forma de pagamento.');
        }

        try {
            const resultado = await enviarRecarga(matricula, valor, metodoPagamento);

            console.log('Dados recebidos do servidor:', resultado);

            mostrarNotificacao(resultado.mensagem, elementos.notificacaoSucesso);

            abrirModalComprovante(resultado.comprovante);

            await carregarDados();
            
            mostrarDashboard(elementos);

        } catch (erro) {
            console.error("Erro detalhado no processarRecarga:", erro);
            alert("Ocorreu um erro ao processar a recarga. Tente novamente.");
        }
    }

    // === BOTÕES E EVENTOS ===
    elementos.btnCarregarMatricula.addEventListener('click', () => carregarDados(1));
    elementos.btnSair.addEventListener('click', deslogar);
    elementos.btnIrRecarga.addEventListener('click', () => mostrarRecarga(elementos));
    elementos.btnVoltarDashboard.addEventListener('click', () => mostrarDashboard(elementos));
    elementos.btnRecarregarAgora.addEventListener('click', processarRecarga);

    // === SELEÇÃO DE MÉTODO DE PAGAMENTO ===
    document.querySelectorAll('.btn-pagamento').forEach(botao => {
        botao.addEventListener('click', () => {
            document.querySelectorAll('.btn-pagamento').forEach(b => b.classList.remove('selected'));
            botao.classList.add('selected');

            const tipo = botao.getAttribute('data-pagamento');
            if (tipo === 'credito' || tipo === 'debito') {
                elementos.cartaoForm.style.display = 'flex';
                elementos.pixInfo.style.display = 'none';
            } else if (tipo === 'pix') {
                elementos.cartaoForm.style.display = 'none';
                elementos.pixInfo.style.display = 'flex';
            }
        });
    });

    // === FUNÇÃO COPIAR CHAVE PIX ===
    window.copiarChavePIX = function () {
        const pixChave = document.getElementById('pix-chave');
        pixChave.select();
        pixChave.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(pixChave.value)
            .then(() => alert('Chave PIX copiada!'))
            .catch(() => alert('Falha ao copiar a chave PIX.'));
    };

});