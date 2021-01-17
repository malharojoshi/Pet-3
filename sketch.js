//Create variables here
var dog, dogImg, happyDogImg, database;
var foodStock = 0;
var milkBottles = [];
var emptyBottle;
var filledBottle;
var actualHour = 1;
var gameState = "showDog";
var lastFed = 0;

function preload() {
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/Happy.png");
  gardenImg = loadImage("images/Garden.png");
  bedRoomImg = loadImage("images/Bed Room.png");
  washRoomImg = loadImage("images/Wash Room.png");
  //load images here
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  dog = createSprite(200, 300, 1, 1);
  dog.addImage(dogImg);
  dog.scale = 0.1;
  button1 = createButton("Eat");
  button1.position(350, 50);
  button1.mousePressed(eatFood);
  button2 = createButton("Add Food");
  button2.position(450, 50);
  button2.mousePressed(addFood);
  food = database.ref("pet/food");
  food.on("value", readStock);
  game = database.ref("pet/gameState");
  game.on("value", readGameState);
}
function readStock(data) {
  console.log("read Stock");
  foodStock = data.val();
  if (milkBottles.length === 0) {
    for (var a = 0; a < foodStock; a++) {
      milkBottles.push(new Food(10 + a * 25, 200));
    }
  }
}
function draw() {
  background(46, 139, 870);
  console.log(frameCount);

  if (frameCount % 316000 === 0) {
    if (actualHour === 12) {
      actualHour = 1;
    } else actualHour = actualHour + 1;
    if (lastFed !== undefined) {
      lastFed = lastFed + 1;
    }
  }
  for (b = 0; b < foodStock; b++) {
    milkBottles[b].display();
    //console.log()
  }
  if (lastFed === 1) {
    gameState = 1;
  }
  if (lastFed === 2) {
    gameState = 2;
  }
  if (lastFed === 3) {
    gameState = 3;
  }
  conceal();
  drawSprites();
  //add styles here
  text("Food: " + foodStock, 100, 100);
  text("Hour: " + actualHour, 200, 100);
}
function writeStock(x) {
  if (x > 0) {
    x = x - 1;
    filledBottle = firstFilledBottle();
    filledBottle.hide();
  } else {
    x = 0;
  }
  database.ref("pet/").update({ food: x });
}
function emptyBottles() {
  for (c = 0; c < foodStock; c++) {
    if (milkBottles[c].hidden === true) {
      return milkBottles[c];
    }
  }
}
function firstFilledBottle() {
  for (d = 0; d < foodStock; d++) {
    if (milkBottles[d].hidden === false) {
      return milkBottles[d];
    }
  }
}
function eatFood() {
  writeStock(foodStock);
  dog.addImage(happyDogImg);
  lastFed = 0;
}

function addFood() {
  emptyBottle = emptyBottles();
  if (emptyBottle) {
    emptyBottle.show();
    console.log(milkBottles);
    console.log(foodStock);
    database.ref("pet/").update({ food: foodStock + 1 });
  }
}
function readGameState(data) {
  gameState = data.val();
}
function conceal() {
  if (gameState === "showDog") {
  }
  if (gameState === 1) {
    background(gardenImg);
    dog.visible = false;
  }
  if (gameState === 2) {
    background(bedRoomImg);
    dog.visible = false;
  }
  if (gameState === 3) {
    background(washRoomImg);
  }
}
