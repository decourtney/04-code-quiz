/* This script was adapted from Martin Himmel's 'Animating Sprite Sheets with Javascript' blog
    @ https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3 */

/* This is almost identical to the player-anim script - Adjusted variable and function names to avoid issues
    The only difference is the canvas is flipped on the X-axis so the character spritesheet faces the other direction */

let opIdleAnim = new Image();
let opAttackAnim = new Image();
let opHitAnim = new Image();
let opDeathAnim = new Image();

opIdleAnim.src = "./assets/images/purpninja-idle.png";
opAttackAnim.src = "./assets/images/purpninja-attack.png";
opHitAnim.src = "./assets/images/purpninja-hit.png";
opDeathAnim.src = "./assets/images/purpninja-death.png";
let opAnimation = opIdleAnim;
opAnimation.onload = function () { OpInit(); };

let opCanvas = document.getElementById("op-canvas");
let opCtx = opCanvas.getContext('2d');
let isOpLoopOnce = false;
opCtx.scale(-1, 1);

const opScale = .2;
let opWidth = 232;
let opHeight = 439;
let opScaledWidth = opScale * opWidth;
let opScaledHeight = opScale * opHeight;

const opCycleLoop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let opCurrentLoopIndex = 0;
let opFrameCount = 0;

function OpIdle()
{
    opAnimation = opIdleAnim;

    opWidth = 232;
    opHeight = 439;
    opScaledWidth = opScale * opWidth;
    opScaledHeight = opScale * opHeight;
    opCurrentLoopIndex = 0;
    opFrameCount = 0
    isOpLoopOnce = false;
    OpInit();
}

function OpAttack()
{
    opAnimation = opAttackAnim;

    opWidth = 536;
    opHeight = 495;
    opScaledWidth = opScale * opWidth;
    opScaledHeight = opScale * opHeight;
    opCurrentLoopIndex = 0;
    opFrameCount = 0
    isOpLoopOnce = true;
    setTimeout(function () { PlayerHit() }, 300);
}

function OpHit()
{
    opAnimation = opHitAnim;

    opWidth = 482;
    opHeight = 498;
    opScaledWidth = opScale * opWidth;
    opScaledHeight = opScale * opHeight;
    opCurrentLoopIndex = 0;
    opFrameCount = 0
    isOpLoopOnce = true;
}

function OpDeath()
{
    opAnimation = opDeathAnim;

    opWidth = 482;
    opHeight = 498;
    opScaledWidth = opScale * opWidth;
    opScaledHeight = opScale * opHeight;
    opCurrentLoopIndex = 0;
    opFrameCount = 0
    isOpLoopOnce = true;
}

function OpDrawFrame(frameX, frameY, canvasX, canvasY)
{
    opCtx.drawImage(opAnimation,
        frameX * opWidth, frameY * opHeight, opWidth, opHeight,
        canvasX * -1, canvasY, opScaledWidth, opScaledHeight);
}

function OpAnimator()
{
    opFrameCount++;
    if (opFrameCount < 10)
    {
        window.requestAnimationFrame(OpAnimator);
        return;
    }
    opFrameCount = 0;
    opCtx.clearRect(0, 0, opCanvas.width * -1, opCanvas.height);
    OpDrawFrame(opCycleLoop[opCurrentLoopIndex], 0, 210, 42);
    opCurrentLoopIndex++;
    if (opCurrentLoopIndex >= opCycleLoop.length)
    {
        opCurrentLoopIndex = 0;
        if (isOpLoopOnce)
        {
            OpIdle();
            return;
        }
    }

    window.requestAnimationFrame(OpAnimator);
}

function OpInit()
{
    window.requestAnimationFrame(OpAnimator);
}