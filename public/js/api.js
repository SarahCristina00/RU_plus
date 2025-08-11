// Conexão com o servidor
export async function buscarDadosUsuario(matricula, pagina = 1) {
    try {
        const [respostaSaldo, respostaHistorico] = await Promise.all([
            fetch(`/recargas/saldo/${matricula}`),
            fetch(`/recargas/historico/${matricula}?page=${pagina}`),
        ]);

        if (!respostaSaldo.ok || !respostaHistorico.ok) {
            throw new Error(
                "Não foi possível carregar os dados. Verifique a matrícula e tente novamente.",
            );
        }

        const dadosSaldo = await respostaSaldo.json();
        const dadosHistorico = await respostaHistorico.json();

        return { dadosSaldo, dadosHistorico };
    } catch (erro) {
        console.error("Erro na API:", erro);
        throw erro;
    }
}

export async function enviarRecarga(matricula, valor, metodoPagamento) {
    try {
        const resposta = await fetch("/recargas/recarga", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matricula, valor, metodo: metodoPagamento }),
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(
                erro.mensagem || "Não foi possível realizar a recarga.",
            );
        }

        return await resposta.json();
    } catch (erro) {
        console.error("Erro ao realizar recarga:", erro);
        throw erro;
    }
}
