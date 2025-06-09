//renderização

const formatarMoeda = (valor) => {
    if (typeof valor !== 'number') return 'R$ --,--';
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
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

export function atualizarSaldoDisplay(novoSaldo) {
        if(typeof novoSaldo!== 'number'){
            saldoDisplay.textContent = "Saldo indisponível";
            return;
        }
        saldoDisplay.textContent = `Saldo Atual: ${formatarMoeda(novoSaldo)}`;

        if(novoSaldo<0){saldoDisplay.style.backgroundColor = '#FF0B48'}
        else{saldoDisplay.style.backgroundColor='#0CC2AA'}
    }   

export function atualizarExtratoDisplay(historico) {
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

export function atualizarPaginacao(totalPages, currentPage) {
    paginacaoContainer.innerHTML = '';
    if (totalPages <= 1) return;
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.innerHTML = '&laquo; Anterior';
    if (currentPage === 1) {
        prevLink.classList.add('disabled');
    } else {
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            carregarDadosMatricula(currentPage - 1);
        });
   }
    paginacaoContainer.appendChild(prevLink);
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
       pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            carregarDadosMatricula(i);
        });
        paginacaoContainer.appendChild(pageLink);
   }

    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.innerHTML = 'Próxima &raquo;';
    if (currentPage === totalPages) {
        nextLink.classList.add('disabled');
    } else {
        nextLink.addEventListener('click', (e) => {
         e.preventDefault();
         carregarDadosMatricula(currentPage + 1);
       });
    }
    paginacaoContainer.appendChild(nextLink);
}
