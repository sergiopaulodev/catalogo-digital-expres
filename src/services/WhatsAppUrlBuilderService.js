/**
 * Servicio encargado de construir y formatear la URL para el envio de pedidos a WhatsApp.
 */
export class WhatsAppUrlBuilderService {
  /**
   * Construye un enlace formateado hacia la API de WhatsApp con el resumen del carrito.
   * @param {Array<Object>} listaDeItemsEnCarrito - Lista de productos en el carrito.
   * @param {number} montoTotalEnPesos - Suma total de la compra.
   * @param {string} numeroTelefonoDestinatario - Numero telefonico con codigo de pais (sin signos + ni guiones).
   * @returns {string} URL codificada lista para redireccionamiento.
   */
  static construirUrlDePedido(
    listaDeItemsEnCarrito,
    montoTotalEnPesos,
    numeroTelefonoDestinatario = "5492914630483"
  ) {
    if (!Array.isArray(listaDeItemsEnCarrito) || listaDeItemsEnCarrito.length === 0) {
      console.error("WhatsAppUrlBuilderService: El carrito se encuentra vacio.");
      return "";
    }

    let mensajeFormateado = "Hola, me gustaria realizar el siguiente pedido:\n\n";

    listaDeItemsEnCarrito.forEach((itemCarrito) => {
      const subtotalPorItemEnPesos =
        itemCarrito.cantidadUnidadesSeleccionadas * itemCarrito.precioUnitarioEnPesos;

      mensajeFormateado += `• ${itemCarrito.nombreProducto} x${itemCarrito.cantidadUnidadesSeleccionadas} - $${subtotalPorItemEnPesos.toFixed(2)}\n`;
    });

    mensajeFormateado += `\n*Total a pagar: $${montoTotalEnPesos.toFixed(2)}*\n\nMuchas gracias!`;

    const mensajeCodificadoParaUrl = encodeURIComponent(mensajeFormateado);

    return `https://wa.me/${numeroTelefonoDestinatario}?text=${mensajeCodificadoParaUrl}`;
  }
}