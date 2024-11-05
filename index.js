import puppeteer from 'puppeteer';


// function to get time in ISO8601 format
const getFormattedTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}:${hours}:${minutes}:${seconds}`;
};


//querryin hidden apis -> https://www.youtube.com/watch?v=DqtlR0y0suo
// Define the function to fetch travel data from Deutsche Bahn's API
async function fetchTravelData() {
    try {
      const response = await fetch("https://www.bahn.de/web/api/angebote/fahrplan", {
        headers: {
          "accept": "application/json",
          "accept-language": "de",
          "content-type": "application/json; charset=UTF-8",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-correlation-id": "e20f6f24-26be-4964-9f26-dd4c7f36152e_164ab49f-27ec-453e-b6f4-b4049d08a4a4",
          // The cookie string is often unique to a session, be cautious about including it for each request
          "cookie": "request_consent_v=3; sg=10; s_ecid=MCMID%7C66063866005461138354467818398380990804; CONSENTMGR=...",
          "Referer": "https://www.bahn.de/buchung/fahrplan/suche",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: JSON.stringify({
          abfahrtsHalt: "A=2@O=Mainz, Tanzplatz@X=8303237@Y=49982469@U=92@b=980807836@B=1@p=1706613073@",
          anfrageZeitpunkt: "2024-11-05T19:39:46",
          ankunftsHalt: "A=1@O=Holzturm/Malakoff-Passage, Mainz@X=8278589@Y=49996681@U=80@L=129117@B=1@p=1730325184@",
          ankunftSuche: "ABFAHRT",
          klasse: "KLASSE_2",
          produktgattungen: ["ICE", "EC_IC", "IR", "REGIONAL", "SBAHN", "BUS", "SCHIFF", "UBAHN", "TRAM", "ANRUFPFLICHTIG"],
          reisende: [{
            typ: "ERWACHSENER",
            ermaessigungen: [{ art: "KEINE_ERMAESSIGUNG", klasse: "KLASSENLOS" }],
            alter: [],
            anzahl: 1
          }],
          schnelleVerbindungen: true,
          sitzplatzOnly: false,
          bikeCarriage: false,
          reservierungsKontingenteVorhanden: false,
          nurDeutschlandTicketVerbindungen: false
        }),
        method: "POST"
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      // Parse JSON response
      const data = await response.json();
      console.log('Travel data:', data);
  
      // Process and use the data as needed
      // Example: displaying specific details in the console or on your webpage
  
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  // Call the function
//fetchTravelData();
  

(async () => {

    const now = new Date().getTime()

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    const timestamp = getFormattedTimestamp();

    try{

        await page.goto(`https://www.bahn.de/buchung/fahrplan/suche#sts=true&so=Mainz%2C%20Tanzplatz&zo=Holzturm%2FMalakoff-Passage%2C%20Mainz&kl=2&r=13:16:KLASSENLOS:1&soid=A%3D2%40O%3DMainz%2C%20Tanzplatz%40X%3D8303237%40Y%3D49982469%40U%3D92%40b%3D980807836%40B%3D1%40p%3D1706613073%40&zoid=A%3D1%40O%3DHolzturm%2FMalakoff-Passage%2C%20Mainz%40X%3D8278589%40Y%3D49996681%40U%3D80%40L%3D129117%40B%3D1%40p%3D1730325184%40&sot=ADR&zot=ST&zoei=129117&hd=${timestamp}&hza=D&hz=%5B%5D&ar=false&s=true&d=false&vm=00,01,02,03,04,05,06,07,08,09&fm=false&bp=false&dlt=false`);

    } catch(error){

        console.log("failed to load site")
    }
    


    await page.setViewport({width: 1080, height: 1024});

    // Runs the `//h2` as the XPath expression.
    // wait for selector: waits till the element is available in DOM
    const element = await page.waitForSelector('::-p-xpath(//*[@id="ReiseloesungList"]/div[3]/div[1]/div[1]/ul/li[1]/div/div/div/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/time)');
    
    //takes selector element, returns text context
    const textContent = await page.evaluate(el => el.textContent, element);
    console.log(textContent);


    //https://www.youtube.com/watch?v=lgyszZhAZOI
    //evaluate function takes any function and evaluates it
    const names = await page.evaluate(() => {
        //document. querySelectorAll takes css selector, returns node list of elements
        //the array entries are mapped to value, their text ist returned
        return Array.from(document.querySelectorAll("#ReiseloesungList > div.loading-indicator > div.reiseloesung-list-page__wrapper > div:nth-child(2) > ul > li.verbindung-list__result-item.verbindung-list__result-item--1 > div > div > div > div.reiseplan.reiseloesung__reiseplan > div.reiseplan__uebersicht > div.reiseplan__infos > div.reiseplan__zeiten > div.reiseplan__uebersicht-uhrzeit > div.reiseplan__uebersicht-uhrzeit-von > span.reiseplan__uebersicht-uhrzeit-echtzeit > time")).map(x => x.textContent)

    })

    console.log(names[0]);




    //await browser.close();




})();