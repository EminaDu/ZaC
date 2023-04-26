let board = document.getElementById("board");
var zcPositions = [];
var imagePaths = [];
var currentPosition = { x: 0, y: 0 };
var arraySize = 5;
var imagePath = 'Images/img (x).jpg';
var catImage = 'Images/ZandC/cat.png';
var zombieImage = 'Images/ZandC/zombie.png';
var numberOfZombies = 2;
var numberOfCats = 5;
var numberOfPoints = 0;
var gameOver = false;
let keyZombie = "z";
let keyCat = "c";
let keyPosition = "x";
let keyEmpty = " ";
let keyUp = "w";
let keyDown = "s";
let keyLeft = "a";
let keyRight = "d";
let keyReset = "r";
const url = "https://api.chucknorris.io/jokes/random"
let joke = document.getElementById("joke");

startGame();

document.addEventListener("keypress", function onEvent(event) {
    if ( event.key === keyLeft) {
        moveLeft();
    }
    else if ( event.key === keyRight) {
        moveRight();
    }
    else if ( event.key === keyUp) {
        moveUp();
    }
    else if ( event.key === keyDown) {
        moveDown();
    }
    else if ( event.key === keyReset) {
        restart();
    }
});

function startGame(){
    setupImageArray();
    setupZCPosition();
    getJoke();
    updatePoints();
    drawBoard();
    updateImages();
}

function drawBoard() {
    board.innerHTML = "";
    
    for (let i = 0; i < arraySize; i++) {
        const row = document.createElement('tr');
        row.setAttribute("class", "row")

      for (let j = 0; j < arraySize; j++) {
        const cell = document.createElement('td');
        cell.setAttribute("class", "cell")
        cell.innerHTML = zcPositions[i][j];
        cell.id = "row"+i+j;

        row.appendChild(cell);
      }
      
    board.appendChild(row);
    }
}

function updateBoard() {
    for (let i = 0; i < arraySize; i++) {
      for (let j = 0; j < arraySize; j++) {
        let cell = document.getElementById("row"+i+j);
        cell.innerHTML = zcPositions[i][j];
      }
    }
}

function removeCurrentPosition() {
    zcPositions[currentPosition.x][currentPosition.y] = keyEmpty;
}

function moveLeft(){
    removeCurrentPosition();
    if (currentPosition.y > 0) {
        currentPosition.y -= 1;
    }
    afterMove();
}

function moveRight(){
    removeCurrentPosition();
    if (currentPosition.y < arraySize-1) {
        currentPosition.y += 1;
    }
    afterMove();
}

function moveUp(){
    removeCurrentPosition();
    if (currentPosition.x > 0) {
        currentPosition.x -= 1;
    }
    afterMove();
}

function moveDown(){
    removeCurrentPosition();
    if (currentPosition.x < arraySize-1) {
        currentPosition.x += 1;
    }
    afterMove();
}

function afterMove(){
    if (gameOver === false) {
        updateUIAfterMove();
        updateBoard();
    }
}

function restart(){
    currentPosition = { x: 0, y: 0 };
    gameOver = false;
    zcPositions = [];
    numberOfPoints = 0;
    setupZCPosition();
    getJoke();
    updatePoints();
    updateBoard();
    updateImages()
    document.getElementById("gameOver").hidden=true;
}
    
function setupZCPosition() {
    for(var i=0; i< arraySize; i++) {
        var row = [];
        for(var j=0; j< arraySize; j++) {
            row.push(keyEmpty);
        }
        zcPositions.push(row);
    }
    setRandomPosition();
    setObjects(keyZombie, numberOfZombies);
    setObjects(keyCat, numberOfCats);
}

function setRandomPosition() {
    currentPosition.x = Math.floor(Math.random() * (5));
    currentPosition.y = Math.floor(Math.random() * (5));
    zcPositions[currentPosition.x][currentPosition.y] = keyPosition;
}

function setObjects(objectType, numberOfElements) {
    for (var i=0; i< numberOfElements; i++){

        var randomRow = Math.floor(Math.random() * (5));
        var randomCol = Math.floor(Math.random() * (5));

        while (zcPositions[randomRow][randomCol] != keyEmpty) {
            randomRow = Math.floor(Math.random() * (5));
            randomCol = Math.floor(Math.random() * (5));
        }
        zcPositions[randomRow][randomCol] = objectType;
    }
}

