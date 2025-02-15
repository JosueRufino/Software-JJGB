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
                <div class="col">
                  <label for="descricao" class="form-label">Descrição</label>
                  <textarea
                    class="form-control"
                    id="descricao"
                    v-model="form.descricao"
                    rows="3"
                    required
                  ></textarea>
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
                    v-model="form.quantidade_total"
                    @input="syncQuantidadeDisponivel"
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
                      v-for="categoria in subcat"
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
import { reactive, computed } from "vue";
import Swal from "sweetalert2";
import { useBookStore } from "@/store/books/index"; // Ajuste conforme o caminho correto
import { useSubcategoryStore } from "@/store/subcategory/index";

const form = reactive({
  titulo: "",
  autor: "",
  descricao: "",
  imagem: null,
  isbn: "",
  ano_publicacao: "",
  quantidade_total: 0,
  quantidade_disponivel: 0,
  subcategoria_id: "",
  status: "true",
});

// Atualiza a quantidade disponível para igualar a quantidade total, se válida
const syncQuantidadeDisponivel = () => {
  if (form.quantidade_total > 0) {
    form.quantidade_disponivel = form.quantidade_total;
  } else {
    form.quantidade_disponivel = 0;
  }
};

// Obtém as subcategorias do store
const subcat = computed(() => useSubcategoryStore().subcategories);

onMounted(async () => {
  await useSubcategoryStore().fetchSubcategoriesAndCategories();
});

// Função para validar o formulário
const validateForm = () => {
  const currentYear = new Date().getFullYear();

  if (!form.titulo.trim()) {
    throw new Error("O título não pode estar vazio ou conter apenas espaços.");
  }

  if (!form.autor.trim()) {
    throw new Error("O autor não pode estar vazio ou conter apenas espaços.");
  }

  if (!/^[0-9]{13}$/.test(form.isbn)) {
    throw new Error("O ISBN deve conter exatamente 13 caracteres numéricos.");
  }

  if (form.ano_publicacao > currentYear) {
    throw new Error("O ano de publicação não pode ser maior que o ano atual.");
  }

  if(form.ano_publicacao === 0 || form.ano_publicacao < 0){
    throw new Error("O ano de publicação não pode ser menor ou igual a 0.");
  }

  if (form.quantidade_total <= 0) {
    throw new Error("A quantidade total de livros deve ser maior que zero.");
  }
};

// Função para submeter o formulário
const handleSubmit = async () => {
  try {
    validateForm();

    // Envia os dados para o store ou API
    await useBookStore().addBook(form);

    // Exibe notificação de sucesso
    Swal.fire({
      title: "Sucesso!",
      text: "Livro cadastrado com sucesso.",
      icon: "success",
      confirmButtonText: "OK",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      // Fecha o modal
      const modal = document.getElementById("staticBackdropRegisterBook");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      // Atualiza a página ou faz outra ação necessária
      window.location.reload();
    });
  } catch (error) {
    // Exibe notificação de erro
    Swal.fire({
      title: "Erro",
      text: error.message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};
</script>
