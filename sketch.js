

let myMap;
const mappa = new Mappa('Leaflet');
// Lets put all our map options in a single object
const options = {
  lat: 20,
  lng: 0,
  zoom: 1,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}


//DATA
let countries;
//Added: gg, im, je, pn, xk, bl, mf, ss, tl

let summary_raw;
let summary = [];
let world_total;
let country_info;
let world_info;

function preload() {
  // Get the most recent earthquake in the database
  let url_summary = 'https://api.covid19api.com/summary';
  summary_raw = loadJSON(url_summary);
  countries = loadJSON('countries.json');
  world_total = loadJSON('https://api.covid19api.com/world/total');
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function setup() {

  var canvas = createCanvas(500, 300);
  //canvas.parent('for_canvas');
  
  // Create a tile map
  myMap = mappa.tileMap(options);
  // Overlay the canvas over the tile map
  myMap.overlay(canvas);

  for (let c of summary_raw.Countries) {
    let c_name = c.Country;
    let cc = c.CountryCode.toLowerCase();
    let ll = countries[cc];
    let lat = ll[0];
    let lon = ll[1];
    let tr = c.TotalRecovered;
    let td = c.TotalDeaths;
    let tc = c.TotalConfirmed;

    let trd = sqrt(tr + td) / 10;
    let tdd = sqrt(td) / 10;
    let tcd = sqrt(tc) / 10;
    
    let trs = formatNumber(tr);
    let tds = formatNumber(td);
    let tcs = formatNumber(tc);

    summary.push({
      c_name,
      cc,
      lat,
      lon,
      trd,
      tdd,
      tcd,
      trs,
      tds,
      tcs
    });
  }
  
  world_info = select('#world_info');
  country_info = select('#country_info');
  
  var wi1 = createSpan(formatNumber(world_total.TotalConfirmed));
  var wi2 = createSpan(formatNumber(world_total.TotalRecovered));
  var wi3 = createSpan(formatNumber(world_total.TotalDeaths));
  wi1.class('badge badge-pill badge-primary');  
  wi2.class('badge badge-pill badge-success');
  wi3.class('badge badge-pill badge-danger');
  wi1.parent('world_info');
  wi2.parent('world_info');
  wi3.parent('world_info');
}

function draw() {
  clear();
  var dist_closest = 1000;
  for (let c of summary) {

    const cp = myMap.latLngToPixel(c.lat, c.lon);
    let z = myMap.zoom();

    let rd = c.trd * z;
    let dd = c.tdd * z;
    let cd = c.tcd * z;

    fill(0, 0, 255, 200);
    ellipse(cp.x, cp.y, cd * sin(frameCount * 0.05));

    fill(0, 255, 0, 200);
    ellipse(cp.x, cp.y, rd * sin(frameCount * 0.05));

    fill(255, 0, 0, 200);
    ellipse(cp.x, cp.y, dd * sin(frameCount * 0.05));
    
    var this_dist = dist(mouseX, mouseY, cp.x, cp.y);
    
    if(this_dist < dist_closest) {
      country_info.html('');
      dist_closest = this_dist;
      var ci0 = createSpan(c.c_name+': ');
      
      
      var ci1 = createSpan(c.tcs);
      var ci2 = createSpan(c.trs);
      var ci3 = createSpan(c.tds);
      ci1.class('badge badge-pill badge-primary');  
      ci2.class('badge badge-pill badge-success');
      ci3.class('badge badge-pill badge-danger');
      
      ci0.parent('country_info');
      ci1.parent('country_info');
      ci2.parent('country_info');
      ci3.parent('country_info');
    }
  }

  //Legend
  /*
  let x = width - 100;
  let y = height - 55;
  fill(0, 0, 255, 200);
  ellipse(x, y, 100);

  fill(0, 255, 0, 200);
  ellipse(x, y, 50);

  fill(255, 0, 0, 200);
  ellipse(x, y, 25);
  fill('black');
  text("Confirmed", x, y-30);
  text("Recovered", x, y-15);
  text("Deaths", x, y);
  */
}

