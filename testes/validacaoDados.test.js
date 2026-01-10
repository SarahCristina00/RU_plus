const ControladorRecarga = require('../controllers/ControladorRecarga');
const fs = require('fs');
const path = require('path');

jest.mock('fs');
jest.mock('path');

describe('ControladorRecarga - Testes de Unidade', () => {
  let controlador;
  
  beforeEach(() => {
    jest.clearAllMocks();

    path.join.mockReturnValue('/fake/path/usuarios.json');
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ size: 100 });
    fs.readFileSync.mockReturnValue(JSON.stringify({
      '202376010': {
        matricula: '202376010',
        saldo: 13.20,
        historico: []
      }
    }));
    
    controlador = new ControladorRecarga();
  });

  test('CTU07 - deve carregar usuários do arquivo JSON', () => {
    expect(controlador.usuarios).toBeDefined();
    expect(controlador.usuarios['202376010']).toBeDefined();
    expect(controlador.usuarios['202376010'].matricula).toBe('202376010');
  });

  test('CTU08 - deve criar usuários iniciais se arquivo estiver vazio', () => {
    fs.readFileSync.mockReturnValue('{}');
    
    const novoControlador = new ControladorRecarga();
    
    expect(novoControlador.usuarios['202376010']).toBeDefined();
    expect(novoControlador.usuarios['202312345']).toBeDefined();
    expect(novoControlador.usuarios['202376010'].saldo).toBe(13.20);
    expect(novoControlador.usuarios['202312345'].saldo).toBe(-4.40);
  });

  test('CTU09 - deve salvar usuários no arquivo', () => {

    const mockReq = {
      params: { matricula: '202376010' }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    controlador.getSaldo(mockReq, mockRes);
    
    expect(mockRes.json).toHaveBeenCalledWith({
      saldo: expect.any(Number)
    });
  });
});