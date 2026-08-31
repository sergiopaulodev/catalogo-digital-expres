/**
 * Modelo encargado de la gestión de datos e inventario del catálogo de productos.
 */
import { PRODUCTOS_MOCK } from "../data/productosMock.js";
import { instanciadorEventBus } from "../core/EventBus.js";

export class CatalogModel {
  /**
   * Nombre del evento emitido cuando el catálogo de productos sufre actualizaciones.
   */
  static EVENTO_CATALOGO_ACTUALIZADO = "catalogo:actualizado";

  constructor() {
    this.listaDeProductos = PRODUCTOS_MOCK;
  }

  /**
   * Retorna una copia de la lista completa de productos disponibles en el catálogo.
   * @returns {Array<Object>} Lista de productos.
   */
  obtenerTodosLosProductos() {
    return [...this.listaDeProductos];
  }

  /**
   * Busca y retorna un producto específico por su identificador único.
   * @param {number} identificadorProducto - ID del producto a localizar.
   * @returns {Object|undefined} Datos del producto encontrado o undefined.
   */
  obtenerProductoPorIdentificador(identificadorProducto) {
    const identificadorNumerico = Number(identificadorProducto);
    return this.listaDeProductos.find(
      (producto) => producto.identificadorProducto === identificadorNumerico
    );
  }

  /**
   * Permite actualizar dinámicamente la lista de productos y notificar los cambios.
   * @param {Array<Object>} nuevaListaDeProductos - Nueva colección de productos.
   */
  actualizarListaDeProductos(nuevaListaDeProductos) {
    if (Array.isArray(nuevaListaDeProductos)) {
      this.listaDeProductos = nuevaListaDeProductos;
      instanciadorEventBus.emitir(
        CatalogModel.EVENTO_CATALOGO_ACTUALIZADO,
        this.obtenerTodosLosProductos()
      );
    }
  }
}