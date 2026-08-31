/**
 * Controlador encargado de la coordinación entre CatalogModel y CatalogView.
 */
export class CatalogController {
  /**
   * @param {CatalogModel} instanciadorCatalogModel
   * @param {CartModel} instanciadorCartModel
   * @param {CatalogView} instanciadorCatalogView
   */
  constructor(
    instanciadorCatalogModel,
    instanciadorCartModel,
    instanciadorCatalogView
  ) {
    if (!instanciadorCatalogModel || !instanciadorCartModel || !instanciadorCatalogView) {
      throw new Error("CatalogController: Dependencias inválidas en el constructor.");
    }

    this.modeloCatalogo = instanciadorCatalogModel;
    this.modeloCarrito = instanciadorCartModel;
    this.vistaCatalogo = instanciadorCatalogView;

    this.inicializarEscuchadores();
    this.sincronizarEstadoInicialVista();
  }

  inicializarEscuchadores() {
    // Escuchar cuando el usuario hace clic en "Agregar al carrito"
    this.vistaCatalogo.asociarEventoAgregarAlCarrito((identificadorProducto) => {
      this.manejadorAgregarProductoAlCarrito(identificadorProducto);
    });
  }

  /**
   * Obtiene la lista completa del modelo y manda a renderizar la vista.
   */
  sincronizarEstadoInicialVista() {
    const listaProductos = this.modeloCatalogo.obtenerTodosLosProductos();
    // AQUI ESTABA EL ERROR: Debe ser renderizarCatalogoProductos
    this.vistaCatalogo.renderizarCatalogoProductos(listaProductos);
  }

  /**
   * Alias de compatibilidad si alguna otra parte llama a este método
   */
  cargarYRenderizarCatalogoInicial() {
    this.sincronizarEstadoInicialVista();
  }

  manejadorAgregarProductoAlCarrito(identificadorProducto) {
    const productoASeleccionar = this.modeloCatalogo.obtenerProductoPorIdentificador(identificadorProducto);
    if (productoASeleccionar) {
      this.modeloCarrito.agregarOIncrementarProducto(productoASeleccionar);
    }
  }
}