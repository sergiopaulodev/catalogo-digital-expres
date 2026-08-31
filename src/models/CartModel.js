/**
 * Modelo encargado de la lógica de negocio y persistencia del carrito de compras.
 */
import { StorageManager } from "../core/StorageManager.js";
import { instanciadorEventBus } from "../core/EventBus.js";

export class CartModel {
  static CLAVE_LOCALSTORAGE_CARRITO = "CATALOGO_EXPRESS_CARRITO_COMPRAS";
  static EVENTO_CARRITO_ACTUALIZADO = "carrito:actualizado";

  constructor() {
    this.listaDeItemsEnCarrito = this.cargarCarritoDesdeAlmacenamiento();
  }

  /**
   * Carga los ítems guardados en localStorage.
   * @returns {Array<Object>} Lista de ítems en el carrito.
   */
  cargarCarritoDesdeAlmacenamiento() {
    return StorageManager.obtener(
      CartModel.CLAVE_LOCALSTORAGE_CARRITO,
      []
    );
  }

  /**
   * Obtiene una copia de los ítems en el carrito.
   * @returns {Array<Object>} Lista de ítems.
   */
  obtenerItemsDelCarrito() {
    return [...this.listaDeItemsEnCarrito];
  }

  /**
   * Agrega un producto al carrito o incrementa su cantidad si ya existe.
   * @param {Object} productoASeleccionar - Datos del producto a incorporar.
   * @param {number} [cantidadAIncrementar=1] - Cantidad de unidades a sumar.
   */
  agregarOIncrementarProducto(productoASeleccionar, cantidadAIncrementar = 1) {
    if (
      !productoASeleccionar ||
      !productoASeleccionar.identificadorProducto ||
      typeof productoASeleccionar.precioProductoEnPesos !== "number"
    ) {
      console.error("CartModel: Estructura de producto inválida.");
      return;
    }

    const indiceItemExistente = this.listaDeItemsEnCarrito.findIndex(
      (itemCarrito) =>
        itemCarrito.identificadorProducto === productoASeleccionar.identificadorProducto
    );

    if (indiceItemExistente !== -1) {
      this.listaDeItemsEnCarrito[indiceItemExistente].cantidadUnidadesSeleccionadas +=
        cantidadAIncrementar;
    } else {
      this.listaDeItemsEnCarrito.push({
        identificadorProducto: productoASeleccionar.identificadorProducto,
        nombreProducto: productoASeleccionar.nombreProducto,
        cantidadUnidadesSeleccionadas: cantidadAIncrementar,
        precioUnitarioEnPesos: productoASeleccionar.precioProductoEnPesos
      });
    }

    this.persistirYNotificarCambios();
  }

  /**
   * Remueve completamente un ítem del carrito por su ID.
   * @param {number} identificadorProducto - ID del producto a eliminar.
   */
  eliminarItemPorIdentificador(identificadorProducto) {
    this.listaDeItemsEnCarrito = this.listaDeItemsEnCarrito.filter(
      (itemCarrito) => itemCarrito.identificadorProducto !== identificadorProducto
    );

    this.persistirYNotificarCambios();
  }

  /**
   * Vacía totalmente el carrito de compras.
   */
  vaciarCarrito() {
    this.listaDeItemsEnCarrito = [];
    this.persistirYNotificarCambios();
  }

  /**
   * Calcula el total acumulado en pesos de la compra.
   * @returns {number} Monto total en pesos.
   */
  calcularMontoTotalEnPesos() {
    return this.listaDeItemsEnCarrito.reduce(
      (acumuladorMontoTotal, itemActual) =>
        acumuladorMontoTotal +
        itemActual.cantidadUnidadesSeleccionadas * itemActual.precioUnitarioEnPesos,
      0
    );
  }

  /**
   * Calcula la cantidad total de unidades seleccionadas.
   * @returns {number} Total de unidades.
   */
  obtenerCantidadTotalDeUnidades() {
    return this.listaDeItemsEnCarrito.reduce(
      (acumuladorUnidades, itemActual) =>
        acumuladorUnidades + itemActual.cantidadUnidadesSeleccionadas,
      0
    );
  }

  /**
   * Guarda los cambios y emite la actualización reactiva.
   */
  persistirYNotificarCambios() {
    StorageManager.guardar(
      CartModel.CLAVE_LOCALSTORAGE_CARRITO,
      this.listaDeItemsEnCarrito
    );

    instanciadorEventBus.emitir(CartModel.EVENTO_CARRITO_ACTUALIZADO, {
      listaDeItemsActualizada: this.obtenerItemsDelCarrito(),
      montoTotalEnPesos: this.calcularMontoTotalEnPesos(),
      cantidadTotalDeUnidades: this.obtenerCantidadTotalDeUnidades()
    });
  }
}