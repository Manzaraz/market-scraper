const puppeteer = require("puppeteer");
const ExcelJS = require("exceljs");
const randomUserAgent = require("random-useragent");

const saveExcel = (data) => {
  const workBook = new ExcelJS.Workbook();
  const fileName = "macbooks-list.xlsx";

  const sheet = workBook.addWorksheet(`Resultados`);
  const reColumns = [
    { header: "Nombre", key: "name" },
    { header: "Precio", key: "price" },
    { header: "Imagem", key: "image" },
  ];
  sheet.columns = reColumns;

  sheet.addRows(data);
  workBook.xlsx
    .writeFile(fileName)
    .then((e) => console.log({ messager: "successfuly created" }))
    .catch((err) =>
      console.error({ message: "something happened saving excel file" })
    );
};

const init = async () => {
  const header = randomUserAgent.getRandom();
  // const header = randomUserAgent.getRandom((ua) => {
  // return ua.browserName === "Firefox";
  // });

  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.setUserAgent(header);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto("https://listado.mercadolibre.com.ar/iphone#D[A:iphone]");
  // await page.goto("https://tupedido.carrefour.com.ar/maxi/index.php"); // este es el target
  await page.screenshot({ path: "example.png" });
  // await browser.close();
  await page.waitForSelector(".ui-search-results");

  const listItems = await page.$$(".ui-search-layout__item");

  let data = [];

  for (const item of listItems) {
    const objPrice = await item.$(".price-tag-fraction");
    const name = await item.$(".ui-search-item__title");
    const image = await item.$(".ui-search-result-image__element");

    const getPrice = await page.evaluate(
      (objPrice) => objPrice.innerText,
      objPrice
    );
    const getName = await page.evaluate((name) => name.innerText, name);
    const getImage = await page.evaluate(
      (image) => image.getAttribute("src"),
      image
    );

    // console.log(`${getName} --- ${getPrice} --- ${getImage}`);
    data.push({
      name: getName,
      price: getPrice,
      image: getImage,
    });
  }

  await browser.close();

  saveExcel(data);
};

init();
