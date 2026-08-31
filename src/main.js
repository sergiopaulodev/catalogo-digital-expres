/**
 * Punto de entrada principal de la aplicación SPA Catálogo Digital Express.
 */
import { CatalogModel } from "./models/CatalogModel.js";
import { CartModel } from "./models/CartModel.js";
import { CatalogView } from "./views/CatalogView.js";
import { CatalogController } from "./controllers/CatalogController.js";
import { instanciadorEventBus } from "./core/EventBus.js";

// 1. Inicializar modelos
const modeloCatalogo = new CatalogModel();
const modeloCarrito = new CartModel();

// 2. Inicializar vistas
const vistaCatalogo = new CatalogView("seccionCatalogoProductos");

// 3. Inicializar controladores
const controladorCatalogo = new CatalogController(
  modeloCatalogo,
  modeloCarrito,
  vistaCatalogo
);

// 4. Suscripción temporal en consola para verificar reactividad del carrito
instanciadorEventBus.suscribir(CartModel.EVENTO_CARRITO_ACTUALIZADO, (datosCarrito) => {
  console.log("¡Evento de carrito recibido en main.js!", datosCarrito);
  
  // Actualizar contador del encabezado
  const contadorElemento = document.getElementById("contadorUnidadesCarritoCompras");
  if (contadorElemento) {
    contadorElemento.textContent = datosCarrito.cantidadTotalDeUnidades;
  }
});