function setupImageArray(){
    var counter = 1;
    for(var i=0; i< arraySize; i++) {
        var row = [];
        for(var j=0; j< arraySize; j++) {
            var img = imagePath.replace("x",counter);
            row.push(img);
            counter+=1;
        }
        imagePaths.push(row);
    }
}

function updateImages() {
    var path = imagePaths[currentPosition.x][currentPosition.y];
    document.getElementById("backgroundPicture").src = path;
    var zc = getZC();
    var overlayImage = document.getElementById("overlayPicture");
    if (zc.path === "") {
        overlayImage.hidden = true
    } else {
        overlayImage.hidden = false
        overlayImage.src = zc.path;
    }
    zcPositions[currentPosition.x][currentPosition.y] = keyPosition;
}

function updateUIAfterMove(){
    updateImages();
    moveZombiesCloser();
}

function getZC() {
    if (zcPositions[currentPosition.x][currentPosition.y] === keyCat) {
        numberOfPoints += 1;
        updatePoints();
        setObjects(keyCat, 1);
        return {path: catImage};
    } else if (zcPositions[currentPosition.x][currentPosition.y] === keyZombie) {
        gameOver = true;
        document.getElementById("gameOver").hidden = false;
        return {path: zombieImage};
    } else  {
        return {path: ""}
    }
}

function moveZombiesCloser() {
    var zPos1 = {x:0, y:0};
    var zPos2 = {x:0, y:0};
    for(var i=0; i< arraySize; i++) {
        for(var j=0; j< arraySize; j++) {
            if(zcPositions[i][j] == keyZombie) {
                if ((zPos1.x == 0 && zPos1.y == 0) || (i == 0 && j == 0)) {
                    zPos1.x = i;
                    zPos1.y = j;
                } else {     
                    zPos2.x = i;
                    zPos2.y = j;
                }
            }
        }
    }

    var newZPos1 = { ...zPos1 };
    if (currentPosition.x > zPos1.x) {
        newZPos1.x = zPos1.x + 1;
    } else if (currentPosition.x < zPos1.x) {
        newZPos1.x = zPos1.x - 1;
    }

    if (currentPosition.y > zPos1.y) {
        newZPos1.y = zPos1.y + 1;
    } else if (currentPosition.x < zPos1.x) {
        newZPos1.y = zPos1.y - 1;
    }
    
    var newZPos2 = { ...zPos2 };
    if (currentPosition.x > zPos2.x) {
        newZPos2.x = zPos2.x + 1;
    } else if (currentPosition.x < zPos2.x) {
        newZPos2.x = zPos2.x - 1;
    }

    if (currentPosition.y > zPos2.y) {
        newZPos2.y = zPos2.y + 1;
    } else if (currentPosition.y < zPos2.y) {
        newZPos2.y = zPos2.y - 1;
    }
    
    if (zcPositions[newZPos1.x][newZPos1.y] === keyEmpty) {
        zcPositions[zPos1.x][zPos1.y] = keyEmpty;
        zcPositions[newZPos1.x][newZPos1.y] = keyZombie;
    } else if (zcPositions[newZPos1.x][newZPos1.y] === keyCat) {
        zcPositions[zPos1.x][zPos1.y] = keyEmpty;
        zcPositions[newZPos1.x][newZPos1.y] = keyZombie;
        setObjects(keyCat, 1);
    }

    if (zcPositions[newZPos2.x][newZPos2.y] === keyEmpty) {
        zcPositions[zPos2.x][zPos2.y] = keyEmpty;
        zcPositions[newZPos2.x][newZPos2.y] = keyZombie;
    } else if (zcPositions[newZPos2.x][newZPos2.y] === keyCat) {
        zcPositions[zPos2.x][zPos2.y] = keyEmpty;
        zcPositions[newZPos2.x][newZPos2.y] = keyZombie;
        setObjects(keyCat,1);
    }
}

function updatePoints() {
   document.getElementById("pointsNo").innerHTML = `<br>Points:${numberOfPoints}`;
    
}

function getJoke() {
    fetch(url)
        .then(function (response) { return response.json() })
        .then(function (data) {
            let result = data.value;
            let joke = document.getElementById("joke");
            joke.innerHTML = result;
        })
}