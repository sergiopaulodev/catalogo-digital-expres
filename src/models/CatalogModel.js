/**
 * Modelo encargado de la lógica de negocio y persistencia del catálogo de productos.
 */
import { StorageManager } from "../core/StorageManager.js";
import { instanciadorEventBus } from "../core/EventBus.js";

export class CatalogModel {
  static CLAVE_LOCALSTORAGE_CATALOGO = "CATALOGO_EXPRESS_PRODUCTOS_INVENTARIO";
  static EVENTO_CATALOGO_ACTUALIZADO = "catalogo:actualizado";

  constructor() {
    this.listaDeProductos = this.cargarProductosDesdeAlmacenamiento();
  }

  /**
   * Carga los productos desde el almacenamiento local o inicializa con datos sembrados.
   * @returns {Array<Object>} Lista de productos.
   */
  cargarProductosDesdeAlmacenamiento() {
    const productosObtenidos = StorageManager.obtener(
      CatalogModel.CLAVE_LOCALSTORAGE_CATALOGO,
      null
    );

    if (productosObtenidos === null) {
      const listaDeProductosSemilla = [
        {
          identificadorProducto: 1716940800000,
          nombreProducto: "Taza de cerámica artesanal",
          precioProductoEnPesos: 1500.0,
          imagenProductoUrl: "https://picsum.photos/300/200?random=1",
          estaDisponibleParaVenta: true
        },
        {
          identificadorProducto: 1716940800001,
          nombreProducto: "Café de especialidad 250g",
          precioProductoEnPesos: 4500.0,
          imagenProductoUrl: "https://picsum.photos/300/200?random=2",
          estaDisponibleParaVenta: true
        }
      ];

      StorageManager.guardar(
        CatalogModel.CLAVE_LOCALSTORAGE_CATALOGO,
        listaDeProductosSemilla
      );
      return listaDeProductosSemilla;
    }

    return productosObtenidos;
  }

  /**
   * Obtiene la lista completa de productos.
   * @returns {Array<Object>} Copia de la lista de productos.
   */
  obtenerTodosLosProductos() {
    return [...this.listaDeProductos];
  }

  /**
   * Obtiene un producto específico según su identificador único.
   * @param {number} identificadorProducto - ID del producto a buscar.
   * @returns {Object|null} Objeto del producto encontrado o null.
   */
  obtenerProductoPorIdentificador(identificadorProducto) {
    if (!identificadorProducto) {
      console.error("CatalogModel: Se requiere un identificador válido.");
      return null;
    }

    const productoEncontrado = this.listaDeProductos.find(
      (producto) => producto.identificadorProducto === identificadorProducto
    );

    return productoEncontrado ? { ...productoEncontrado } : null;
  }

  /**
   * Agrega un nuevo producto al catálogo y emite la actualización.
   * @param {Object} datosNuevoProducto - Información del producto a crear.
   * @returns {boolean} Indica si el alta fue exitosa.
   */
  agregarProducto(datosNuevoProducto) {
    if (
      !datosNuevoProducto.nombreProducto ||
      typeof datosNuevoProducto.precioProductoEnPesos !== "number" ||
      datosNuevoProducto.precioProductoEnPesos <= 0
    ) {
      console.error("CatalogModel: Datos de producto inválidos para el alta.");
      return false;
    }

    const nuevoProducto = {
      identificadorProducto: Date.now(),
      nombreProducto: datosNuevoProducto.nombreProducto.trim(),
      precioProductoEnPesos: datosNuevoProducto.precioProductoEnPesos,
      imagenProductoUrl:
        datosNuevoProducto.imagenProductoUrl || "https://picsum.photos/300/200",
      estaDisponibleParaVenta:
        typeof datosNuevoProducto.estaDisponibleParaVenta === "boolean"
          ? datosNuevoProducto.estaDisponibleParaVenta
          : true
    };

    this.listaDeProductos.push(nuevoProducto);
    this.persistirYNotificarCambios();
    return true;
  }

  /**
   * Elimina un producto por su identificador.
   * @param {number} identificadorProducto - ID del producto a remover.
   * @returns {boolean} Indica si se eliminó el producto.
   */
  eliminarProducto(identificadorProducto) {
    const longitudInicial = this.listaDeProductos.length;
    this.listaDeProductos = this.listaDeProductos.filter(
      (producto) => producto.identificadorProducto !== identificadorProducto
    );

    if (this.listaDeProductos.length < longitudInicial) {
      this.persistirYNotificarCambios();
      return true;
    }

    return false;
  }

  /**
   * Guarda los cambios en almacenamiento y notifica a los suscriptores.
   */
  persistirYNotificarCambios() {
    StorageManager.guardar(
      CatalogModel.CLAVE_LOCALSTORAGE_CATALOGO,
      this.listaDeProductos
    );

    instanciadorEventBus.emitir(CatalogModel.EVENTO_CATALOGO_ACTUALIZADO, {
      listaDeProductosActualizada: this.obtenerTodosLosProductos()
    });
  }
}