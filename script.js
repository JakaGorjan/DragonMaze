// ==============================
// 1. PRIPRAVA CANVAS
// ==============================

// Poiščemo canvas v HTML dokumentu
const canvas = document.getElementById("canvas");

// ctx omogoča risanje na canvas
const ctx = canvas.getContext("2d");

// Poiščemo napis na vrhu strani
const hint = document.getElementById("hint");


// ==============================
// 2. NALAGANJE SLIKE
// ==============================

// Naložimo sliko labirinta
const bg = new Image();
bg.src = "img/maze_bg_blur.png";


// ==============================
// 3. POMEMBNE TOČKE
// ==============================

// Položaj zmajevih ust
const dragon = { x: 1240, y: 330 };

// Položaj sena na koncu
const hay = { x: 1240, y: 2350 };


// ==============================
// 4. POT OGNJA
// ==============================

// Seznam točk, po katerih se bo premikal ogenj
const path = [
  {x:1240,y:330},
  {x:1265,y:408},
  {x:1270,y:499},
  {x:1270,y:617},
  {x:1317,y:727},
  {x:1494,y:727},
  {x:1538,y:755},
  {x:1540,y:813},
  {x:1659,y:818},
  {x:1750,y:824},
  {x:1750,y:912},
  {x:1753,y:1000},
  {x:1843,y:1006},
  {x:1849,y:1099},
  {x:1755,y:1099},
  {x:1659,y:1097},
  {x:1582,y:1122},
  {x:1582,y:1215},
  {x:1579,y:1270},
  {x:1488,y:1276},
  {x:1482,y:1223},
  {x:1438,y:1190},
  {x:1353,y:1190},
  {x:1270,y:1190},
  {x:1273,y:1276},
  {x:1268,y:1347},
  {x:1221,y:1367},
  {x:1157,y:1367},
  {x:1160,y:1447},
  {x:1091,y:1460},
  {x:1053,y:1458},
  {x:1053,y:1372},
  {x:962,y:1370},
  {x:876,y:1372},
  {x:788,y:1370},
  {x:758,y:1342},
  {x:758,y:1276},
  {x:675,y:1276},
  {x:642,y:1309},
  {x:639,y:1364},
  {x:570,y:1370},
  {x:537,y:1414},
  {x:540,y:1458},
  {x:661,y:1463},
  {x:805,y:1460},
  {x:948,y:1463},
  {x:959,y:1538},
  {x:1031,y:1551},
  {x:1055,y:1598},
  {x:1053,y:1637},
  {x:1110,y:1648},
  {x:1160,y:1651},
  {x:1160,y:1753},
  {x:1163,y:1854},
  {x:1170,y:2085},
  {x:1240,y:2350}
];


// ==============================
// 5. SPREMENLJIVKE ZA ANIMACIJO
// ==============================

// running pove, ali ogenj trenutno teče po poti
let running = false;

// progress pove, kako daleč po poti je ogenj
let progress = 0;

// speed določa hitrost gibanja
let speed = 0.02;

// endFire pove, ali je ogenj že prišel do sena
let endFire = false;


// ==============================
// 6. FUNKCIJA ZA RISANJE OGNJA
// ==============================

// Nariše emoji ogenj na določeno mesto
function drawFlame(x, y, size) {
  ctx.font = size + 'px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔥', x, y);
}


// ==============================
// 7. GLAVNA ANIMACIJA
// ==============================

function animate() {
  // Vedno najprej narišemo ozadje
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Če animacija teče, premikamo ogenj
  if (running) {
    progress += speed;

    let i = Math.floor(progress);

    // Če še nismo na koncu poti
    if (i < path.length - 1) {
      let p1 = path[i];
      let p2 = path[i + 1];

      // t poskrbi za gladko premikanje med točkama
      let t = progress - i;

      let x = p1.x + (p2.x - p1.x) * t;
      let y = p1.y + (p2.y - p1.y) * t;

      drawFlame(x, y, 40);
    } else {
      // Ko ogenj pride do konca, ustavimo gibanje
      running = false;
      endFire = true;
    }
  } else {
    // Če animacija še ne teče in še ni končana,
    // pokažemo mali ogenj pri zmaju
    if (!endFire) {
      drawFlame(dragon.x, dragon.y, 40);
    }
  }

  // Ko je ogenj na vozu, narišemo večji ogenj
  if (endFire) {
    // Utripanje velikosti za lepši efekt
    let bigSize = 90 + Math.sin(Date.now() / 250) * 8;
    drawFlame(hay.x, hay.y, bigSize);
  }

  requestAnimationFrame(animate);
}


// ==============================
// 8. KLIK NA ZMAJA
// ==============================

// Ko uporabnik klikne na canvas
canvas.addEventListener("click", function(e) {
  let rect = canvas.getBoundingClientRect();

  // Preračun položaja klika glede na velikost canvasa
  let x = (e.clientX - rect.left) * (canvas.width / rect.width);
  let y = (e.clientY - rect.top) * (canvas.height / rect.height);

  // Izračun razdalje do zmajevih ust
  let dx = x - dragon.x;
  let dy = y - dragon.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // Če kliknemo blizu zmaja, zaženemo ali ponovno zaženemo animacijo
  if (distance < 40) {
    progress = 0;
    running = true;
    endFire = false;
    hint.style.display = "none";
  }
});


// ==============================
// 9. ROKICA NAD ZMAJEM
// ==============================

// Ko premikamo miško, preverimo če je nad zmajem
canvas.addEventListener("mousemove", function(e) {
  let rect = canvas.getBoundingClientRect();

  let x = (e.clientX - rect.left) * (canvas.width / rect.width);
  let y = (e.clientY - rect.top) * (canvas.height / rect.height);

  let dx = x - dragon.x;
  let dy = y - dragon.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // Če je miška nad zmajem, pokažemo rokico
  if (distance < 40) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
});


// ==============================
// 10. PRILAGODITEV CANVASA
// ==============================

// Ko se slika naloži, nastavimo pravo velikost
bg.onload = function() {
  canvas.width = bg.naturalWidth;
  canvas.height = bg.naturalHeight;

  // Slika se prilagodi velikosti zaslona
  let scale = Math.min(
    window.innerWidth / canvas.width,
    window.innerHeight / canvas.height
  );

  canvas.style.width = canvas.width * scale + "px";
  canvas.style.height = canvas.height * scale + "px";

  animate();
};

document.getElementById("aboutBtn").addEventListener("click", function() {
  alert("Author: Jaka Gorjan\n\nThis Dragon Maze project was created as a learning project using HTML, CSS and JavaScript.");
});