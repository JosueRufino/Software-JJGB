<template>
  <div class="sidebar">
    <div
      class="d-flex justify-content-center align-items-center p-2"
      style="border-bottom: 1px solid lightgray"
    >
      <img src="/assets/logo.png" alt="" style="max-height: 100px" />
      <h5 style="color: #2596be" class="fw-bold">BIBLIOTECA JJGB</h5>
    </div>
    <div class="sidebar-header">
      <div class="sidebar-profile">
        <img
          src="data:image/webp;base64,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"
          alt="Satoru Gojou"
          class="sidebar-profile-image"
        />
        <h3 class="sidebar-profile-name mb-0">Satoru Gojou</h3>
        <p class="sidebar-profile-role mb-0">Administrador</p>
      </div>
    </div>
    <div class="sidebar-menu">
      <ul class="sidebar-nav">
        <NuxtLink v-for="(link, i) in links" :key="i" :to="link.path" style="text-decoration: none;">
          <li
            class="sidebar-nav-item"
            :class="route.path === link.path ? 'active' : 'sidebar-nav-item'"
          >
            <a href="#" class="sidebar-nav-link">
              <i :class="link.icon"></i>
              <span>{{ link.name }}</span>
            </a>
          </li>
        </NuxtLink>
      </ul>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();

const links = [
  {
    name: "Dashboard",
    icon: "bi bi-grid",
    path: "/funcionario",
  },
  {
    name: "Livros",
    icon: "bi bi-book",
    path: "/funcionario/livros",
  },
  {
    name: "Estudantes",
    icon: "bi bi-people",
    path: "/funcionario/estudante",
  },
  {
    name: "Funcionários",
    icon: "bi bi-person-circle",
    path: "/funcionario/funcionarios",
  },
  {
    name: "Emprestimos/Lista de espera",
    icon: "bi bi-list-columns-reverse",
    path: "/funcionario/emprestimo_ListaDeEspera",
  },
  {
    name: "Notificações",
    icon: "bi bi-bell",
    path: "/funcionario/notificacoes",
  },
];
</script>
<style lang="scss" scoped>
.sidebar {
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-profile-name {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.sidebar-profile-role {
  font-size: 0.9rem;
  color: #6c757d;
}

.sidebar-menu {
  flex-grow: 1;
  overflow-y: auto;
}

.sidebar-nav {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav-item {
  border-bottom: 1px solid #e9ecef;
}

.sidebar-nav-item:hover {
  background-color: lightgray;
  transition: color 0.3s ease;
}

.active {
  background-color: #2596be;
  .sidebar-nav-link {
    color: white;
  }
}

.sidebar-nav-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: #343a40;
  text-decoration: none;
}

.sidebar-nav-link i {
  margin-right: 0.75rem;
}
</style>
