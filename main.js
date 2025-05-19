const routes = {
  registrar: { html: 'views/registrar.html', js: 'views/registrar.js' },
  taller: { html: 'views/taller.html', js: 'views/taller.js' },
  eliminar: { html: 'views/eliminar.html', js: 'views/eliminar.js' },
};

function loadView(name) {
  const route = routes[name];
  const container = document.getElementById('app');

  if (!route) {
    container.innerHTML = '<p>Vista no disponible.</p>';
    return;
  }

  fetch(route.html)
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      if (route.js) import(`./${route.js}`).then(m => m.init());
    })
    .catch(() => {
      container.innerHTML = '<p>Error al cargar la vista.</p>';
    });
}

// Cargar el menú de navegación UNA SOLA VEZ
fetch('views/menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu-principal').innerHTML = html;
  });

// Por defecto muestra la vista "registrar"
loadView("registrar");
