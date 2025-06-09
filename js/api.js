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