/**
 * Controlador encargado de coordinar la lógica entre CartModel y CartView,
 * integrando la notificación de eventos y la comunicación con WhatsApp.
 */
import { instanciadorEventBus } from "../core/EventBus.js";
import { CartModel } from "../models/CartModel.js";

export class CartController {
  /**
   * Inicializa el controlador enlazando el modelo del carrito, la vista y el número de WhatsApp.
   * @param {CartModel} instanciadorCartModel - Instancia del modelo de carrito.
   * @param {CartView} instanciadorCartView - Instancia de la vista del carrito.
   * @param {string} numeroTelefonoWhatsApp - Número telefónico de destino (formato internacional sin signos).
   */
  constructor(
    instanciadorCartModel,
    instanciadorCartView,
    numeroTelefonoWhatsApp = "5492914630483"
  ) {
    if (!instanciadorCartModel || !instanciadorCartView) {
      throw new Error("CartController: Se requieren dependencias válidas en el constructor.");
    }

    this.modeloCarrito = instanciadorCartModel;
    this.vistaCarrito = instanciadorCartView;
    this.numeroTelefonoWhatsApp = numeroTelefonoWhatsApp;

    this.inicializarEscuchadores();
    this.sincronizarEstadoInicialVista();
  }

  /**
   * Suscribe el controlador a los eventos de la UI y del EventBus.
   */
  inicializarEscuchadores() {
    // Escuchar cambios de estado en el carrito desde el EventBus
    instanciadorEventBus.suscribir(
      CartModel.EVENTO_CARRITO_ACTUALIZADO,
      (datosCarrito) => {
        // 
        const listaItems = datosCarrito.listaDeItemsEnCarrito || [];
        const montoTotal = typeof datosCarrito.montoTotalAcumuladoEnPesos === "number" 
          ? datosCarrito.montoTotalAcumuladoEnPesos 
          : 0;
        const totalUnidades = typeof datosCarrito.cantidadTotalDeUnidades === "number" 
          ? datosCarrito.cantidadTotalDeUnidades 
          : 0;

        this.vistaCarrito.renderizarCarrito(
          listaItems,
          montoTotal,
          totalUnidades
        );
      }
    );

    // Escuchar acción de eliminar ítem desde la vista
    this.vistaCarrito.asociarEventoEliminarItem((identificadorProducto) => {
      this.modeloCarrito.eliminarProductoPorIdentificador(identificadorProducto);
    });

    // Escuchar acción de vaciar carrito desde la vista
    this.vistaCarrito.asociarEventoVaciarCarrito(() => {
      this.modeloCarrito.vaciarCarrito();
    });

    // Escuchar acción de checkout por WhatsApp desde la vista
    this.vistaCarrito.asociarEventoEnviarWhatsApp(() => {
      this.manejadorCheckoutWhatsApp();
    });
  }

  /**
   * Carga el estado actual persistido en el modelo y actualiza la vista.
   */
  sincronizarEstadoInicialVista() {
    const resumenEstadoActual = this.modeloCarrito.obtenerResumenActual();
    this.vistaCarrito.renderizarCarrito(
      resumenEstadoActual.listaDeItemsEnCarrito,
      resumenEstadoActual.montoTotalAcumuladoEnPesos,
      resumenEstadoActual.cantidadTotalDeUnidades
    );
  }

  /**
   * Genera el mensaje de texto codificado para la API de WhatsApp y abre la ventana.
   */
  manejadorCheckoutWhatsApp() {
    const resumenEstadoActual = this.modeloCarrito.obtenerResumenActual();

    if (resumenEstadoActual.listaDeItemsEnCarrito.length === 0) return;

    let textoMensaje = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";

    resumenEstadoActual.listaDeItemsEnCarrito.forEach((item) => {
      const subtotalItem =
        item.cantidadUnidadesSeleccionadas * item.precioUnitarioEnPesos;
      textoMensaje += `• ${item.nombreProducto} x${item.cantidadUnidadesSeleccionadas} - $${subtotalItem.toFixed(2)}\n`;
    });

    textoMensaje += `\n*Total a pagar:* $${resumenEstadoActual.montoTotalAcumuladoEnPesos.toFixed(2)}`;

    const mensajeCodificadoParaUrl = encodeURIComponent(textoMensaje);
    const enlaceWhatsApp = `https://wa.me/${this.numeroTelefonoWhatsApp}?text=${mensajeCodificadoParaUrl}`;

    window.open(enlaceWhatsApp, "_blank");
  }
}