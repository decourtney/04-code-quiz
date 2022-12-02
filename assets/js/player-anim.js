/* This script was adapted from Martin Himmel's 'Animating Sprite Sheets with Javascript' blog
    @ https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3 */

/* TBH Applying characters and animations sounded easier in my head and I didn't bother looking for APIs.
    I had more planned but getting the animations to their current state was tedious and delicate.
    And I'm not sure if this is done correctly or just hacked to pieces in a functional manner */

// Used a spritesheet for each animation
let playerIdleAnim = new Image();
let playerAttackAnim = new Image();
let playerHitAnim = new Image();
let playerDeathAnim = new Image();

// Assign the spritesheet
playerIdleAnim.src = "./assets/images/ninjagirl-idle.png";
playerAttackAnim.src = "./assets/images/ninjagirl-attack.png";
playerHitAnim.src = "./assets/images/ninjagirl-hit.png";
playerDeathAnim.src = "./assets/images/ninjagirl-death.png";

// Set default/starting animation - Idle and initialize
let playerAnimation = playerIdleAnim;
playerAnimation.onload = function () { playerInit(); };

// Get the html canvas
let playerCanvas = document.getElementById("player-canvas")
let playerCtx = playerCanvas.getContext('2d');

// When true - tells the animator to execute one iteration through a spritesheet
let isPlayerLoopOnce = false;

// default settings for spritesheets. These settings work with the starting idle animation
const playerScale = .2;
let playerWidth = 290;
let playerHeight = 500;
let playerScaledWidth = playerScale * playerWidth;
let playerScaledHeight = playerScale * playerHeight;

// Each animation contains 10 frames
const playerCycleLoop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let playerCurrentLoopIndex = 0;
let playerFrameCount = 0;

// Each animation has individual W-H settings according to the spritesheet
// Each call to an animation sets the animation to use, its settings, and reset Frame count variables
function playerIdle() {
    playerAnimation = playerIdleAnim;

    playerWidth = 290;
    playerHeight = 500;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = false;
    playerInit();
}

function playerAttack() {
    playerAnimation = playerAttackAnim;

    playerWidth = 524;
    playerHeight = 565;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = true;

    setTimeout(function () { opHit() }, 300);
}

function playerHit() {
    playerAnimation = playerHitAnim;

    playerWidth = 578;
    playerHeight = 599;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = true;
}

function playerDeath() {
    playerAnimation = playerDeathAnim;

    playerWidth = 578;
    playerHeight = 599;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = true;
}

// This function displays the newly rendered sprite to the canvas
function playerDrawFrame(frameX, frameY, playerCanvasX, playerCanvasY) {
    playerCtx.drawImage(playerAnimation,
        frameX * playerWidth, frameY * playerHeight, playerWidth, playerHeight,
        playerCanvasX, playerCanvasY, playerScaledWidth, playerScaledHeight);
}

function playerAnimator() {
    // When called the animator will continue to loop through the current animation per frame rendering. Which varies by refresh rates
    playerFrameCount++;
    // Control how fast the animation plays by only rendering frames every 10th refresh
    if (playerFrameCount < 10) {
        window.requestAnimationFrame(playerAnimator);
        return;
    }
    playerFrameCount = 0;

    // The canvas needs to be cleared of any render before drawing next
    playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    playerDrawFrame(playerCycleLoop[playerCurrentLoopIndex], 0, 75, 30);

    playerCurrentLoopIndex++;
    // Once the last animation frame is reached rest loop index
    if (playerCurrentLoopIndex >= playerCycleLoop.length) {
        playerCurrentLoopIndex = 0;
        // If only one animation iteration is needed then set animation back to idle and return
        if (isPlayerLoopOnce) {
            playerIdle();
            return;
        }
    }

    window.requestAnimationFrame(playerAnimator);
}

function playerInit() {
    window.requestAnimationFrame(playerAnimator);
}