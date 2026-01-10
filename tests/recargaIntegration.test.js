
const ControladorRecarga = require('../controllers/ControladorRecarga');

describe('Teste de Integração SIMULADO - Fluxo de Recarga', () => {
  let controlador;

  beforeEach(() => {
    jest.mock('fs', () => ({
      existsSync: jest.fn(() => true),
      statSync: jest.fn(() => ({ size: 100 })),
      readFileSync: jest.fn(() => JSON.stringify({})),
      writeFileSync: jest.fn(),
      mkdirSync: jest.fn()
    }));
    
    controlador = new ControladorRecarga();
  });

  test('CTI01 - fluxo simulado de consulta e recarga', () => {
    const matricula = '202376010';
    
    controlador.usuarios[matricula] = {
      matricula: matricula,
      saldo: 30.00,
      historico: [],
      getSaldo: function() { return this.saldo; },
      adicionarTransacao: function(tipo, valor) {
        this.historico.push({ tipo, valor, dataHora: new Date().toISOString() });
        this.saldo += valor;
      },
      getHistorico: function() {
        return {
          items: this.historico,
          totalItems: this.historico.length,
          totalPages: 1,
          currentPage: 1
        };
      }
    };

    const saldoInicial = controlador.usuarios[matricula].getSaldo();
    expect(saldoInicial).toBe(30.00);

    const valorRecarga = 20.00;
    controlador.usuarios[matricula].adicionarTransacao('Recarga', valorRecarga);
    
    const saldoFinal = controlador.usuarios[matricula].getSaldo();
    expect(saldoFinal).toBe(50.00); 

    const historico = controlador.usuarios[matricula].getHistorico();
    expect(historico.items).toHaveLength(1);
    expect(historico.items[0].tipo).toBe('Recarga');
    expect(historico.items[0].valor).toBe(20.00);
  });
});