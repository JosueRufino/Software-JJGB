export const useBookStore = defineStore("book", {
  state: () => ({
    books: [], // Todos os livros carregados
    book: null,
    filteredBooks: [], // Livros filtrados
    loading: false,
    error: null,
    selectedBook: null,
  }),

  getters: {
    getAllBooks: (state) => state.filteredBooks,
    getBookId: (state) => state.book,
    getTotalBooks: (state) => state.filteredBooks.length || state.books.length,
    getAuthors: (state) => {
      // Utiliza um Set para evitar duplicados
      const authorNames = new Set(state.books.map((book) => book.autor));
      return Array.from(authorNames); // Converte o Set de volta para um array
    },
  },

  actions: {
    // Buscar todos os livros
    // Busca todos os livros
    async fetchBooks() {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch("http://localhost:3001/livros", {
          method: "GET",
        });

        if (response) {
          this.books = response;
          this.filteredBooks = [...this.books];
          console.log("fetch", this.books);
        } else {
          throw new Error("Formato de resposta inválido");
        }
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        this.error = error.message || "Erro ao carregar os livros";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchBookById(id) {
      try {
        const response = await $fetch(`http://localhost:3001/livros/${id}`);
        if (response) {
          this.book = response; // Atualiza o estado do livro com os dados retornados
        }
      } catch (error) {
        console.error("Erro ao buscar o livro por ID:", error);
      }
    },

    // Filtrar por autor
    filterByAuthor(authorName) {
      this.loading = true;
      try {
        console.log("Filtrando por autor:", authorName);

        if (!authorName) {
          this.filteredBooks = [...this.books];
          return;
        }

        this.filteredBooks = this.books.filter((book) => {
          const matches = book.autor
            ?.toLowerCase()
            .includes(authorName.toLowerCase());
          console.log(`Livro "${book.autor}" corresponde? ${matches}`);
          return matches;
        });

        console.log("Livros filtrados por autor:", this.filteredBooks);
      } catch (error) {
        console.error("Erro ao filtrar por autor:", error);
      } finally {
        this.loading = false;
      }
    },

    // Filtrar por status
    filterByStatus(status) {
      this.loading = true;
      try {
        console.log("Filtrando por status:", status);

        this.filteredBooks = this.books.filter((book) => {
          const matches = String(book.status) === String(status);
          console.log(
            `Status do livro: ${book.status}, corresponde ao filtro? ${matches}`
          );
          return matches;
        });

        console.log("Livros filtrados por status:", this.filteredBooks);
      } catch (error) {
        console.error("Erro ao filtrar por status:", error);
      } finally {
        this.loading = false;
      }
    },

    // Filtrar por subcategoria
    filterBySubcategory(subcategoryId) {
      this.loading = true;
      try {
        console.log("Filtrando por subcategoria:", subcategoryId);

        this.filteredBooks = this.books.filter((book) => {
          const matches =
            String(book.subcategoria_id) === String(subcategoryId);
          console.log(
            `Subcategoria do livro: ${book.subcategoria_id}, corresponde? ${matches}`
          );
          return matches;
        });

        console.log("Livros filtrados por subcategoria:", this.filteredBooks);
      } catch (error) {
        console.error("Erro ao filtrar por subcategoria:", error);
      } finally {
        this.loading = false;
      }
    },

    // Filtrar combinando múltiplos critérios
    filterBooks(params = {}) {
      this.loading = true;
      try {
        console.log("Parâmetros de filtro:", params);
        let filtered = [...this.books];

        if (params.author) {
          filtered = filtered.filter((book) => {
            const matches = book.autor
              ?.toLowerCase()
              .includes(params.author.toLowerCase());
            console.log(
              `Livro "${book.autor}" corresponde ao autor? ${matches}`
            );
            return matches;
          });
        }

        if (params.status) {
          filtered = filtered.filter((book) => {
            const matches = String(book.status) === String(params.status);
            console.log(
              `Status do livro: ${book.status}, corresponde? ${matches}`
            );
            return matches;
          });
        }

        if (params.subcategory) {
          filtered = filtered.filter((book) => {
            const matches = book.subcategoria_id === params.subcategory;
            console.log(
              `Subcategoria do livro: ${book.subcategoria_id}, corresponde? ${matches}`
            );
            return matches;
          });
        }

        this.filteredBooks = filtered;
        console.log(
          "Livros filtrados por múltiplos critérios:",
          this.filteredBooks
        );
      } catch (error) {
        console.error("Erro ao filtrar livros:", error);
      } finally {
        this.loading = false;
      }
    },

    async updateBookPartial(bookId, updatedData) {
      this.loading = true;
      this.error = null;

      try {
        if (!bookId) {
          throw new Error("ID do livro é inválido ou não foi fornecido.");
        }

        // Verificar os dados a serem atualizados
        if (!Object.keys(updatedData).length) {
          throw new Error("Nenhum dado fornecido para atualizar o livro.");
        }

        // Fazer a requisição PATCH para atualizar parcialmente o livro
        const response = await $fetch(
          `http://localhost:3001/livros/${bookId}`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedData),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Atualizar estado local após sucesso
        if (response) {
          const index = this.books.findIndex((book) => book.id === bookId);
          if (index !== -1) {
            this.books[index] = { ...this.books[index], ...updatedData };
            this.filteredBooks[index] = {
              ...this.filteredBooks[index],
              ...updatedData,
            };
          }

          console.log("Livro atualizado parcialmente com sucesso:", response);
          return response;
        }
      } catch (error) {
        console.error("Erro ao atualizar parcialmente o livro:", error);
        this.error = error.message || "Erro ao atualizar parcialmente o livro.";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // Função para atualizar os dados do livro
    async updateBook(bookId, updatedData) {
      this.loading = true;
      this.error = null;

      try {
        // Enviar requisição PUT para atualizar o livro
        const response = await $fetch(
          `http://localhost:3001/livros/${bookId}`,
          {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Verifica se a resposta foi bem-sucedida
        if (response) {
          // Atualizar o estado local com os novos dados do livro
          const index = this.books.findIndex((book) => book.id === bookId);
          if (index !== -1) {
            this.books[index] = response;
            this.filteredBooks[index] = response;
          }

          console.log("Livro atualizado com sucesso:", response);
          return response;
        }
      } catch (error) {
        console.error("Erro ao atualizar o livro:", error);
        this.error = error.message || "Erro ao atualizar o livro";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar um livro
    async deleteBook(bookId) {
      this.loading = true;
      try {
        console.log(`Tentando deletar livro com ID: ${bookId}`);

        // Faz a requisição para deletar o livro no backend
        await $fetch(`http://localhost:3001/livros/${bookId}`, {
          method: "DELETE",
        });

        // Remove o livro do estado local
        this.books = this.books.filter((book) => book.id !== bookId);
        this.filteredBooks = this.filteredBooks.filter(
          (book) => book.id !== bookId
        );

        console.log(`Livro com ID ${bookId} deletado com sucesso.`);
      } catch (error) {
        console.error(`Erro ao deletar o livro com ID ${bookId}:`, error);
        this.error = error.message || "Erro ao deletar o livro";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addBook(form) {
      this.loading = true;
      this.error = null;
      console.log(form);

      try {
        // Criar FormData para upload
        const formData = new FormData();

        // Obter a data atual para os campos createdAt e updatedAt
        const currentDate = new Date().toISOString(); // Formato ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"

        // Adicionar dados do livro ao FormData
        const bookData = {
          titulo: form.titulo,
          descricao: form.descricao, // Descrição do livro
          autor: form.autor,
          isbn: form.isbn,
          ano_publicacao: form.ano_publicacao,
          quantidade_total: form.quantidade_total,
          quantidade_disponivel: form.quantidade_disponivel,
          subcategoria_id: form.subcategoria_id,
          status: form.status === "true", // Converte para booleano
          createdAt: currentDate, // Atribui a data de criação
          updatedAt: currentDate, // Atribui a mesma data para atualização
        };

        console.log("bookDta", bookData);

        formData.append("book", JSON.stringify(bookData));

        // Adicionar imagem se existir
        if (form.imagem) {
          formData.append("imagem", form.imagem);
        }
        console.log("formData", formData);
        // Enviar requisição POST para criar livro
        const response = await $fetch("http://localhost:3001/livros", {
          method: "POST",
          body: bookData,
          headers: {
            Accept: "application/json",
          },
        });
        console.log("respnse", response);
        // Adicionar o novo livro ao estado local
        if (response) {
          this.books.push(response);
          console.log("Livro cadastrado com sucesso:", response);
        }

        return response;
      } catch (error) {
        console.error("Erro ao cadastrar livro:", error);
        this.error = error.message || "Erro ao cadastrar o livro";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Método para resetar o formulário
    resetBookForm() {
      this.form = {
        titulo: "",
        autor: "",
        imagem: null,
        isbn: "",
        ano_publicacao: "",
        quantidade_disponivel: "",
        subcategoria_id: "",
        status: "true",
      };
    },

    // Limpar filtros
    clearFilters() {
      this.filteredBooks = [...this.books];
    },

    // Resetar o estado completamente
    resetState() {
      this.books = [];
      this.filteredBooks = [];
      this.loading = false;
      this.error = null;
      this.selectedBook = null;
    },
  },
});
