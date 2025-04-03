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

function setup() {
  createCanvas(600, 500);
  let ampladaTotalCaixes = 3 * midaCaixa + 2 * espaiCaixa;
  let iniciX = (width - ampladaTotalCaixes) / 2;

  posicioCaixaVermellaX = iniciX;
  posicioCaixaBlavaX = posicioCaixaVermellaX + midaCaixa + espaiCaixa;
  posicioCaixaVerdaX = posicioCaixaBlavaX + midaCaixa + espaiCaixa;
  posicioCaixaGrocX = width/2 - midaCaixa/2;
}

function draw() {
  background(255);

  if (!jocActiu) {
    textSize(32);
    fill(255, 0, 0);
    text("Has perdut!!", width/2 - 100, height/2);
    textSize(20);
    text("Puntuació final: " + puntuacio, width/2 - 80, height/2 + 40);
    return;
  }

  // canviar groc cada 20 segundos
  if (millis() - tempsUltimCanvi > 20000 && !modeGroc) {
    iniciarModeGroc();
  }

  if (modeGroc) {
   
    fill(255, 255, 0);
    rect(posicioCaixaGrocX, posicioCaixaY, midaCaixa, midaCaixa);
    
    if (millis() - tempsUltimCanvi > tempsModeGroc) {
      finalitzarModeGroc();
    }
  } else {
    // Modo normal - 3 cajas
    fill(255, 0, 0);
    rect(posicioCaixaVermellaX, posicioCaixaY, midaCaixa, midaCaixa);
    fill(0, 0, 255);
    rect(posicioCaixaBlavaX, posicioCaixaY, midaCaixa, midaCaixa);
    fill(0, 255, 0);
    rect(posicioCaixaVerdaX, posicioCaixaY, midaCaixa, midaCaixa);
  }

  if (!hiHaBolaActiva && !modeGroc) {
    generarNovaBola();
  } else if (modeGroc && !haGeneratBolaGroc && !hiHaBolaActiva) {
    generarBolaGroc();
  }

  hiHaBolaActiva = false;

  for (let i = 0; i < numBoles; i++) {
    if (bolaActiva[i]) {
      fill(bolaColor[i]);
      ellipse(bolaX[i], bolaY[i], 30, 30);
      
      // Animació 
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

  fill(0);
  textSize(20);
  text("Puntuació: " + puntuacio, 20, 30);
  text("Vides: " + vides, 20, 60);
  
  // Mostrar temporizador para modo groc
  if (modeGroc) {
    let tempsRestant = ceil((tempsModeGroc - (millis() - tempsUltimCanvi))/1000);
    fill(0);
    textSize(16);
  }
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
      bolaX[i] = width/2;
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
  
  // Verificar teclas J y K para bola amarilla
  if (key === 'j' || key === 'J') {
    teclaJPremuda = true;
  }
  if (key === 'k' || key === 'K') {
    teclaKPremuda = true;
  }
  
  if (modeGroc && teclaJPremuda && teclaKPremuda) {
    for (let i = 0; i < numBoles; i++) {
      if (bolaActiva[i] && !bolaEnPas[i] && bolaColor[i].toString() === color(255, 255, 0).toString()) {
        bolaDestiX[i] = posicioCaixaGrocX + midaCaixa / 2;
        bolaDestiY[i] = posicioCaixaY + midaCaixa / 2;
        bolaEnPas[i] = true;
        bolaEnCaixa[i] = true;
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
          
          if (key === 'a') {
            bolaDestiX[i] = posicioCaixaVermellaX + midaCaixa / 2;
          } else if (key === 's' || key === 'ArrowLeft') {
            bolaDestiX[i] = posicioCaixaBlavaX + midaCaixa / 2;
          } else if (key === 'ArrowRight') {
            bolaDestiX[i] = posicioCaixaVerdaX + midaCaixa / 2;
          }
          
          bolaDestiY[i] = posicioCaixaY + midaCaixa / 2;
          bolaEnPas[i] = true;
          bolaEnCaixa[i] = true;
          break;
        }

        if (key === 'g') {
          if (g > 200 && bolaX[i] < posicioCaixaBlavaX) {  
            bolaDestiX[i] = posicioCaixaVerdaX + midaCaixa / 2;
            bolaDestiY[i] = -10;
            bolaEnPas[i] = true;
            bolaPassada = true;
          } else if (r > 200 && bolaX[i] >= posicioCaixaBlavaX) {  
            bolaDestiX[i] = posicioCaixaVermellaX + midaCaixa / 2;
            bolaDestiY[i] = -10;
            bolaEnPas[i] = true;
            bolaPassada = true;
          }
        }

        if (key === 'f' && bolaPassada) {
          for (let j = 0; j < numBoles; j++) {
            if (bolaActiva[j] && bolaEnPas[j] && !bolaEnCaixa[j]) {
              bolaActiva[j] = false;
              puntuacio += 2;
              bolaPassada = false;
              bolaActualEsq = !bolaActualEsq;
              break;
            }
          }
        }
      }
    }
  }
}

function keyReleased() {
  if (key === 'j' || key === 'J') {
    teclaJPremuda = false;
  }
  if (key === 'k' || key === 'K') {
    teclaKPremuda = false;
  }
}