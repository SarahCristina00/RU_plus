const fs = require("fs");
const path = require("path");
const Usuario = require("../models/Usuario");

const DATA_FILE = path.join(__dirname, "../data/usuarios.json");

class ControladorRecarga {
    constructor() {
        this.usuarios = this.carregarUsuarios();
    }

    carregarUsuarios() {
        try {
            // Verifica se o diretório data existe
            const dataDir = path.join(__dirname, "../data");
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir);
            }

            // Carrega os dados do arquivo
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, "utf8");
                const usuariosData = JSON.parse(data);
                const usuarios = {};

                for (const [matricula, usuarioData] of Object.entries(
                    usuariosData,
                )) {
                    usuarios[matricula] = new Usuario(
                        usuarioData.matricula,
                        usuarioData.saldo,
                        usuarioData.historico,
                    );
                }
                return usuarios;
            }
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
        }

        // Retorna dados iniciais se o arquivo não existir
        return {
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

    salvarUsuarios() {
        const usuariosParaSalvar = {};
        for (const [matricula, usuario] of Object.entries(this.usuarios)) {
            usuariosParaSalvar[matricula] = {
                matricula: usuario.matricula,
                saldo: usuario.saldo,
                historico: usuario.historico,
            };
        }

        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(usuariosParaSalvar, null, 2),
        );
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
        this.salvarUsuarios();

        const comprovante = {
            matricula: usuario.matricula,
            valor: valorNumerico.toFixed(2),
            dataHora: new Date().toLocaleString("pt-BR"),
            metodoPagamento: metodo,
            codigoTransacao: `RU-${Date.now()}`,
            saldoAtual: usuario.getSaldo().toFixed(2),
        };

        res.json({
            mensagem: `Recarga de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`,
            novoSaldo: usuario.getSaldo(),
            comprovante: comprovante,
        });
    }
}

module.exports = new ControladorRecarga();
