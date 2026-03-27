
// 1. PRIPRAVA CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const hint = document.getElementById("hint");

// 2. NALAGANJE 
const bg = new Image();
bg.src = "img/maze_bg_fire.png";

const fireFrames = [];

for (let i = 1; i <= 11; i++) {
  const img = new Image();
  img.src = `img/sheet/${i}.png`;
  fireFrames.push(img);
}
const torchFire = new Image();
torchFire.src = "img/torchFire.png";

const torchNoFire = new Image();
torchNoFire.src = "img/torchNoFire.png";


// 3. POMEMBNE TOČKE
const dragon = { x: 1240, y: 330 };
const hay = { x: 1240, y: 2350 };

//  BAKELJE
const torches = [
  { x: 1320, y: 650, lit: false },
  { x: 1705, y: 905, lit: false },
  { x: 1545, y: 1200, lit: false },
  { x: 1215, y: 1445, lit: false },
  { x: 835, y: 1300, lit: false },
  { x: 610, y: 1500, lit: false }
];

// 4. POT OGNJA
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


// 5. SPREMENLJIVKE ZA ANIMACIJO

let running = false;
let progress = 0;
let speed = 0.02;
let endFire = false;

let fireFrame = 0;
let fireTick = 0;


// 6. FUNKCIJA ZA RISANJE OGNJA PO POTI

function drawFlame(x, y, size) {
  const img = fireFrames[5];

  ctx.drawImage(
    img,
    x - size / 2,
    y - size / 2,
    size,
    size
  );
}

// 6B. FUNKCIJA ZA RISANJE GOREČEGA VOZA

function drawBurningCart(x, y) {
  fireTick++;

  if (fireTick > 85) {
    fireTick = 0;
    fireFrame = (fireFrame + 1) % fireFrames.length;
  }

  const size = 320;

  ctx.drawImage(
    fireFrames[fireFrame],
    x - size / 2,
    y - size / 2,
    size,
    size
  );
}

// 6C. RISANJE BAKEL
function drawTorch(torch) {
  const torchWidth = 44;
  const torchHeight = 160;

  const img = torch.lit ? torchFire : torchNoFire;

  ctx.drawImage(
    img,
    torch.x - torchWidth / 2,
    torch.y - torchHeight + 20,
    torchWidth,
    torchHeight
  );
}

// 6D. PRIŽIG BAKEL

function lightTorches(fireX, fireY) {
  for (let torch of torches) {
    const dx = fireX - torch.x;
    const dy = fireY - torch.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 85) {
      torch.lit = true;
    }
  }
}


// 7. GLAVNA ANIMACIJA

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Narišemo labirint
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Narišemo vse bakle
  for (let torch of torches) {
    drawTorch(torch);
  }

  // Če animacija teče
  if (running) {
    progress += speed;

    let i = Math.floor(progress);

    if (i < path.length - 1) {
      let p1 = path[i];
      let p2 = path[i + 1];

      let t = progress - i;

      let x = p1.x + (p2.x - p1.x) * t;
      let y = p1.y + (p2.y - p1.y) * t;

      drawFlame(x, y, 90);
      lightTorches(x, y);
    } else {
      running = false;
      endFire = true;
      hint.style.display = "block";
      hint.innerText = "Klikni zmaja za ponovni zagon";
    }
  } else {
    if (!endFire) {
      drawFlame(dragon.x, dragon.y, 90);
    }
  }

  // Ko pride ogenj do voza, se zažene animacija slik
  if (endFire) {
    drawBurningCart(hay.x, hay.y - 40);
  }

  requestAnimationFrame(animate);
}


// 8. KLIK NA ZMAJA

canvas.addEventListener("click", function(e) {
  let rect = canvas.getBoundingClientRect();

  let x = (e.clientX - rect.left) * (canvas.width / rect.width);
  let y = (e.clientY - rect.top) * (canvas.height / rect.height);

  let dx = x - dragon.x;
  let dy = y - dragon.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 40) {
    progress = 0;
    running = true;
    endFire = false;
    fireFrame = 0;
    fireTick = 0;

    for (let torch of torches) {
      torch.lit = false;
    }

    hint.style.display = "none";
  }
});


// 9. ROKICA NAD ZMAJEM

canvas.addEventListener("mousemove", function(e) {
  let rect = canvas.getBoundingClientRect();

  let x = (e.clientX - rect.left) * (canvas.width / rect.width);
  let y = (e.clientY - rect.top) * (canvas.height / rect.height);

  let dx = x - dragon.x;
  let dy = y - dragon.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 40) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
});


// 10. PRILAGODITEV CANVASA

bg.onload = function() {
  canvas.width = bg.naturalWidth;
  canvas.height = bg.naturalHeight;

  let scale = Math.min(
    window.innerWidth / canvas.width,
    window.innerHeight / canvas.height
  );

  canvas.style.width = canvas.width / 1.2 * scale + "px";
  canvas.style.height = canvas.height / 1.2 * scale + "px";

  animate();
};


// 11. SECRET ABOUT ME

document.addEventListener("keydown", function(e) {
  if (e.key.toLowerCase() === "o") {
    Swal.fire({
      title: 'About me',
      html: `
        <b>Dragon Maze</b><br><br>
        Avtor: Jaka Gorjan
      `,
      icon: 'info',
      confirmButtonText: 'Zapri'
    });
  }
});
