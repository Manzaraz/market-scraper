//@ts-check
const { url } = require("inspector");
const { chromium } = require("playwright");

const shops = [
  {
    vendor: "Microsoft",
    url: "https://www.xbox.com/es-es/configure/8WJ714N3RBTL",
    checkStock: async ({ page }) => {},
  },
  {
    vendor: "Game",
    url: "https://www.atajo.com.ar/consolas-xbox-series-x--det--RRT-00002",
    checkStock: async ({ page }) => {
      const content = await page.textContent(".leyendaConStock");
      const price = await page.textContent("#precio");
      return content.includes("Producto con Stock") !== false;
    },
  },
  {
    vendor: "Meli makkasar",
    url: "https://www.mercadolibre.com.ar/microsoft-xbox-series-x-1tb-standard-color-negro/p/MLA16160759?pdp_filters=category:MLA438566#searchVariation=MLA16160759&position=2&search_layout=stack&type=product&tracking_id=967860dd-e72f-4b71-b502-dbdd6aba1f4e",
    checkStock: async ({ page }) => {
      const content = await page.textContent(
        ".ui-pdp-stock-information__title"
      );
      const price = await page.textContent("#precio");
      return content.includes("Stock disponible") !== false;
    },
  },
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  // Create pages, interact with UI elements, assert values

  for (const shop of shops) {
    const { checkStock, vendor, url } = shop;
    const page = await browser.newPage();
    await page.goto(url);
    const hasStock = await shop.checkStock({ page });

    console.log(
      `${vendor}: ${hasStock ? "¡¡¡HAS STOCK🎉!!!" : "Out of stock😔"}`
    );
    await page.screenshot({ path: `screenshoots/${vendor}.png` });
    await page.close();
  }

  await browser.close();
})();
