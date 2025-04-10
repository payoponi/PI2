let numBoles = 10;
let bolaX = new Array(numBoles);
let bolaY = new Array(numBoles);
let bolaVelY = new Array(numBoles);
let bolaColor = new Array(numBoles);
let bolaActiva = new Array(numBoles).fill(false);
let bolaEnPas = new Array(numBoles).fill(false);
let bolaDestiX = new Array(numBoles);
let bolaDestiY = new Array(numBoles);
let bolaEnCaixa = new Array(numBoles).fill(false);

let puntuacio = 0;
let vides = 3;
let jocActiu = true;
let midaCaixa = 100;
let espaiCaixa = 50;
let posicioCaixaY = 400;
let posicioCaixaVermellaX, posicioCaixaBlavaX, posicioCaixaVerdaX, posicioCaixaGrocX;

let bolaActualEsq = true;
let hiHaBolaActiva = false;
let bolaPassada = false;
let tempsUltimCanvi = 0;
let modeGroc = false;
let teclaJPremuda = false;
let teclaKPremuda = false;
let tempsModeGroc = 4000;
let haGeneratBolaGroc = false;

let imgCaixaVermella, imgCaixaBlava, imgCaixaVerda, imgCaixaGroc;
let imgBolaVermella, imgBolaBlava, imgBolaVerda, imgBolaGroc;

function preload() {
  fonsDisco = loadImage('disco.jpg');
  
  imgCaixaVermella = loadImage('bandera-nylon-personalizada.jpg');
  imgCaixaBlava = loadImage('cistellaF.png');
  imgCaixaVerda = loadImage('ferri.png');
  imgCaixaGroc = loadImage('Porteria.png');

  imgBolaVermella = loadImage('golf_ball.png');
  imgBolaBlava = loadImage('basquet_ball.png');
  imgBolaVerda = loadImage('rugby_ball.png');
  imgBolaGroc = loadImage('football_ball.png');
}

function setup() {
  createCanvas(600, 500);
  let ampladaTotalCaixes = 3 * midaCaixa + 2 * espaiCaixa;
  let iniciX = (width - ampladaTotalCaixes) / 2;

  posicioCaixaVermellaX = iniciX;
  posicioCaixaBlavaX = posicioCaixaVermellaX + midaCaixa + espaiCaixa;
  posicioCaixaVerdaX = posicioCaixaBlavaX + midaCaixa + espaiCaixa;
  posicioCaixaGrocX = width / 2 - midaCaixa / 2;
}

function draw() {
  background(fonsDisco);

  if (!jocActiu) {
    textSize(32);
    fill(255, 0, 0);
    text("Has perdut!!", width / 2 - 100, height / 2);
    textSize(20);
    text("Puntuació final: " + puntuacio, width / 2 - 80, height / 2 + 40);
    return;
  }

  if (millis() - tempsUltimCanvi > 20000 && !modeGroc) {
    iniciarModeGroc();
  }

  if (modeGroc) {
    image(imgCaixaGroc, posicioCaixaGrocX - 20, posicioCaixaY - 20, midaCaixa + 40, midaCaixa + 40);
    if (millis() - tempsUltimCanvi > tempsModeGroc) {
      finalitzarModeGroc();
    }
  } else {
    image(imgCaixaVermella, posicioCaixaVermellaX, posicioCaixaY, midaCaixa, midaCaixa);
    image(imgCaixaBlava, posicioCaixaBlavaX, posicioCaixaY, midaCaixa, midaCaixa);
    image(imgCaixaVerda, posicioCaixaVerdaX, posicioCaixaY, midaCaixa, midaCaixa);
  }

  if (!hiHaBolaActiva && !modeGroc) {
    generarNovaBola();
  } else if (modeGroc && !haGeneratBolaGroc && !hiHaBolaActiva) {
    generarBolaGroc();
  }

  hiHaBolaActiva = false;

  for (let i = 0; i < numBoles; i++) {
    if (bolaActiva[i]) {
      let img = getBolaImg(bolaColor[i]);
      if (img) {
        image(img, bolaX[i] - 15, bolaY[i] - 15, 30, 30);
      } else {
        fill(bolaColor[i]);
        ellipse(bolaX[i], bolaY[i], 30, 30);
      }

      if (bolaEnPas[i]) {
        let easing = 0.2;
        let dx = bolaDestiX[i] - bolaX[i];
        let dy = bolaDestiY[i] - bolaY[i];
        bolaX[i] += dx * easing;
        bolaY[i] += dy * easing;

        if (abs(dx) < 1 && abs(dy) < 1) {
          if (bolaEnCaixa[i]) {
            bolaActiva[i] = false;
            puntuacio++;
            if (modeGroc) {
              finalitzarModeGroc();
            } else {
              bolaActualEsq = !bolaActualEsq;
            }
          } else {
            bolaY[i] = -10;
            bolaEnPas[i] = false;
            bolaPassada = true;
          }
        }
      } else {
        bolaY[i] += bolaVelY[i];
      }

      hiHaBolaActiva = true;

      if (bolaY[i] > height) {
        bolaActiva[i] = false;
        if (!modeGroc) {
          bolaActualEsq = !bolaActualEsq;
        }
        vides--;
        if (vides <= 0) {
          jocActiu = false;
        }
      }
    }
  }

  fill(255);
  textSize(20);
  text("Puntuació: " + puntuacio, 20, 30);
  text("Vides: " + vides, 20, 60);
}

