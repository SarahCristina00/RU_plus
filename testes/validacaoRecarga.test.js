describe('Validações de Regras de Negócio - Testes de Unidade', () => {

  const validarValorRecarga = (valor) => {
    if (isNaN(valor) || valor <= 0) {
      throw new Error('Valor inválido.');
    }
    if (valor < 1.40) {
      throw new Error('Valor mínimo de recarga é R$1,40');
    }
    if (valor > 300.00) {
      throw new Error('Valor máximo de recarga é R$300,00');
    }
    return true;
  };

  const validarMetodoPagamento = (metodo) => {
    const metodosValidos = ['PIX', 'CREDITO', 'DEBITO'];
    if (!metodosValidos.includes(metodo.toUpperCase())) {
      throw new Error('Método de pagamento não suportado');
    }
    return true;
  };

  test('CTU10 - deve validar valor dentro dos limites', () => {
    expect(validarValorRecarga(50.00)).toBe(true);
    expect(validarValorRecarga(1.40)).toBe(true); 
    expect(validarValorRecarga(300.00)).toBe(true); 
  });

  test('CTU11 - deve rejeitar valor abaixo do mínimo', () => {
    expect(() => validarValorRecarga(1.39))
      .toThrow('Valor mínimo de recarga é R$1,40');
    expect(() => validarValorRecarga(0))
      .toThrow('Valor inválido.');
  });

  test('CTU12 - deve rejeitar valor acima do máximo', () => {
    expect(() => validarValorRecarga(300.01))
      .toThrow('Valor máximo de recarga é R$300,00');
  });

  test('CTU13 - deve validar métodos de pagamento', () => {
    expect(validarMetodoPagamento('PIX')).toBe(true);
    expect(validarMetodoPagamento('CREDITO')).toBe(true);
    expect(validarMetodoPagamento('DEBITO')).toBe(true);
    expect(() => validarMetodoPagamento('BOLETO'))
      .toThrow('Método de pagamento não suportado');
  });

  test('CTU14 - deve formatar valores monetários corretamente', () => {
    const formatarMoeda = (valor) => {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    };
    
    expect(formatarMoeda(1.40)).toBe('R$ 1,40');
    expect(formatarMoeda(300.00)).toBe('R$ 300,00');
    expect(formatarMoeda(50.50)).toBe('R$ 50,50');
  });
});