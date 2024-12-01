import { defineStore } from "pinia";

export const useEmprestimosStore = defineStore("emprestimos", {
  state: () => ({
    emprestimos: [], // Lista de empréstimos combinada com os dados dos estudantes
    emprestimos2: []
  }),

  actions: {
    // Busca os empréstimos e combina com os estudantes para um livro específico
    async fetchEmprestimosPorLivro(livroId) {
      try {
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?livro_id=${livroId}`
        );
        const responseEstudantes = await fetch("http://localhost:3001/estudantes");

        if (!responseEmprestimos.ok || !responseEstudantes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const emprestimos = await responseEmprestimos.json();
        const estudantes = await responseEstudantes.json();

        const auxEm = emprestimos.filter(
          (emprestimo) => emprestimo.livro_id === 1 && emprestimo.status === 0
        );

        this.emprestimos = auxEm.map((item) => {
          const estudante = estudantes.find(
            (estudante) => estudante.id == item.estudante_id
          );
          return {
            ...item,
            estudante,
          };
        });
        console.log("Empréstimos para o livro (status 0):", this.emprestimos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },

    async fetchEmprestimosPorLivroOthers(livroId) {
      try {
        const responseEmprestimos = await fetch(
          `http://localhost:3001/emprestimos?livro_id=${livroId}`
        );
        const responseEstudantes = await fetch("http://localhost:3001/estudantes");

        if (!responseEmprestimos.ok || !responseEstudantes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const emprestimos = await responseEmprestimos.json();
        const estudantes = await responseEstudantes.json();

        const auxEm = emprestimos.filter(
          (emprestimo) => emprestimo.livro_id === livroId && emprestimo.status !== 0
        );

        this.emprestimos2 = auxEm.map((item) => {
          const estudante = estudantes.find(
            (estudante) => estudante.id == item.estudante_id
          );
          return {
            ...item,
            estudante,
          };
        });
        console.log("Empréstimos para o livro (status 0):", this.emprestimos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    },

    // Função para cadastrar um novo empréstimo
    async cadastrarEmprestimo(novoEmprestimo) {
      try {
        // Envia os dados para a API para cadastrar o empréstimo
        const response = await fetch("http://localhost:3001/emprestimos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoEmprestimo),
        });

        if (!response.ok) {
          throw new Error("Erro ao cadastrar o empréstimo");
        }

        // Atualiza o estado local com o novo empréstimo, após o cadastro com sucesso
        const emprestimoCadastrado = await response.json();
        this.emprestimos.push(emprestimoCadastrado);
        
        // Opcionalmente, você pode adicionar o estudante à lista de empréstimos, se necessário
        console.log("Novo empréstimo cadastrado com sucesso:", emprestimoCadastrado);
      } catch (error) {
        console.error("Erro ao cadastrar o empréstimo:", error);
      }
    }
  },

  getters: {
    emprestimosComEstudantes: (state) => state.emprestimos,
    emprestimosComEstudantes2: (state) => state.emprestimos2
  },
});
