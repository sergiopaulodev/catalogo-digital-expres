export class CatalogView {
  /**
   * @param {string} identificadorContenedor - ID del elemento en el HTML.
   */
  constructor(identificadorContenedor) {
    // Si viene con '#', se lo remueve para getElementById
    const idLimpio = identificadorContenedor.replace(/^#/, "");
    this.elementoContenedor = document.getElementById(idLimpio);

    if (!this.elementoContenedor) {
      console.error(
        `CatalogView: No se encontró el contenedor con ID "${identificadorContenedor}" en el DOM.`
      );
    }
  }

  /**
   * Asocia el evento delegando clics en los botones de agregar al carrito.
   * @param {Function} manejadorEvento 
   */
  asociarEventoAgregarAlCarrito(manejadorEvento) {
    if (!this.elementoContenedor) return;

    this.elementoContenedor.addEventListener("click", (evento) => {
      const boton = evento.target.closest(".tarjeta-producto__boton-agregar");
      if (boton) {
        const identificadorProducto = Number(boton.dataset.identificadorProducto);
        manejadorEvento(identificadorProducto);
      }
    });
  }

  /**
   * Renderiza las tarjetas de los productos dentro del contenedor.
   * @param {Array<Object>} listaDeProductos 
   */
  renderizarCatalogoProductos(listaDeProductos = []) {
    if (!this.elementoContenedor) {
      console.error("CatalogView: Imposible renderizar, elementoContenedor es null.");
      return;
    }

    if (!Array.isArray(listaDeProductos) || listaDeProductos.length === 0) {
      this.elementoContenedor.innerHTML = `<p class="catalogo-vacio-mensaje">No hay productos disponibles.</p>`;
      return;
    }

    let htmlAcumulado = "";

    listaDeProductos.forEach((producto) => {
      const precioNumerico = typeof producto.precioProductoEnPesos === "number"
        ? producto.precioProductoEnPesos
        : (producto.precioUnitarioEnPesos || 0);

      const imagenUrl = producto.urlImagenProducto || "https://via.placeholder.com/300x200?text=Sin+Imagen";

      htmlAcumulado += `
        <article class="tarjeta-producto" data-identificador-producto="${producto.identificadorProducto}">
          <img 
            src="${imagenUrl}" 
            alt="${producto.nombreProducto || 'Producto'}" 
            class="tarjeta-producto__imagen"
            loading="lazy"
          />
          <div class="tarjeta-producto__contenido">
            <span class="tarjeta-producto__categoria">${producto.categoriaProducto || 'General'}</span>
            <h3 class="tarjeta-producto__titulo">${producto.nombreProducto || 'Sin título'}</h3>
            <p class="tarjeta-producto__descripcion">${producto.descripcionProducto || ''}</p>
            <div class="tarjeta-producto__pie">
              <span class="tarjeta-producto__precio">$${precioNumerico.toFixed(2)}</span>
              <button 
                type="button" 
                class="tarjeta-producto__boton-agregar"
                data-identificador-producto="${producto.identificadorProducto}"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </article>
      `;
    });

    this.elementoContenedor.innerHTML = htmlAcumulado;
  }
}