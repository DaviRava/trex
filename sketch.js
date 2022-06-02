var trex, trex_running, edges;
var groundImage, chao;
var invisible;
var clouds, imagem;
var cactos, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6;
var pontuacao = 0
var morte
var gruponuvens
var gamestate = "playing"
var bla
var gameover, restart, morreu, resetar
var pular, morrida, parabens

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png")
  imagem = loadImage("cloud.png")
  cacto1 = loadImage("obstacle1.png")
  cacto2 = loadImage("obstacle2.png")
  cacto3 = loadImage("obstacle3.png")
  cacto4 = loadImage("obstacle4.png")
  cacto5 = loadImage("obstacle5.png")
  cacto6 = loadImage("obstacle6.png")
  bla = loadImage("trex_collided.png")
  gameover = loadImage("gameOver.png")
  restart = loadImage("restart.png")
  pular = loadSound("pular.mp3")
  morrida = loadSound("morrida.mp3")
  parabens = loadSound("parabens.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //creation sprites
  trex = createSprite(50, height-40, 20, 50);
  chao = createSprite(width/2, height-15, width, 15)
  invisible = createSprite(width/2, height-10, width, 10)
  morreu = createSprite(width/2, height/2 -50)
  resetar = createSprite(width/2, height/2)
  trex.addAnimation("running", trex_running);
  trex.addImage("bla", bla)
  chao.addImage("ground", groundImage)
  morreu.addImage("gameover", gameover)
  resetar.addImage("restart", restart)
  invisible.visible = false
  edges = createEdgeSprites();

  //tamanho botao de reset e da palavra game over no final
  morreu.scale = 0.5
  resetar.scale = 0.5
  morreu.visible = false
  resetar.visible = false

  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50
  trex.debug = false
  trex.setCollider("circle", 0, 0, 40)
  //trex.setCollider("rectangle",60 ,0, 250,50,0 )
  //grupos
  morte = new Group()
  gruponuvens = new Group()

}


function draw() {
  //definir a cor do plano de fundo 
  background("white");
  //texts
  text("pontuacao " + pontuacao, 10, 10)
  if (pontuacao > 0 && pontuacao % 1000 == 0) {
    parabens.play()
  }
  //impedir que o trex caia
  trex.collide(invisible)
  drawSprites();

  // divisao dos estados de jogo
  if (gamestate === "playing") {
    pontuacao = pontuacao + Math.round(frameCount / 120)
    spawnclouds()
    spawncactos()

    //pular quando tecla de espaço for pressionada
    if (keyDown("space") && trex.y > height - 50||touches.length>0) {
      trex.velocityY = -10;
      pular.play()
      touches = []
    }
    // gravity
    trex.velocityY = trex.velocityY + 0.5;
    chao.velocityX = -(8 + pontuacao / 1000)
    if (chao.x < 0) {
      chao.x = chao.width / 2
    }
    if (trex.isTouching(morte)) {
      gamestate = "youdeath"
      //trex.velocityY = -12
      morrida.play()
      //pular.play() 
    }
  }
  else if (gamestate === "youdeath") {
    trex.changeAnimation("bla", bla)
    trex.velocityY = 0
    chao.velocityX = 0
    gruponuvens.setVelocityXEach(0)
    morte.setVelocityXEach(0)
    morte.setLifetimeEach(-1)
    gruponuvens.setLifetimeEach(-1)
    morreu.visible = true
    resetar.visible = true
    if (mousePressedOver(resetar)) {
      resettrex()
    }
  }
}

// clouds, cactos, resettrex
function spawnclouds() {
  if (frameCount % 100 === 0) {
    clouds = createSprite(width + 50, 20)
    clouds.addImage(imagem)
    clouds.velocityX = -5
    clouds.y = Math.round(random(20, height/2 -20))
    clouds.depth = trex.depth
    trex.depth = trex.depth + 1
    clouds.lifetime = 1500
    gruponuvens.add(clouds)
  }
}
function spawncactos() {
  if (frameCount % 100 === 0) {
    cactos = createSprite(width + 50, height - 50)
    console.log("cactos")
    cactos.velocityX = -(8 + pontuacao / 1000)
    cactos.lifetime = 1500
    morte.add(cactos)
    var guardadora = Math.round(random(1, 6))
    switch (guardadora) {
      case 1:
        cactos.addImage(cacto1)
        break;

      case 2:
        cactos.addImage(cacto2)
        break;

      case 3:
        cactos.addImage(cacto3)
        break;

      case 4:
        cactos.addImage(cacto4)
        break;

      case 5:
        cactos.addImage(cacto5)
        break;

      case 6:
        cactos.addImage(cacto6)
        cactos.scale = 0.8
        break;


      default:
        break;
    }
  }
}
function resettrex() {
  gamestate = "playing"
  morte.destroyEach()
  gruponuvens.destroyEach()
  pontuacao = 0
  morreu.visible = false
  resetar.visible = false
  trex.changeAnimation("running", trex_running);

}
