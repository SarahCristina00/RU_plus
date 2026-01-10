const request = require('supertest');
const app = require("../models/Usuario");


jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  statSync: jest.fn().mockReturnValue({ size: 100 }),
  readFileSync: jest.fn().mockReturnValue(JSON.stringify({
    '202376010': {
      matricula: '202376010',
      saldo: 30.00,
      historico: []
    }
  })),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn()
}));

describe('Teste de Integração - Fluxo de Recarga', () => {
  test('CTI01 - deve integrar todas as camadas no fluxo de recarga', async () => {

    const responseSaldo = await request(app)
      .get('/saldo/202376010');
    
    expect(responseSaldo.status).toBe(200);
    expect(responseSaldo.body).toHaveProperty('saldo');
    expect(typeof responseSaldo.body.saldo).toBe('number');

  
    const responseRecarga = await request(app)
      .post('/recarregar')
      .send({
        matricula: '202376010',
        valor: 20.00,
        metodo: 'PIX'
      });
    
    expect(responseRecarga.status).toBe(200);
    expect(responseRecarga.body).toHaveProperty('mensagem');
    expect(responseRecarga.body).toHaveProperty('novoSaldo');
    expect(responseRecarga.body).toHaveProperty('comprovante');
    expect(responseRecarga.body.comprovante).toHaveProperty('codigoTransacao');
    expect(responseRecarga.body.comprovante.matricula).toBe('202376010');


    const responseHistorico = await request(app)
      .get('/historico/202376010')
      .query({ page: 1, limit: 5 });
    
    expect(responseHistorico.status).toBe(200);
    expect(responseHistorico.body).toHaveProperty('items');
    expect(responseHistorico.body).toHaveProperty('totalItems');
    expect(responseHistorico.body).toHaveProperty('totalPages');
    expect(responseHistorico.body).toHaveProperty('currentPage');
  });

  test('CTI02 - deve retornar erro para matrícula inexistente', async () => {
    const response = await request(app)
      .get('/saldo/999999999');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('erro');
  });

  test('CTI03 - deve rejeitar valor inválido na recarga', async () => {
    const response = await request(app)
      .post('/recarregar')
      .send({
        matricula: '202376010',
        valor: -10.00, 
        metodo: 'PIX'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });
});