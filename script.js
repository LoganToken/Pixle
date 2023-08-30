const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;
const blocksizeValues = [200, 160, 130, 100, 80, 60, 50, 40, 30, 25, 20, 18, 16, 15, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

let LEVEL_INDEX = 0;
let LEVEL = levels[LEVEL_INDEX];
let ROUND = 0;
let CURRENT_BLOCKSIZE = blocksizeValues[ROUND];

const DEBUG = false;
let IMAGE = null;
startLevel(LEVEL_INDEX, DEBUG);

const nextLevelButtonElement = document.getElementById('next-level-button');
nextLevelButtonElement.addEventListener('click', function(){
    const nextLevelIndex = LEVEL_INDEX += 1;
    startLevel(nextLevelIndex, DEBUG);
});

const guessInputElement = document.getElementById('guess-input');
guessInputElement.addEventListener('keydown', function(event){
    if (event.key == "Enter"){
        makeGuess();
    }  
});

const guessInputButtonElement = document.getElementById('guess-input-submit');
guessInputButtonElement.addEventListener('click', function(event){
    makeGuess();
});

function startLevel(level_index, debug=false){
    //reset global variables
    LEVEL_INDEX = level_index;
    ROUND = 0;
    CURRENT_BLOCKSIZE = blocksizeValues[ROUND];
    //set level object
    LEVEL = levels[level_index];
    //reset html
    const previousGuessesContainer = document.getElementById('previous-guesses-container');
    previousGuessesContainer.innerHTML = '';
    const currentLevelElement = document.getElementById('current-level-indicator');
    currentLevelElement.innerHTML = 'Current Level: ' + LEVEL_INDEX;
    //draw image
    const image = new Image();
    image.src = LEVEL.source;
    if (debug){
        image.src = LEVEL.src;
    }
    image.onload = function(){
        redrawImage(image, ctx, CURRENT_BLOCKSIZE);
    }
    IMAGE = image;
}

function makeGuess(){
    //get guess
    const guess = guessInputElement.value;

    //display guess
    const previousGuessesContainer = document.getElementById('previous-guesses-container');
    const nextGuessParagraph = document.createElement('p');
    nextGuessParagraph.textContent = guess;
    previousGuessesContainer.appendChild(nextGuessParagraph);

    //if correct ->
    if (compareGuess(guess, LEVEL.answer)){
        //do something
        handleCorrectGuess();
        console.log("CORRECT!");
        return
    }
    
    //if wrong ->
    //clear guess
    guessInputElement.value = '';
    //increment round
    ROUND += 1;
    if (ROUND < blocksizeValues.length){
        CURRENT_BLOCKSIZE = blocksizeValues[ROUND];
    }
    //redraw image
    redrawImage(IMAGE, ctx, CURRENT_BLOCKSIZE);

}

//TODO add capitalization rules
function compareGuess(guess, answer){
    const lowerGuess = guess.toLowerCase();
    if (lowerGuess == answer){
        return true;
    }

    return false;
}

function handleCorrectGuess(){
    //change level title
    const levelTitleElement = document.getElementById('level-title');
    levelTitleElement.textContent = "Correct! The answer was " + LEVEL.answer + "!";
    //redraw full image
    redrawImage(IMAGE, ctx, 1);
}

function redrawImage(image, context, blocksize){
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const scannedData = scannedImage.data;
    scannedImage.data = pixelateImage(scannedData, canvas.width, canvas.height, blocksize);
    context.putImageData(scannedImage, 0, 0);
}

function pixelateImage(imageData, width, height, blocksize){
    if (blocksize <= 1) return;
    //Pick starting points
    for (let i = 0; i*blocksize < width; i++){
        for (let j = 0; j*blocksize < height; j++){
            const xStart = i*blocksize;
            const yStart = j*blocksize;
            const xEnd = Math.min(xStart + blocksize, width);
            const yEnd = Math.min(yStart + blocksize, height);
            const startPixelIndex = toOneDimension(xStart, yStart, width, height)*4;
            const rComponent = imageData[startPixelIndex];
            const gComponent = imageData[startPixelIndex + 1];
            const bComponent = imageData[startPixelIndex + 2];

            for (let x = xStart; x < xEnd; x++){
                for (let y = yStart; y < yEnd; y++){
                    const pixelIndex = toOneDimension(x, y, width, height)*4;
                    imageData[pixelIndex] = rComponent;
                    imageData[pixelIndex + 1] = gComponent;
                    imageData[pixelIndex + 2] = bComponent;
                }
            }
        }
    }
    return imageData;
}

function toTwoDimensions(oneDIndex, width, height){
    const row = Math.floor(oneDIndex/width);
    const col = oneDIndex % width;
    return {
        x: row,
        y: col
    };
}

function toOneDimension(x, y, width, height){
    return x*width + y;
}


// OLD STUFF
// const blocksizeSubmitElement = document.getElementById('blocksize-submit');
// blocksizeSubmitElement.addEventListener("click", function(event){
//     const blocksizeInputElement = document.getElementById('blocksize-input');
//     const blocksizeInputValue = blocksizeInputElement.value;
//     const blocksize = parseInt(blocksizeInputValue);
//     console.log(blocksize);

//     ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
//     const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const scannedData = scannedImage.data;
//     scannedImage.data = pixelateImage(scannedData, canvas.width, canvas.height, blocksize);
//     ctx.putImageData(scannedImage, 0, 0);
// });

// image1 = new Image();
// image1.src = LEVEL.src;

// image1.addEventListener('load', function(){
//     ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
//     const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     console.log(scannedImage);
//     const scannedData = scannedImage.data;
//     scannedImage.data = pixelateImage(scannedData, canvas.width, canvas.height, CURRENT_BLOCKSIZE);
//     ctx.putImageData(scannedImage, 0, 0);
// });