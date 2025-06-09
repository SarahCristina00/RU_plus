//conexão com o servidor
 
export async function fetchUserData(matricula, page = 1) {
    try {
        const [resSaldo, resHistorico] = await Promise.all([
            fetch(`/recargas/saldo/${matricula}`),
            fetch(`/recargas/historico/${matricula}?page=${page}`)
        ]);

        if (!resSaldo.ok || !resHistorico.ok) {
            throw new Error('Não foi possível carregar os dados. Verifique a matrícula e tente novamente.');
        }

        const dadosSaldo = await resSaldo.json();
        const dadosHistorico = await resHistorico.json();

        return { dadosSaldo, dadosHistorico };

    } catch (error) {
        console.error("Erro na API:", error);
        throw error;
    }
}

//recarga para o servidor
export async function realizarRecarga(matricula, valor, metodoPagamento) {
    try {
        const response = await fetch('/recargas/realizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                matricula: matricula,
                valor: valor,
                metodo: metodoPagamento,
            }),
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || 'Não foi possível realizar a recarga.');
        }

        return await response.json();

    } catch (error) {
        console.error("Erro ao realizar recarga:", error);
        throw error;
    }
}