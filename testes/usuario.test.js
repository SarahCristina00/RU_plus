const Usuario = require('../models/Usuario');

describe('Classe Usuario - Testes de Unidade', () => {
  let usuario;

  beforeEach(() => {
    usuario = new Usuario('202376010', 50.00);
  });

  test('CTU01 - deve criar usuário com matrícula e saldo inicial', () => {
    expect(usuario.matricula).toBe('202376010');
    expect(usuario.saldo).toBe(50.00);
    expect(usuario.historico).toEqual([]);
  });

  test('CTU02 - deve retornar saldo atual', () => {
    expect(usuario.getSaldo()).toBe(50.00);
  });

  test('CTU03 - deve adicionar transação e atualizar saldo', () => {
    // Arrange
    const tipo = 'Recarga';
    const valor = 20.00;
    
    // Act
    usuario.adicionarTransacao(tipo, valor);
    
    // Assert
    expect(usuario.saldo).toBe(70.00); // 50 + 20
    expect(usuario.historico).toHaveLength(1); 
    expect(usuario.historico[0].tipo).toBe(tipo);
    expect(usuario.historico[0].valor).toBe(valor);
    expect(usuario.historico[0].dataHora).toBeDefined();
  });

  test('CTU04 - deve adicionar transação negativa (uso no RU)', () => {
    usuario.adicionarTransacao('Almoço', -1.40);
    expect(usuario.saldo).toBe(48.60); 
  });

  test('CTU05 - deve retornar histórico paginado', () => {
    // Adiciona 15 transações
    for (let i = 1; i <= 15; i++) {
      usuario.adicionarTransacao('Recarga', 10.00);
    }
    
    const resultado = usuario.getHistorico(1, 10);
    
    expect(resultado.items).toHaveLength(10); 
    expect(resultado.totalItems).toBe(15);
    expect(resultado.totalPages).toBe(2);
    expect(resultado.currentPage).toBe(1);
  });
});