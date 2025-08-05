const Usuario = require("../models/Usuario");

class ControladorRecarga {
    constructor() {
        // Usuários pré-cadastrados para teste
        this.usuarios = {
            202376010: new Usuario("202376010", 30.0, [
                {
                    dataHora: "2025-06-09T10:00:00-03:00",
                    tipo: "Recarga",
                    valor: 30.0,
                },
                {
                    dataHora: "2025-06-08T12:10:00-03:00",
                    tipo: "Almoço",
                    valor: -1.4,
                },
            ]),
            202312345: new Usuario("202312345", -25.0, [
                {
                    dataHora: "2025-06-09T11:00:00-03:00",
                    tipo: "Recarga",
                    valor: 10.0,
                },
            ]),
        };
    }

    // Retorna o saldo de um usuário
    getSaldo(req, res) {
        const { matricula } = req.params;
        const usuario = this.usuarios[matricula];

        if (!usuario) {
            return res.status(404).json({ erro: "Matrícula não encontrada." });
        }

        res.json({ saldo: usuario.getSaldo() });
    }

    // Retorna o histórico paginado de transações
    getHistorico(req, res) {
        const { matricula } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const usuario = this.usuarios[matricula];

        if (!usuario) {
            return res.status(404).json({ erro: "Histórico não encontrado." });
        }

        res.json(usuario.getHistorico(parseInt(page), parseInt(limit)));
    }

    // Realiza uma recarga
    recarregar(req, res) {
        const { matricula, valor, metodo } = req.body;
        const usuario = this.usuarios[matricula];

        if (!usuario) {
            return res.status(404).json({ erro: "Matrícula não encontrada." });
        }

        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            return res.status(400).json({ erro: "Valor inválido." });
        }

        usuario.adicionarTransacao("Recarga", valorNumerico);

        res.json({
            mensagem: `Recarga de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`,
            novoSaldo: usuario.getSaldo(),
        });
    }
}

module.exports = new ControladorRecarga();
