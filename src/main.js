/**
 * Punto de entrada principal de la aplicación SPA Catálogo Digital Express.
 */
import { CatalogModel } from "./models/CatalogModel.js";
import { CartModel } from "./models/CartModel.js";
import { CatalogView } from "./views/CatalogView.js";
import { CartView } from "./views/CartView.js";
import { CatalogController } from "./controllers/CatalogController.js";
import { CartController } from "./controllers/CartController.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Instanciar Modelos (Gestión de estado y almacenamiento)
  const modeloCatalogo = new CatalogModel();
  const modeloCarrito = new CartModel();

  // 2. Instanciar Vistas (Interfaz de usuario y elementos DOM)
  const vistaCatalogo = new CatalogView("seccionCatalogoProductos");
  const vistaCarrito = new CartView(
    "botonAbrirCarritoCompras",
    "contadorUnidadesCarritoCompras"
  );

  // 3. Instanciar Controladores (Coordinación de flujo y eventos)
  const controladorCatalogo = new CatalogController(
    modeloCatalogo,
    modeloCarrito,
    vistaCatalogo
  );

  const controladorCarrito = new CartController(
    modeloCarrito,
    vistaCarrito,
    "5492910000000" // Reemplazar opcionalmente por tu número de prueba
  );
});