/**
 * Bus de eventos desacoplado del sistema basado en EventTarget nativo.
 * Permite emitir y escuchar eventos personalizados a nivel global.
 */
class EventBus {
  /**
   * Crea una instancia del bus utilizando un elemento de destino de eventos.
   */
  constructor() {
    this.busTarget = document.createElement("div");
  }

  /**
   * Suscribe un listener a un evento especifico.
   * @param {string} nombreEvento - Nombre del evento a escuchar.
   * @param {Function} funcionCallback - Funcion ejecutada al recibir el evento.
   */
  suscribir(nombreEvento, funcionCallback) {
    if (!nombreEvento || typeof funcionCallback !== "function") {
      throw new Error("Parámetros inválidos para suscribir al bus de eventos.");
    }

    this.busTarget.addEventListener(nombreEvento, (eventoCustom) => {
      funcionCallback(eventoCustom.detail);
    });
  }

  /**
   * Emite un evento personalizado cargado con datos.
   * @param {string} nombreEvento - Nombre del evento a emitir.
   * @param {Object} [datosDelEvento={}] - Payload enviado a los suscriptores.
   */
  emitir(nombreEvento, datosDelEvento = {}) {
    if (!nombreEvento) {
      throw new Error("Se requiere el nombre del evento para emitir.");
    }

    const eventoPersonalizado = new CustomEvent(nombreEvento, {
      detail: datosDelEvento
    });

    this.busTarget.dispatchEvent(eventoPersonalizado);
  }
}

export const instanciadorEventBus = new EventBus();