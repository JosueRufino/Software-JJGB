<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="staticBackdropRegisterBook"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Cadastrar novo livro
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div class="col">
                  <label for="imagem" class="form-label">Imagem</label>
                  <input
                    type="file"
                    class="form-control"
                    id="imagem"
                    @change="handleImageUpload"
                    accept="image/*"
                  />
                </div>
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="titulo" class="form-label">Título</label>
                  <input
                    type="text"
                    class="form-control"
                    id="titulo"
                    v-model="form.titulo"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="autor" class="form-label">Autor</label>
                  <input
                    type="text"
                    class="form-control"
                    id="autor"
                    v-model="form.autor"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="isbn" class="form-label">ISBN</label>
                  <input
                    type="text"
                    class="form-control"
                    id="isbn"
                    v-model="form.isbn"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="ano_publicacao" class="form-label"
                    >Ano de Publicação</label
                  >
                  <input
                    type="number"
                    class="form-control"
                    id="ano_publicacao"
                    v-model="form.ano_publicacao"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="quantidade_disponivel" class="form-label"
                    >Quantidade Disponível</label
                  >
                  <input
                    type="number"
                    class="form-control"
                    id="quantidade_disponivel"
                    v-model="form.quantidade_disponivel"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="subcategoria_id" class="form-label"
                    >Subcategoria</label
                  >
                  <select
                    class="form-select"
                    id="subcategoria_id"
                    v-model="form.subcategoria_id"
                    required
                  >
                    <option value="" disabled>
                      Selecione uma subcategoria
                    </option>
                    <option
                      v-for="categoria in subcategorias"
                      :key="categoria.id"
                      :value="categoria.id"
                    >
                      {{ categoria.nome }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Status</label>
                  <div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id="disponivel"
                        value="true"
                        v-model="form.status"
                      />
                      <label class="form-check-label" for="disponivel">
                        Disponível
                      </label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="status"
                        id="indisponivel"
                        value="false"
                        v-model="form.status"
                      />
                      <label class="form-check-label" for="indisponivel">
                        Indisponível
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Fechar
            </button>
            <button type="submit" class="btn btn-primary">Cadastrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useBookStore } from "@/store/books/index"; // Importar o store, se estiver usando Pinia, por exemplo

const form = reactive({
  titulo: "",
  autor: "",
  imagem: null, // Para armazenar o arquivo de imagem
  isbn: "",
  ano_publicacao: "",
  quantidade_disponivel: "",
  subcategoria_id: "",
  status: "true",
});

// Exemplo de subcategorias (geralmente vindo de uma API ou store)
const subcategorias = [
  { id: 1, nome: "Ficção" },
  { id: 2, nome: "História" },
  { id: 3, nome: "Ciência" },
];

// Função para lidar com o upload da imagem
const handleImageUpload = (event) => {
  form.imagem = event.target.files[0]; // Armazena o arquivo selecionado
};

// Chama o store para adicionar o livro
const handleSubmit = async () => {
  try {
    // Atribuir o form atual ao livro a ser adicionado no store
    await useBookStore().addBook(form); // Passa os dados do form para o store

    // Fecha o modal após o cadastro
    const modal = document.getElementById("staticBackdropRegisterBook");
    const modalInstance = bootstrap.Modal.getInstance(modal); // Acessa a instância do modal
    modalInstance.hide(); // Fecha o modal
  } catch (erro) {
    // Mostra mensagem de erro ao usuário
    alert("Erro ao cadastrar livro");
  }
};
</script>
