/**
 * Vista encargada del renderizado del modal del carrito de compras y la captura de sus eventos.
 */
export class CartView {
  /**
   * Inicializa los elementos del DOM necesarios para operar el modal del carrito.
   * @param {string} identificadorBotonAbrir - ID del botón del encabezado para abrir el carrito.
   * @param {string} identificadorContador - ID del elemento del contador en el encabezado.
   */
  constructor(
    identificadorBotonAbrir = "botonAbrirCarritoCompras",
    identificadorContador = "contadorUnidadesCarritoCompras"
  ) {
    this.elementoBotonAbrir = document.getElementById(identificadorBotonAbrir);
    this.elementoContadorUnidades = document.getElementById(identificadorContador);

    if (!this.elementoBotonAbrir || !this.elementoContadorUnidades) {
      throw new Error("CartView: No se encontraron los elementos del encabezado para el carrito.");
    }

    this.crearEstructuraModalEnElDom();
  }

  /**
   * Inyecta la estructura HTML base del modal/drawer en el body si no existe.
   */
  crearEstructuraModalEnElDom() {
    let contenedorModal = document.getElementById("modalCarritoCompras");

    if (!contenedorModal) {
      contenedorModal = document.createElement("div");
      contenedorModal.id = "modalCarritoCompras";
      contenedorModal.className = "modal-carrito";
      contenedorModal.innerHTML = `
        <div class="modal-carrito__contenido">
          <header class="modal-carrito__encabezado">
            <h2 class="modal-carrito__titulo">Tu Carrito</h2>
            <button type="button" class="modal-carrito__boton-cerrar" id="botonCerrarCarritoCompras">&times;</button>
          </header>
          <div class="modal-carrito__lista-items" id="contenedorListaItemsCarrito"></div>
          <footer class="modal-carrito__pie">
            <div class="modal-carrito__resumen-total">
              <span>Total:</span>
              <span id="montoTotalCarritoCompras">$0.00</span>
            </div>
            <button type="button" class="modal-carrito__boton-whatsapp" id="botonEnviarPedidoWhatsApp">
              Finalizar Pedido por WhatsApp
            </button>
            <button type="button" class="modal-carrito__boton-vaciar" id="botonVaciarCarritoCompras">
              Vaciar carrito
            </button>
          </footer>
        </div>
      `;
      document.body.appendChild(contenedorModal);
    }

    this.elementoModal = contenedorModal;
    this.elementoContenedorLista = document.getElementById("contenedorListaItemsCarrito");
    this.elementoMontoTotal = document.getElementById("montoTotalCarritoCompras");
    this.elementoBotonCerrar = document.getElementById("botonCerrarCarritoCompras");
    this.elementoBotonEnviarWhatsApp = document.getElementById("botonEnviarPedidoWhatsApp");
    this.elementoBotonVaciar = document.getElementById("botonVaciarCarritoCompras");

    this.inicializarEventosModal();
  }

  /**
   * Configura las aperturas y cierres del modal.
   */
  inicializarEventosModal() {
    this.elementoBotonAbrir.addEventListener("click", () => this.abrirModal());
    this.elementoBotonCerrar.addEventListener("click", () => this.cerrarModal());

    this.elementoModal.addEventListener("click", (eventoClic) => {
      if (eventoClic.target === this.elementoModal) {
        this.cerrarModal();
      }
    });
  }

  abrirModal() {
    this.elementoModal.classList.add("modal-carrito--visible");
  }

  cerrarModal() {
    this.elementoModal.classList.remove("modal-carrito--visible");
  }

  /**
   * Asocia la acción de eliminar un ítem específico del carrito.
   * @param {Function} funcionManejadoraEliminar - Callback que recibe el ID del producto a eliminar.
   */
  asociarEventoEliminarItem(funcionManejadoraEliminar) {
    if (typeof funcionManejadoraEliminar !== "function") return;

    this.elementoContenedorLista.addEventListener("click", (eventoClic) => {
      const botonEliminar = eventoClic.target.closest(".item-carrito__boton-eliminar");
      if (!botonEliminar) return;

      const identificadorProductoNumerico = Number(botonEliminar.dataset.identificadorProducto);
      if (!isNaN(identificadorProductoNumerico)) {
        funcionManejadoraEliminar(identificadorProductoNumerico);
      }
    });
  }

