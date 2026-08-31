/**
 * Vista encargada del renderizado y captura de eventos en la grilla del catálogo de productos.
 */
export class CatalogView {
  /**
   * Instancia la vista asociando el contenedor principal del catálogo.
   * @param {string} identificadorContenedor - ID del elemento HTML contenedor.
   */
  constructor(identificadorContenedor = "seccionCatalogoProductos") {
    this.elementoContenedorCatalogo = document.getElementById(identificadorContenedor);

    if (!this.elementoContenedorCatalogo) {
      throw new Error(`CatalogView: No se encontró el contenedor con ID "${identificadorContenedor}".`);
    }
  }

  /**
   * Asocia una función callback al evento de clic en "Agregar al carrito" mediante delegación de eventos.
   * @param {Function} funcionManejadoraAgregar - Callback que recibe el ID del producto seleccionado.
   */
  asociarEventoAgregarAlCarrito(funcionManejadoraAgregar) {
    if (typeof funcionManejadoraAgregar !== "function") {
      console.error("CatalogView: Se requiere una función callback válida.");
      return;
    }

    this.elementoContenedorCatalogo.addEventListener("click", (eventoDeClic) => {
      const botonDisparador = eventoDeClic.target.closest(".tarjeta-producto__boton-agregar");
      if (!botonDisparador) return;

      const identificadorProductoStr = botonDisparador.dataset.identificadorProducto;
      const identificadorProductoNumerico = Number(identificadorProductoStr);

      if (!isNaN(identificadorProductoNumerico)) {
        funcionManejadoraAgregar(identificadorProductoNumerico);
      }
    });
  }

  /**
   * Renderiza la lista de productos dentro del contenedor del catálogo.
   * @param {Array<Object>} listaDeProductos - Productos a mostrar en la interfaz.
   */
  renderizarCatalogo(listaDeProductos) {
    if (!Array.isArray(listaDeProductos) || listaDeProductos.length === 0) {
      this.elementoContenedorCatalogo.innerHTML = `
        <p class="catalogo-vacio">No hay productos disponibles en el catálogo en este momento.</p>
      `;
      return;
    }

    let htmlAcumulado = '<div class="grilla-catalogo-productos">';

    listaDeProductos.forEach((productoItem) => {
      if (!productoItem.estaDisponibleParaVenta) return;

      htmlAcumulado += `
        <article class="tarjeta-producto" data-identificador-tarjeta="${productoItem.identificadorProducto}">
          <img 
            src="${productoItem.imagenProductoUrl}" 
            alt="${productoItem.nombreProducto}" 
            class="tarjeta-producto__imagen"
            loading="lazy"
          />
          <div class="tarjeta-producto__cuerpo">
            <h3 class="tarjeta-producto__nombre">${productoItem.nombreProducto}</h3>
            <p class="tarjeta-producto__precio">$${productoItem.precioProductoEnPesos.toFixed(2)}</p>
            <button 
              type="button" 
              class="tarjeta-producto__boton-agregar"
              data-identificador-producto="${productoItem.identificadorProducto}"
            >
              Agregar al carrito
            </button>
          </div>
        </article>
      `;
    });

    htmlAcumulado += "</div>";

    this.elementoContenedorCatalogo.innerHTML = htmlAcumulado;
  }
}