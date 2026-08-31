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
  // 1. Instanciar Modelos
  const modeloCatalogo = new CatalogModel();
  const modeloCarrito = new CartModel();

  // 2. Instanciar Vistas
  const vistaCatalogo = new CatalogView("seccionCatalogoProductos");
  const vistaCarrito = new CartView(
    "botonAbrirCarritoCompras",
    "contadorUnidadesCarritoCompras"
  );

  // 3. Instanciar Controladores (Se ejecutan los efectos secundarios del constructor)
  new CatalogController(modeloCatalogo, modeloCarrito, vistaCatalogo);
  new CartController(modeloCarrito, vistaCarrito);
});