/* This script was adapted from Martin Himmel's 'Animating Sprite Sheets with Javascript' blog
    @ https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3 */


let playerIdleAnim = new Image();
let playerAttackAnim = new Image();
let playerHitAnim = new Image();
let playerDeathAnim = new Image();

playerIdleAnim.src = "./assets/images/ninjagirl-idle.png";
playerAttackAnim.src = "./assets/images/ninjagirl-attack.png";
playerHitAnim.src = "./assets/images/ninjagirl-hit.png";
playerDeathAnim.src = "./assets/images/ninjagirl-death.png";
let playerAnimation = playerIdleAnim;
playerAnimation.onload = function () { PlayerInit(); };

let playerCanvas = document.getElementById("player-canvas")
let playerCtx = playerCanvas.getContext('2d');
let isPlayerLoopOnce = false;

const playerScale = .2;
let playerWidth = 290;
let playerHeight = 500;
let playerScaledWidth = playerScale * playerWidth;
let playerScaledHeight = playerScale * playerHeight;

const playerCycleLoop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let playerCurrentLoopIndex = 0;
let playerFrameCount = 0;

function PlayerIdle()
{
    playerAnimation = playerIdleAnim;

    playerWidth = 290;
    playerHeight = 500;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = false;
    PlayerInit();
}

function PlayerAttack()
{
    playerAnimation = playerAttackAnim;

    playerWidth = 524;
    playerHeight = 565;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = true;

    setTimeout(function () { OpHit() }, 300);
}

function PlayerHit()
{
    playerAnimation = playerHitAnim;

    playerWidth = 578;
    playerHeight = 599;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = true;
}

function PlayerDeath()
{
    playerAnimation = playerDeathAnim;

    playerWidth = 578;
    playerHeight = 599;
    playerScaledWidth = playerScale * playerWidth;
    playerScaledHeight = playerScale * playerHeight;
    playerCurrentLoopIndex = 0;
    playerFrameCount = 0
    isPlayerLoopOnce = true;
}

function PlayerDrawFrame(frameX, frameY, playerCanvasX, playerCanvasY)
{
    playerCtx.drawImage(playerAnimation,
        frameX * playerWidth, frameY * playerHeight, playerWidth, playerHeight,
        playerCanvasX, playerCanvasY, playerScaledWidth, playerScaledHeight);
}

function PlayerAnimator()
{
    playerFrameCount++;
    if (playerFrameCount < 10)
    {
        window.requestAnimationFrame(PlayerAnimator);
        return;
    }
    playerFrameCount = 0;
    playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    PlayerDrawFrame(playerCycleLoop[playerCurrentLoopIndex], 0, 75, 30);
    playerCurrentLoopIndex++;
    if (playerCurrentLoopIndex >= playerCycleLoop.length)
    {
        playerCurrentLoopIndex = 0;
        if (isPlayerLoopOnce)
        {
            PlayerIdle();
            return;
        }
    }

    window.requestAnimationFrame(PlayerAnimator);
}

function PlayerInit()
{
    window.requestAnimationFrame(PlayerAnimator);
}