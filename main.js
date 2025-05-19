const routes = {
  menu: { html: 'views/menu.html' },
  registrar: { html: 'views/registrar.html', js: 'views/registrar.js' },
  taller: { html: 'views/taller.html', js: 'views/taller.js' },
  eliminar: { html: 'views/eliminar.html', js: 'views/eliminar.js' },
};

function loadView(name) {
  const { html, js } = routes[name] || {};
  const container = document.getElementById('app');
  if (!html) return (container.innerHTML = '<p>Error al cargar la vista.</p>');

  fetch(html)
    .then(res => res.text())
    .then(htmlContent => {
      container.innerHTML = htmlContent;
      if (js) import(`./${js}`).then(mod => mod.init());
    })
    .catch(() => (container.innerHTML = '<p>Error al cargar la vista.</p>'));
}

window.loadView = loadView;

// Cargar menú al inicio
fetch('views/menu.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu-principal').innerHTML = html;
  });
