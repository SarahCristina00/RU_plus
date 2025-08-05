class Usuario {
    constructor(matricula, saldo = 0, historico = []) {
        this.matricula = matricula;
        this.saldo = saldo;
        this.historico = historico;
    }

    getSaldo() {
        return this.saldo;
    }

    adicionarTransacao(tipo, valor) {
        this.historico.push({
            dataHora: new Date().toISOString(),
            tipo,
            valor,
        });
        this.saldo += valor;
    }

    getHistorico(pagina = 1, limite = 10) {
        const historicoOrdenado = this.historico.sort(
            (a, b) => new Date(b.dataHora) - new Date(a.dataHora),
        );
        const totalItens = historicoOrdenado.length;
        const totalPaginas = Math.ceil(totalItens / limite);
        const inicio = (pagina - 1) * limite;
        const fim = pagina * limite;
        const itens = historicoOrdenado.slice(inicio, fim);

        return {
            itens,
            totalItens,
            totalPaginas,
            paginaAtual: pagina,
        };
    }
}

module.exports = Usuario;
