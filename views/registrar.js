import { API_URL } from "../config.js";

export function init() {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const cedula = form.cedula.value.trim();
    const telefono = form.telefono.value.trim();
    const correo = form.correo.value.trim();
    const placa = form.placa.value.trim();
    const chasis = form.chasis.value.trim();
    const kilometraje = form.kilometraje.value.trim();
    const tipo = form.tipo.value.trim();
    const trabajo = form.trabajo.value.trim();
    const observaciones = form.observaciones.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Inicializamos el estado de validación
    let valido = true;

    function marcarCampo(input, condicion) {
      if (condicion) {
        input.classList.remove("error");
        input.classList.add("success");
      } else {
        input.classList.remove("success");
        input.classList.add("error");
        valido = false;
      }
    }

    // Aplicar validaciones a cada campo
    valido &= validarCampo(
      form.nombre,
      nombre.length >= 3,
      "Debe tener al menos 3 caracteres",
      "nombre"
    );
    valido &= validarCampo(
      form.cedula,
      /^\d{6,}$/.test(cedula),
      "Solo números, mínimo 6 dígitos",
      "cedula"
    );
    valido &= validarCampo(
      form.telefono,
      /^\d{10}$/.test(telefono),
      "Debe tener 10 dígitos",
      "telefono"
    );
    valido &= validarCampo(
      form.correo,
      emailRegex.test(correo),
      "Correo inválido",
      "correo"
    );
    valido &= validarCampo(
      form.placa,
      placa.length > 0,
      "Campo obligatorio",
      "placa"
    );
    valido &= validarCampo(
      form.chasis,
      chasis.length > 0,
      "Campo obligatorio",
      "chasis"
    );
    valido &= validarCampo(
      form.kilometraje,
      /^\d+$/.test(kilometraje) && Number(kilometraje) > 0,
      "Debe ser un número mayor a 0",
      "kilometraje"
    );
    valido &= validarCampo(
      form.tipo,
      tipo.length > 0,
      "Campo obligatorio",
      "tipo"
    );
    valido &= validarCampo(
      form.trabajo,
      trabajo.length > 0,
      "Campo obligatorio",
      "trabajo"
    );

    if (!valido) {
      alert("⚠️ Por favor, corrige los campos en rojo antes de continuar.");
      return;
    }

    // Si todo está validado, proceder con el envío
    const now = new Date().toISOString();

    const ingreso = {
      nombre,
      cedula,
      telefono,
      correo,
      placa,
      chasis,
      kilometraje: Number(kilometraje),
      tipo,
      trabajo,
      observaciones,
      estado: "En reparación",
      ingreso: now,
      estadoHistorial: [{ estado: "En reparación", fecha: now }],
      fotos: [],
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
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("✅ Moto registrada correctamente");
        form.reset();
        // Limpiar estados visuales
        form.querySelectorAll("input, textarea").forEach((el) => {
          el.classList.remove("success", "error");
        });
      } else {
        const msg = await res.text();
        console.error("❌ Error al guardar:", msg);
        alert("❌ Error al guardar la moto:\n" + msg);
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
      alert("❌ No se pudo conectar con el servidor.");
    }
  }

  function validarCampo(input, condicion, mensaje = "", campoId) {
    const errorSpan = document.getElementById(`error-${campoId}`);
    if (condicion) {
      input.classList.remove("error");
      input.classList.add("success");
      if (errorSpan) errorSpan.textContent = "";
      return true;
    } else {
      input.classList.add("error");
      input.classList.remove("success");
      if (errorSpan) errorSpan.textContent = mensaje;
      return false;
    }
  }
}