function getBolaImg(col) {
  let r = red(col), g = green(col), b = blue(col);
  if (r === 255 && g === 255 && b === 0) return imgBolaGroc;
  if (r === 255 && g === 0 && b === 0) return imgBolaVermella;
  if (r === 0 && g === 0 && b === 255) return imgBolaBlava;
  if (r === 0 && g === 255 && b === 0) return imgBolaVerda;
  return null;
}

function iniciarModeGroc() {
  modeGroc = true;
  tempsUltimCanvi = millis();
  haGeneratBolaGroc = false;

  for (let i = 0; i < numBoles; i++) {
    bolaActiva[i] = false;
  }
  hiHaBolaActiva = false;
}

function finalitzarModeGroc() {
  modeGroc = false;
  tempsUltimCanvi = millis();
  haGeneratBolaGroc = false;
  bolaActualEsq = !bolaActualEsq;
}

function generarBolaGroc() {
  for (let i = 0; i < numBoles; i++) {
    if (!bolaActiva[i]) {
      bolaX[i] = width / 2;
      bolaY[i] = random(-30, 0);
      bolaVelY[i] = random(1.5, 3.0);
      bolaColor[i] = color(255, 255, 0);
      bolaActiva[i] = true;
      hiHaBolaActiva = true;
      bolaEnPas[i] = false;
      bolaEnCaixa[i] = false;
      haGeneratBolaGroc = true;
      break;
    }
  }
}

function generarNovaBola() {
  for (let i = 0; i < numBoles; i++) {
    if (!bolaActiva[i]) {
      bolaX[i] = bolaActualEsq ?
        random(posicioCaixaVermellaX + midaCaixa, posicioCaixaBlavaX) :
        random(posicioCaixaBlavaX + midaCaixa, posicioCaixaVerdaX);
      bolaY[i] = random(-30, 0);
      bolaVelY[i] = random(1.5, 3.0);
      let colorIndex = int(random(3));
      bolaColor[i] = colorIndex === 0 ? color(255, 0, 0) :
                     colorIndex === 1 ? color(0, 0, 255) :
                     color(0, 255, 0);
      bolaActiva[i] = true;
      hiHaBolaActiva = true;
      bolaEnPas[i] = false;
      bolaEnCaixa[i] = false;
      break;
    }
  }
}

function keyPressed() {
  if (!jocActiu) return;

  if (key === 'j' || key === 'J') teclaJPremuda = true;
  if (key === 'k' || key === 'K') teclaKPremuda = true;

  if (modeGroc && teclaJPremuda && teclaKPremuda) {
  for (let i = 0; i < numBoles; i++) {
    if (bolaActiva[i] && !bolaEnPas[i] && bolaColor[i].toString() === color(255, 255, 0).toString()) {
      bolaDestiX[i] = posicioCaixaGrocX + midaCaixa / 2;
      bolaDestiY[i] = posicioCaixaY + midaCaixa / 2;
      bolaEnPas[i] = true;
      bolaEnCaixa[i] = true;
      puntuacio += 10;  // Suma 10 punts en lloc de 1
      teclaJPremuda = false;
      teclaKPremuda = false;
      break;
    }
  }
}


  if (!modeGroc) {
    for (let i = 0; i < numBoles; i++) {
      if (bolaActiva[i] && !bolaEnPas[i]) {
        let r = red(bolaColor[i]);
        let g = green(bolaColor[i]);
        let b = blue(bolaColor[i]);

        if ((key === 'a' && r > 200 && bolaX[i] < posicioCaixaBlavaX) ||
            (key === 's' && b > 200 && bolaX[i] < posicioCaixaBlavaX) ||
            (key === 'ArrowRight' && g > 200 && bolaX[i] >= posicioCaixaBlavaX) ||
            (key === 'ArrowLeft' && b > 200 && bolaX[i] >= posicioCaixaBlavaX)) {

          bolaDestiX[i] =
            key === 'a' ? posicioCaixaVermellaX + midaCaixa / 2 :
            key === 's' || key === 'ArrowLeft' ? posicioCaixaBlavaX + midaCaixa / 2 :
            posicioCaixaVerdaX + midaCaixa / 2;

          bolaDestiY[i] = posicioCaixaY + midaCaixa / 2;
          bolaEnPas[i] = true;
          bolaEnCaixa[i] = true;
          break;
        }

        if (key === 'g') {
          if (g > 200 && bolaX[i] < posicioCaixaBlavaX) {
            bolaDestiX[i] = random(posicioCaixaBlavaX + midaCaixa, posicioCaixaVerdaX);
            bolaDestiY[i] = -10;
            bolaEnPas[i] = true;
            bolaPassada = true;
          } else if (r > 200 && bolaX[i] >= posicioCaixaBlavaX) {
            bolaDestiX[i] = random(posicioCaixaVermellaX + midaCaixa, posicioCaixaBlavaX);
            bolaDestiY[i] = -10;
            bolaEnPas[i] = true;
            bolaPassada = true;
          }
        }
      }
    }
  }
}

function keyReleased() {
  if (key === 'j' || key === 'J') teclaJPremuda = false;
  if (key === 'k' || key === 'K') teclaKPremuda = false;
}
