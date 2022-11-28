/* This script was adapted from Martin Himmel's 'Animating Sprite Sheets with Javascript' blog
    @ https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3 */

let idleAnim = new Image();
let attackAnim = new Image();
idleAnim.src = "./assets/images/ninjagirl-idle.png";
attackAnim.src = "./assets/images/ninjagirl-attack.png";
let imgAnim = idleAnim;
imgAnim.onload = function () { init(); };

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let isLoopOnce = false;



function startIdle()
{
    imgAnim = idleAnim;

    width = 290;
    height = 500;
    scaledWidth = scale * width;
    scaledHeight = scale * height;
    currentLoopIndex = 0;
    frameCount = 0
    isLoopOnce = false;
    init();
}

function startAttack()
{
    imgAnim = attackAnim;

    width = 524;
    height = 500;
    scaledWidth = scale * width;
    scaledHeight = scale * height;
    currentLoopIndex = 0;
    frameCount = 0
    isLoopOnce = true;

    
}

const scale = .2;
let width = 290;
let height = 500;
let scaledWidth = scale * width;
let scaledHeight = scale * height;

function drawFrame(frameX, frameY, canvasX, canvasY)
{
    ctx.drawImage(imgAnim,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}

// Cycle loop depends on the number animation frames in the animation
const cycleLoop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let currentLoopIndex = 0;
let frameCount = 0;

function step()
{
    frameCount++;
    if (frameCount < 10)
    {
        window.requestAnimationFrame(step);
        return;
    }
    frameCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(cycleLoop[currentLoopIndex], 0, 75, 30);
    currentLoopIndex++;
    if (currentLoopIndex >= cycleLoop.length)
    {
        currentLoopIndex = 0;
        if(isLoopOnce){
            startIdle();
            return;
        }
    }

    window.requestAnimationFrame(step);
}

function init()
{
    window.requestAnimationFrame(step);
}

