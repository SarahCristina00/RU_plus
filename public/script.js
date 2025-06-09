document.addEventListener('DOMContentLoaded', () => {

    const dashboard = document.getElementById('dashboard');
    const btnIrParaRecarga = document.getElementById('btn-ir-recarga');
    const saldoDisplay = document.querySelector('#dashboard .saldo');
    const matriculaInput = document.getElementById('matricula-input');
    const btnCarregarMatricula = document.getElementById('btn-carregar-matricula');
    const extratoDados = document.getElementById('extrato-dados');

    const formatarMoeda = (valor) => {
        if (typeof valor !== 'number') return 'R$ --,--';
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    }

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    function atualizarSaldoDisplay(novoSaldo) {
        if(novoSaldo<0){saldoDisplay.style.backgroundColor = '#FF0B48'}
        else{saldoDisplay.style.backgroundColor='#0CC2AA'}
        saldoDisplay.textContent = formatarMoeda(novoSaldo);
    }   

    function atualizarExtratoDisplay(historico) {
        extratoDados.innerHTML = '';

        if (!historico || historico.length === 0) {
            extratoDados.innerHTML = '<tr><td colspan="3">Nenhum lançamento encontrado.</td></tr>';
            return;
        }

        historico.forEach(item => {
            const tr = document.createElement('tr');
            
            const classeValor = item.valor > 0 ? 'valor-recarga' : 'valor-gasto';

            tr.innerHTML = `
                <td data-label="Data e Hora">${formatarData(item.dataHora)}</td>
                <td data-label="Lançamento">${item.tipo}</td>
                <td data-label="Valor" class="${classeValor}">${formatarMoeda(item.valor)}</td>
            `;
            extratoDados.appendChild(tr);
        });
    }



    async function carregarDadosMatricula() {
        const matricula = matriculaInput.value.trim();
        if (!matricula) {
            alert("Por favor, digite uma matrícula.");
            return;
        }

        saldoDisplay.textContent = "Carregando...";
        extratoDados.textContent = '<tr><td colspan="3">Carregando histórico...</td></tr>';

        try {
            const [resSaldo, resHistorico] = await Promise.all([
                fetch(`/recargas/saldo/${matricula}`),
                fetch(`/recargas/historico/${matricula}`)
            ]);

            const dadosSaldo = await resSaldo.json();
            const dadosHistorico = await resHistorico.json();
            
            if (!resSaldo.ok) {
                throw new Error(dadosSaldo.erro || 'Não foi possível carregar o saldo.');
            }
            if (!resHistorico.ok) {
                throw new Error(dadosHistorico.erro || 'Não foi possível carregar o histórico.');
            }
            
            atualizarSaldoDisplay(dadosSaldo.saldo); 
            atualizarExtratoDisplay(dadosHistorico.items);           
        } catch (error) {
            console.error("Erro:", error);
            saldoDisplayExtrato.textContent = "Matrícula inválida";
            extratoDados.innerHTML = `<tr><td colspan="3" style="color: red;">${error.message}</td></tr>`;
            alert(`Erro ao carregar dados: ${error.message}`);
        }
    }

    btnCarregarMatricula.addEventListener('click', carregarDadosMatricula);

    matriculaInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            carregarDadosMatricula();
        }
    });
});