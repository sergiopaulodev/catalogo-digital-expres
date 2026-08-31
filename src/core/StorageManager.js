/**
 * Servicio envoltorio (wrapper) para la gestión segura de almacenamiento en localStorage.
 */
export class StorageManager {
  /**
   * Obtiene y parsea un valor almacenado en localStorage.
   * @param {string} claveAlmacenamiento - Nombre de la clave a consultar.
   * @param {*} [valorPorDefecto=null] - Valor retornado si la clave no existe o falla el parseo.
   * @returns {*} Datos parseados o el valor por defecto.
   */
  static obtener(claveAlmacenamiento, valorPorDefecto = null) {
    if (!claveAlmacenamiento || typeof claveAlmacenamiento !== "string") {
      console.error("StorageManager: La clave de almacenamiento debe ser un texto válido.");
      return valorPorDefecto;
    }

    try {
      const datosObtenidos = localStorage.getItem(claveAlmacenamiento);
      if (datosObtenidos === null) {
        return valorPorDefecto;
      }
      return JSON.parse(datosObtenidos);
    } catch (errorDeLectura) {
      console.error(`StorageManager: Error al leer la clave "${claveAlmacenamiento}":`, errorDeLectura);
      return valorPorDefecto;
    }
  }

  /**
   * Serializa y guarda un valor en localStorage.
   * @param {string} claveAlmacenamiento - Nombre de la clave a guardar.
   * @param {*} valorAGuardar - Datos a guardar (objeto, arreglo, string, etc.).
   * @returns {boolean} Indica si la operación fue exitosa.
   */
  static guardar(claveAlmacenamiento, valorAGuardar) {
    if (!claveAlmacenamiento || typeof claveAlmacenamiento !== "string") {
      console.error("StorageManager: La clave de almacenamiento debe ser un texto válido.");
      return false;
    }

    try {
      const datosSerializados = JSON.stringify(valorAGuardar);
      localStorage.setItem(claveAlmacenamiento, datosSerializados);
      return true;
    } catch (errorDeEscritura) {
      console.error(`StorageManager: Error al guardar la clave "${claveAlmacenamiento}":`, errorDeEscritura);
      return false;
    }
  }

  /**
   * Remueve una clave específica de localStorage.
   * @param {string} claveAlmacenamiento - Nombre de la clave a eliminar.
   */
  static eliminar(claveAlmacenamiento) {
    if (!claveAlmacenamiento || typeof claveAlmacenamiento !== "string") {
      console.error("StorageManager: La clave de almacenamiento debe ser un texto válido.");
      return;
    }
    localStorage.removeItem(claveAlmacenamiento);
  }
}