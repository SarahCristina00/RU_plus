
const ControladorRecarga = require('../controllers/ControladorRecarga');

describe('ControladorRecarga - Testes Básicos', () => {
  test('CTU07 - a classe deve ser importável', () => {
    expect(typeof ControladorRecarga).toBe('function');
  });

  test('CTU08 - deve poder criar uma instância', () => {
    // Vamos criar um teste que não dependa de arquivos
    // Mock simples para evitar problemas com fs
    const originalReadFileSync = require('fs').readFileSync;
    require('fs').readFileSync = jest.fn().mockReturnValue('{}');
    
    // Tenta criar instância
    expect(() => {
      new ControladorRecarga();
    }).not.toThrow();
    
    // Restaura
    require('fs').readFileSync = originalReadFileSync;
  });

  test('CTU09 - deve validar método getSaldo', () => {
    // Mock básico
    const mockReq = { params: { matricula: '202212345' } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const controlador = new ControladorRecarga();
    
    // Simula que o usuário existe
    controlador.usuarios = {
      '202212345': { getSaldo: () => 13.20 }
    };
    
    controlador.getSaldo(mockReq, mockRes);
    
    expect(mockRes.json).toHaveBeenCalledWith({ saldo: 13.20 });
  });
});