  /**
   * Asocia la acción de vaciar completamente el carrito.
   * @param {Function} funcionManejadoraVaciar - Callback a ejecutar al vaciar.
   */
  asociarEventoVaciarCarrito(funcionManejadoraVaciar) {
    if (typeof funcionManejadoraVaciar !== "function") return;

    this.elementoBotonVaciar.addEventListener("click", () => {
      funcionManejadoraVaciar();
    });
  }

  /**
   * Asocia la acción de checkout para enviar el pedido por WhatsApp.
   * @param {Function} funcionManejadoraCheckout - Callback a ejecutar al hacer clic en enviar.
   */
  asociarEventoEnviarWhatsApp(funcionManejadoraCheckout) {
    if (typeof funcionManejadoraCheckout !== "function") return;

    this.elementoBotonEnviarWhatsApp.addEventListener("click", () => {
      funcionManejadoraCheckout();
    });
  }

  /**
   * Renderiza los ítems y el total del carrito en la interfaz.
   * @param {Array<Object>} listaDeItems - Lista de productos en el carrito.
   * @param {number} montoTotalEnPesos - Monto acumulado en pesos.
   * @param {number} cantidadTotalDeUnidades - Cantidad total de productos.
   */
  /**
   * Renderiza los ítems y el total del carrito en la interfaz.
   * @param {Array<Object>} listaDeItems - Lista de productos en el carrito.
   * @param {number} montoTotalEnPesos - Monto acumulado en pesos.
   * @param {number} cantidadTotalDeUnidades - Cantidad total de productos.
   */
  renderizarCarrito(
    listaDeItems = [],
    montoTotalEnPesos = 0,
    cantidadTotalDeUnidades = 0
  ) {
    // Validacion defensiva para evitar TypeError por undefined
    const totalSeguro = typeof montoTotalEnPesos === "number" ? montoTotalEnPesos : 0;
    const unidadesSeguras = typeof cantidadTotalDeUnidades === "number" ? cantidadTotalDeUnidades : 0;

    this.elementoContadorUnidades.textContent = unidadesSeguras;
    this.elementoMontoTotal.textContent = `$${totalSeguro.toFixed(2)}`;

    if (!Array.isArray(listaDeItems) || listaDeItems.length === 0) {
      this.elementoContenedorLista.innerHTML = `
        <p class="carrito-vacio-mensaje">Tu carrito está vacío.</p>
      `;
      this.elementoBotonEnviarWhatsApp.disabled = true;
      return;
    }

    this.elementoBotonEnviarWhatsApp.disabled = false;
    let htmlAcumulado = "";

    listaDeItems.forEach((itemCarrito) => {
      const precioUnitario = typeof itemCarrito.precioUnitarioEnPesos === "number" 
        ? itemCarrito.precioUnitarioEnPesos 
        : 0;
      
      const cantidad = itemCarrito.cantidadUnidadesSeleccionadas || 1;
      const subtotalPorItemEnPesos = cantidad * precioUnitario;

      htmlAcumulado += `
        <div class="item-carrito">
          <div class="item-carrito__detalles">
            <span class="item-carrito__nombre">${itemCarrito.nombreProducto || "Producto"}</span>
            <span class="item-carrito__subtotal">
              ${cantidad} x $${precioUnitario.toFixed(2)} = $${subtotalPorItemEnPesos.toFixed(2)}
            </span>
          </div>
          <button 
            type="button" 
            class="item-carrito__boton-eliminar"
            data-identificador-producto="${itemCarrito.identificadorProducto}"
          >
            Eliminar
          </button>
        </div>
      `;
    });

    this.elementoContenedorLista.innerHTML = htmlAcumulado;
  }
}