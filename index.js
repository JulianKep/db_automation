import puppeteer from 'puppeteer';


(async () => {

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();


    await page.goto('https://www.bahn.de/buchung/fahrplan/suche#sts=true&so=Mainz%2C%20Tanzplatz&zo=Holzturm%2FMalakoff-Passage%2C%20Mainz&kl=2&r=13:16:KLASSENLOS:1&soid=A%3D2%40O%3DMainz%2C%20Tanzplatz%40X%3D8303237%40Y%3D49982469%40U%3D92%40b%3D980807836%40B%3D1%40p%3D1706613073%40&zoid=A%3D1%40O%3DHolzturm%2FMalakoff-Passage%2C%20Mainz%40X%3D8278589%40Y%3D49996681%40U%3D80%40L%3D129117%40B%3D1%40p%3D1730325184%40&sot=ADR&zot=ST&zoei=129117&hd=2024-11-05T14:09:15&hza=D&hz=%5B%5D&ar=false&s=true&d=false&vm=00,01,02,03,04,05,06,07,08,09&fm=false&bp=false&dlt=false');


    await page.setViewport({width: 1080, height: 1024});

    // Runs the `//h2` as the XPath expression.
    // wait for selector: waits till the element is available in DOM
    const element = await page.waitForSelector('::-p-xpath(//*[@id="ReiseloesungList"]/div[3]/div[1]/div[1]/ul/li[1]/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/time)');
    
    //takes selector element, returns text context
    const textContent = await page.evaluate(el => el.textContent, element);

    const element2 = await page.waitForSelector('div.loading-indicator > div.reiseloesung-list-page__wrapper > div:nth-child(2) > ul > li.verbindung-list__result-item.verbindung-list__result-item--1 > div > div > div > div.reiseplan.reiseloesung__reiseplan > div.reiseplan__uebersicht > div.reiseplan__infos > div.reiseplan__zeiten > div.reiseplan__uebersicht-uhrzeit > div.reiseplan__uebersicht-uhrzeit-von > span.reiseplan__uebersicht-uhrzeit-echtzeit > time._echtzeit_echtzeit--puenktlich')
    const textContent2 = await page.evaluate(el => el.textContent, element2);



    console.log(textContent);
    console.log(textContent2)
})();