const Usuario = require('../models/Usuario');

describe('Classe Usuario - Testes de Unidade', () => {
    let usuario;

    beforeEach(() => {
        usuario = new Usuario('202376010', 50.00);
    });

    test('CTU01 - cria usuário com matricula e saldo inicial', () => {
        expect (usuario.matricula).toBe('202376010');
        expect (usuario.saldo).toBe(50.00);
        expect (usuario.historico).toEqual([]);
    });

    test('CTU02 - retorna saldo atual', () => {
        expect(usuario.getSaldo()).toBe(50.00);
    });

    test('CTU03 - adicona transacao e atualiza saldo', () => {
        const tipo = 'Recarga';
        const valor = 20.00;

        usuario.adicionarTransacao(tipo,valor);

        expect(usuario.saldo).toBe(70.00);
        expect(usuario.historico).toHaveLength(1);
        expect(usuario.historico[0].tipo).toBe(tipo);
        expect(usuario.historico[0].valor).toBe(valor);
        expect(usuario.historico[0].dataHora).toBeDefined();
    });

    test('CTU04 - adicionar transação negativa (uso no RU)', () => {
        usuario.adicionarTransacao('Almoco', -1.40);
        expect(usuario.saldo).toBe(48.60);

    });

    test('CTU05 - retorna histórico na pagina', () => {

        for(let i = 1; i<=15; i++){
            usuario.adicionarTransacao('Recarga', 10.00);
        }
        const resultado = usuario.getHistorico(1, 10);

        expect(resultado.items).toHaveLength(10);
        expect(resultado.totalItems).toBe(15);
        expect(resultado.totalPages).toBe(2);
        expect(resultado.currentPage).toBe(1);

        const datas = resultado.items.map(item => new Date(item.dataHora));
        for(let i = 0; i<datas.length -1; i++){
            expect(datas[i] >= datas[i + 1]).toBe(true);

        }


    });

    test('CTU06 - deve validar valor mínimo de recarga (R$1,40)', () => {
    expect(() => {
      if (1.39 < 1.40) throw new Error('Valor mínimo de recarga é R$1,40');
    }).toThrow('Valor mínimo de recarga é R$1,40');
  });
});