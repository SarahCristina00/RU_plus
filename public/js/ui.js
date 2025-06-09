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

export function mostrarDashboard(elements) {
    if (elements.recargaView) elements.recargaView.style.display = 'none';
    if (elements.dashboardView) elements.dashboardView.style.display = 'block';
}

export function mostrarRecarga(elements) {
    if (elements.dashboardView) elements.dashboardView.style.display = 'none';
    if (elements.recargaView) elements.recargaView.style.display = 'flex';
}

export function prepararTelaRecarga(saldo, elements) {
    const { saldoRecargaDisplay, opcoesPagamento } = elements;

    saldoRecargaDisplay.textContent = `Saldo Atual: ${formatarMoeda(saldo)}`;

    const botoes = opcoesPagamento.querySelectorAll('.btn-pagamento');
    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            botoes.forEach(b => b.classList.remove('selected'));
            botao.classList.add('selected');
        });
    });
}

export function mostrarNotificacao(mensagem, container) {
    container.textContent = mensagem;
    container.style.display = 'block';
    setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

export function atualizarHeaderUI(matricula, elements) {
    const { loginForm, userDisplay, matriculaLogadaSpan, matriculaInput } = elements;
    if (matricula) {
        matriculaLogadaSpan.textContent = matricula;
        loginForm.style.display = 'none';
        userDisplay.style.display = 'flex';
    } else {
        matriculaInput.value = '';
        userDisplay.style.display = 'none';
        loginForm.style.display = 'flex';
    }
}

export function atualizarSaldoDisplay(novoSaldo, saldoDisplay) {
        if(typeof novoSaldo!== 'number'){
            saldoDisplay.textContent = "Saldo indisponível";
            return;
        }
        saldoDisplay.textContent = `Saldo Atual: ${formatarMoeda(novoSaldo)}`;

        if(novoSaldo<0){saldoDisplay.style.backgroundColor = '#FF0B48'}
        else{saldoDisplay.style.backgroundColor='#0CC2AA'}
    }   

export function atualizarExtratoDisplay(historico, extratoDados) {
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

export function atualizarPaginacao(totalPages, currentPage, paginacaoContainer, onPageClick) {
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
            onPageClick(currentPage - 1);
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
            onPageClick(i);
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
         onPageClick(currentPage + 1);
       });
    }
    paginacaoContainer.appendChild(nextLink);
}

export function limparDashboard(elements) {
    const { saldoDisplay, extratoDados, paginacaoContainer } = elements;
    saldoDisplay.textContent = 'Informe sua matrícula para visualizar seu saldo';
    saldoDisplay.style.backgroundColor = 'var(--primaria)';
    extratoDados.innerHTML = '<tr><td colspan="3">Nenhum histórico para exibir.</td></tr>';
    paginacaoContainer.innerHTML = '';
}
