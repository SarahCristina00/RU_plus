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

    getHistorico(page = 1, limit = 10) {
        const historicoOrdenado = this.historico.sort(
            (a, b) => new Date(b.dataHora) - new Date(a.dataHora),
        );
        const totalItems = historicoOrdenado.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const items = historicoOrdenado.slice(startIndex, endIndex);

        return {
            items,
            totalItems,
            totalPages,
            currentPage: page,
        };
    }
}

module.exports = Usuario;
