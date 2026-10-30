/**
 * CONFIGURACIÓN DEL FORMULARIO DE AUDITORÍA EXPRESS
 * -------------------------------------------------
 * Para recibir las consultas en tu correo:
 * 1. Creá una cuenta gratuita en https://formspree.io/ (o servicio similar).
 * 2. Creá un nuevo formulario y copiá la URL del endpoint (ej: "https://formspree.io/f/xyzabcde").
 * 3. Pegá esa URL reemplazando el valor de FORM_ENDPOINT acá abajo.
 */
const FORM_ENDPOINT = "https://formspree.io/f/ejemplo123";

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      mainNav.classList.toggle("open");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("open");
      });
    });
  }

  const fadeElements = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeElements.forEach((el) => observer.observe(el));
  } else {
    fadeElements.forEach((el) => el.classList.add("visible"));
  }

  const auditForm = document.getElementById("audit-form");
  const formStatus = document.getElementById("form-status");

  if (auditForm && formStatus) {
    auditForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formStatus.className = "form-status";
      formStatus.textContent = "";

      const nombre = auditForm.nombre.value.trim();
      const empresa = auditForm.empresa.value.trim();
      const rubro = auditForm.rubro.value.trim();
      const email = auditForm.email.value.trim();
      const sistema = auditForm.sistema.value.trim();
      const mensaje = auditForm.mensaje.value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nombre || !empresa || !rubro || !email || !sistema || !mensaje) {
        formStatus.classList.add("error");
        formStatus.textContent = "Por favor, completá todos los campos obligatorios (*).";
        return;
      }

      if (!emailRegex.test(email)) {
        formStatus.classList.add("error");
        formStatus.textContent = "Ingresá una dirección de email válida.";
        return;
      }

      if (FORM_ENDPOINT.includes("ejemplo") || FORM_ENDPOINT.includes("[COMPLETAR")) {
        formStatus.classList.add("success");
        formStatus.textContent = "Validación exitosa. Recordá configurar tu constante FORM_ENDPOINT en /assets/js/main.js para recibir los envíos.";
        return;
      }

      try {
        formStatus.textContent = "Enviando solicitud...";
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ nombre, empresa, rubro, email, sistema, mensaje })
        });

        if (response.ok) {
          formStatus.classList.add("success");
          formStatus.textContent = "¡Gracias! Recibimos tu solicitud. Te vamos a contactar a la brevedad para coordinar la auditoría.";
          auditForm.reset();
        } else {
          throw new Error("Error en el servidor");
        }
      } catch (err) {
        formStatus.classList.add("error");
        formStatus.textContent = "No pudimos enviar el formulario en este momento. Por favor, escribinos por LinkedIn o correo.";
      }
    });
  }
});
