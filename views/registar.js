import { API_URL } from '../config.js';

export function init() {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const now = new Date().toISOString();

    const ingreso = {
      nombre: form.nombre.value.trim(),
      cedula: form.cedula.value.trim(),
      telefono: form.telefono.value.trim(),
      correo: form.correo.value.trim(),
      placa: form.placa.value.trim(),
      chasis: form.chasis.value.trim(),
      kilometraje: form.kilometraje.value.trim(),
      tipo: form.tipo.value.trim(),
      trabajo: form.trabajo.value.trim(),
      observaciones: form.observaciones.value.trim(),
      estado: "En reparación",
      ingreso: now,
      estadoHistorial: [{ estado: "En reparación", fecha: now }],
      fotos: []
    };

    const files = form.fotos.files;
    if (files.length > 0) {
      let loaded = 0;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          ingreso.fotos.push(e.target.result);
          loaded++;
          if (loaded === files.length) submitToAPI(ingreso);
        };
        reader.readAsDataURL(files[i]);
      }
    } else {
      submitToAPI(ingreso);
    }
  });

    async function submitToAPI(data) {
    try {
      // Convertir kilometraje a número real
      data.kilometraje = Number(data.kilometraje);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("✅ Moto registrada correctamente");
        form.reset();
      } else {
        const msg = await res.text();
        console.error("❌ Error al guardar:", msg);
        alert("❌ Error al guardar la moto:\n" + msg);
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("❌ No se pudo conectar con el servidor.\nRevisa tu conexión o intenta más tarde.");
    }
  }

}
