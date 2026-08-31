/**
 * Controlador encargado de coordinar la lógica entre CatalogModel, CartModel y CatalogView.
 */
import { instanciadorEventBus } from "../core/EventBus.js";
import { CatalogModel } from "../models/CatalogModel.js";

export class CatalogController {
  /**
   * Inicializa el controlador enlazando el modelo, el modelo del carrito y la vista.
   * @param {CatalogModel} instanciadorCatalogModel - Instancia del modelo de catálogo.
   * @param {CartModel} instanciadorCartModel - Instancia del modelo de carrito.
   * @param {CatalogView} instanciadorCatalogView - Instancia de la vista del catálogo.
   */
  constructor(
    instanciadorCatalogModel,
    instanciadorCartModel,
    instanciadorCatalogView
  ) {
    if (
      !instanciadorCatalogModel ||
      !instanciadorCartModel ||
      !instanciadorCatalogView
    ) {
      throw new Error("CatalogController: Se requieren dependencias válidas en el constructor.");
    }

    this.modeloCatalogo = instanciadorCatalogModel;
    this.modeloCarrito = instanciadorCartModel;
    this.vistaCatalogo = instanciadorCatalogView;

    this.inicializarEscuchadores();
    this.cargarYRenderizarCatalogoInicial();
  }

  /**
   * Suscribe el controlador a los eventos de la UI y del EventBus.
   */
  inicializarEscuchadores() {
    // Escuchar acción de agregar al carrito desde la vista
    this.vistaCatalogo.asociarEventoAgregarAlCarrito((identificadorProducto) => {
      this.manejadorAgregarProductoAlCarrito(identificadorProducto);
    });

    // Escuchar cuando el catálogo se actualice desde el modelo (Event-Driven)
    instanciadorEventBus.suscribir(
      CatalogModel.EVENTO_CATALOGO_ACTUALIZADO,
      (datosEvento) => {
        this.vistaCatalogo.renderizarCatalogo(datosEvento.listaDeProductosActualizada);
      }
    );
  }

  /**
   * Carga la lista inicial de productos y la envía a renderizar.
   */
  cargarYRenderizarCatalogoInicial() {
    const listaDeProductos = this.modeloCatalogo.obtenerTodosLosProductos();
    this.vistaCatalogo.renderizarCatalogo(listaDeProductos);
  }

  /**
   * Procesa la adición de un producto seleccionado hacia el modelo del carrito.
   * @param {number} identificadorProducto - ID del producto seleccionado.
   */
  manejadorAgregarProductoAlCarrito(identificadorProducto) {
    const productoSeleccionado = this.modeloCatalogo.obtenerProductoPorIdentificador(
      identificadorProducto
    );

    if (productoSeleccionado) {
      this.modeloCarrito.agregarOIncrementarProducto(productoSeleccionado, 1);
    } else {
      console.error(
        `CatalogController: No se encontró el producto con ID ${identificadorProducto}.`
      );
    }
  }
}