const fs = require("fs");
const path = require("path");
const Usuario = require("../models/Usuario");

const DATA_FILE = path.join(__dirname, "../data/usuarios.json");

class ControladorRecarga {
    constructor() {
        // Garante que o diretório data existe
        this.criarDiretorioData();
        this.usuarios = this.carregarUsuarios();
    }

    criarDiretorioData() {
        const dataDir = path.join(__dirname, "../data");
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // Se o arquivo não existe, cria um vazio válido
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, "{}", "utf8");
        }
    }

    carregarUsuarios() {
        try {
            // Verifica se o arquivo está vazio
            const stats = fs.statSync(DATA_FILE);
            if (stats.size === 0) {
                fs.writeFileSync(DATA_FILE, "{}", "utf8");
            }

            const data = fs.readFileSync(DATA_FILE, "utf8");

            // Verifica se o conteúdo é um JSON válido
            if (!data.trim()) {
                fs.writeFileSync(DATA_FILE, "{}", "utf8");
                return this.getUsuariosIniciais();
            }

            const usuariosData = JSON.parse(data);

            // Se o JSON estiver vazio, retorna os usuários iniciais
            if (Object.keys(usuariosData).length === 0) {
                return this.getUsuariosIniciais();
            }

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
        } catch (err) {
            console.error(
                "Erro ao carregar usuários, usando dados iniciais:",
                err.message,
            );
            fs.writeFileSync(DATA_FILE, "{}", "utf8");
            return this.getUsuariosIniciais();
        }
    }

    getUsuariosIniciais() {
        return {
            202212345: new Usuario("202212345", 13.20, [
                {
                    dataHora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Recarga",
                    valor: 25.00,
                },
                {
                    dataHora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Almoço",
                    valor: -1.40,
                },
                {
                    dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Jantar",
                    valor: -1.40,
                },
                {
                    dataHora: new Date().toISOString(),
                    tipo: "Café da Manhã",
                    valor: -0.50,
                },
                {
                    dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Jantar",
                    valor: -1.40,
                },
                {
                    dataHora: new Date().toISOString(),
                    tipo: "Café da Manhã",
                    valor: -0.50,
                },
                                {
                    dataHora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Almoço",
                    valor: -1.40,
                },
                {
                    dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Jantar",
                    valor: -1.40,
                },
                {
                    dataHora: new Date().toISOString(),
                    tipo: "Café da Manhã",
                    valor: -0.50,
                },
                {
                    dataHora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Almoço",
                    valor: -1.40,
                },
                {
                    dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Jantar",
                    valor: -1.40,
                },
                {
                    dataHora: new Date().toISOString(),
                    tipo: "Café da Manhã",
                    valor: -0.50,
                },
            ]),
            202312345: new Usuario("202312345", -4.40, [
                {
                    dataHora: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Recarga",
                    valor: 5.00,
                },
                {
                    dataHora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Almoço",
                    valor: -1.40,
                },
                {
                    dataHora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Jantar",
                    valor: -1.40,
                },
                {
                    dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Almoço",
                    valor: -1.40,
                },
                {
                    dataHora: new Date().toISOString(),
                    tipo: "Almoço",
                    valor: -1.40,
                },
                                {
                    dataHora: new Date().toISOString(),
                    tipo: "Café da Manhã",
                    valor: -0.50,
                },
                {
                    dataHora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Almoço",
                    valor: -1.40,
                },
                {
                    dataHora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    tipo: "Jantar",
                    valor: -1.40,
                },
                {
                    dataHora: new Date().toISOString(),
                    tipo: "Café da Manhã",
                    valor: -0.50,
                },
            ]),
        };
    }

    salvarUsuarios() {
        try {
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
                "utf8",
            );
        } catch (err) {
            console.error("Erro ao salvar usuários:", err);
        }
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
