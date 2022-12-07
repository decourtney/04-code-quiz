// Store necessary elements
let timerEl = document.getElementById("timer");
let questionsEL = document.getElementById("questions");
let answersEl = document.getElementById("answers");
let startButtonEl = document.getElementById("start");
let mainmenuButtonEl = document.getElementById("mainmenu").children[0].children[1];
let highScoresButtonEl = document.getElementById("highscores").children[0].children[1];
let readyButtonEl = document.getElementById("ready");
let characterSelectEl = document.getElementById("character-select");
let scoreBoardEl = document.getElementById("scores").children[0];

// Global Variables
const listQA = createArrayOfQA();
const points = 100;
let timerCount;
let timeLeft;
let nextIndex = 0;
let playerScore = 0;
let pointMulti = 1;
let changeScreenDelay = 1000;
let maxScoreListSize = 10;
let mobileDisplay = window.matchMedia("(max-width: 1440px)");

// Check screen size on load and adjust list size of high scores
function checkDisplay(value)
{
    if (value.matches)
    {
        maxScoreListSize = 5;
    } else
    {
        maxScoreListSize = 10;
    }
}

function main()
{
    // Probably unnecessary to have these event listeners in main() but it just feels better
    mainmenuButtonEl.addEventListener("click", loadMainMenu);
    startButtonEl.addEventListener("click", loadArena);
    readyButtonEl.addEventListener("click", startQuiz);
    highScoresButtonEl.addEventListener("click", loadHighScores);
    checkDisplay(mobileDisplay);
    mobileDisplay.addEventListener("resize", checkDisplay);

    // Only one character to load for now
    LoadCharacterIcons()
}

function LoadCharacterIcons()
{
    // Create an img element and set some attributes
    let el = document.createElement("img");
    el.src = "./assets/images/ninjagirl-icon.png"
    el.setAttribute("alt", "Ninja Girl Icon");
    characterSelectEl.appendChild(el);

    // The icon is useless. This line tests applying a style to the img
    el.addEventListener("click", function () { el.setAttribute("style", "box-shadow: 0 5px 15px rgba(145, 92, 182, 1);") });
}

function loadMainMenu()
{
    // Set display properties of Screens
    setDisplay(".arena-frame", false);
    setVsibility(".left", false);
    setDisplay(".highscores-frame", false);
    setDisplay(".start-frame", true);

    // Make highscores-frame button visible when in Main Menu
    highScoresButtonEl.parentElement.style.display = "flex";

    // If the player returns to Main Menu during quiz then reset game info and clear QA window
    clearInterval(timerCount);
    removeElement("#answers li");
    removeElement("#enter-score table");
    timerEl.textContent = '00';
    nextIndex = 0;
    playerScore = 0;
    pointMulti = 1;
}

function loadHighScores()
{
    // Set display properties of Screens
    setDisplay(".start-frame", false);
    setDisplay(".arena-frame", false);
    setVsibility(".left", false);
    setDisplay(".highscores-frame", true);

    // Clear any score display present before populating scores list
    removeElement("#scores li");
    removeElement("#answers li");

    // Get an array of the scores sorted by points
    let sortedScores = sortScores();
    // Iterate array and append up to the top 10
    if (sortedScores)
    {
        for (let i = 0; i < sortedScores.length && i < maxScoreListSize; i++)
        {
            let liName = document.createElement("li");
            let liScore = document.createElement("li");
            liName.textContent = sortedScores[i].name;
            liScore.textContent = sortedScores[i].score;
            scoreBoardEl.appendChild(liName);
            scoreBoardEl.appendChild(liScore);
        }
    }
}

function loadArena()
{
    // Set display properties of Screens
    setDisplay(".start-frame", false);
    setDisplay(".highscores-frame", false);
    setDisplay(".arena-frame", true);
    setVsibility(".left", true);
}

function startQuiz()
{
    // Set display properties of Screens
    setVsibility(".left", false);

    // Hide the highscores-frame button
    highScoresButtonEl.parentElement.style.display = "none";

    // Start timer and display questions
    countDownTimer();
    displayNextQA(nextIndex);
}

function displayNextQA(index)
{
    // Clear previously displayed Q and A
    removeElement("#answers li");

    // Check where we are in the list of QandA's
    if (index < listQA.length)
    {
        // Get next indexed QA. QA's are divided by semicolons 
        let nextQA = listQA[index].split(";", listQA[index].length);

        // Question becomes first index in new array - Apply to element
        questionsEL.textContent = nextQA[0];

        // Now iterate through the possible answers - Create and apply to li element
        for (let i = 1; i < nextQA.length; i++)
        {
            let li = document.createElement("li");

            // Correct answers start with a lowercase 'a' - Split and check first character of answer and apply appropriate class attr
            if (nextQA[i].split("", 1).toString() === "~")
            {
                li.textContent = nextQA[i].slice(1, nextQA[i].length);
                li.setAttribute("class", "button correct hover");
            } else
            {
                li.textContent = nextQA[i];
                li.setAttribute("class", "button hover");
            }

            // Make the li respond to clicks and append to the answers ordered list
            li.addEventListener("click", getAnswer);
            answersEl.appendChild(li);
        }

        // Increase index
        nextIndex++;
    } else
    {
        // Reached the end of the QandA's - Stop timer and end game
        clearInterval(timerCount);
        setTimeout(function () { gameOver() }, changeScreenDelay);
    }
}

function getAnswer(event)
{
    element = event.target;

    // Each correctly selected subsequent answer increases point multiplier and Character hits the opponent
    // Incorrectly selected answers reset point multiplier, reduces time on the clock, and Opponent hits the character
    if (element.matches(".correct") === true)
    {
        // correct answer
        playerScore += points * pointMulti;
        pointMulti++;
        playerAttack();
    } else
    {
        // incorrect answer
        pointMulti = 1;
        timeLeft += -3;
        opAttack();
    }

    // Selection made, consequences reaped - Display next QandA
    displayNextQA(nextIndex);
}

// Ran out of time or questions
function gameOver()
{
    loadHighScores();

    // Object to store player initials and score
    let player = {
        name: '',
        score: ''
    };

    // Create a table to display - One row, two cells
    let tbl = document.createElement("table");
    let tr = tbl.insertRow();
    let td1 = tr.insertCell();
    let td2 = tr.insertCell();

    // Create an input form for player initials - Max 3 characters
    let form = document.createElement("input");
    form.setAttribute("id", "player-initials");
    form.setAttribute("size", "3");
    form.setAttribute("type", "text");
    form.setAttribute("maxlength", "3");
    form.defaultValue = "AAA";

    // Div that will hold the table
    let enterScore = document.getElementById("enter-score");

    // Input form goes under Player column. Score under score column
    td1.appendChild(form);
    td2.textContent = playerScore;
    enterScore.appendChild(tbl);

    // Once the player 'enters' their name - Convert to uppercase and assign each value to the 'player' object and pass to
    // the saveScore function
    form.onkeydown = function (event)
    {
        if (event.key === "Enter")
        {
            player.name = form.value.toUpperCase();
            player.score = playerScore;
            removeElement("#enter-score table");
            playerScore = 0;
            saveScore(player);
        }
    }
}

function saveScore(obj)
{
    // Parse the saved scores array
    let scores = [];
    scores = JSON.parse(localStorage.getItem("savedScores"));

    // Avoid any issues with null/undefined
    if (!scores)
    {
        scores = [obj];
    } else
    {
        scores.push(obj);
    }

    // Stringify and store the array
    localStorage.setItem("savedScores", JSON.stringify(scores));
    loadHighScores();
}

// Sort and Return the locallystored scores
function sortScores()
{
    let scores = [];
    scores = JSON.parse(localStorage.getItem("savedScores"));

    // Sort the objects based on player.score
    if (scores)
    {
        return scores.sort(function (a, b) { return b.score - a.score });
    }
}

// Timer function keeps calling itself until cleared
function countDownTimer()
{
    timeLeft = 30;

    timerCount = setInterval(function ()
    {
        if (timeLeft > 0)
        {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else
        {
            // Timer reaches zero - game over
            timerEl.textContent = '00';
            clearInterval(timerCount);
            setTimeout(function () { gameOver() }, changeScreenDelay);
        }
    }, 1000);
}

// Pass element id name to have it removed
function removeElement(value)
{
    if (value === "#answers li")
    {
        questionsEL.textContent = '';
    }

    let el = document.querySelectorAll(value);
    el.forEach(element =>
    {
        element.parentNode.removeChild(element);
    });
}

// Pass element to change display value
function setDisplay(selector, display)
{
    document.querySelector(selector).style.display = display ? 'block' : 'none';
}
// Pass element to change visibility value
function setVsibility(selector, visible)
{
    document.querySelector(selector).style.visibility = visible ? 'visible' : 'hidden';
}

main();

// Array of Q and A's each semicolon separated (question;answer;anwer;...)
// Correct answers will start with the string 'a'
function createArrayOfQA()
{
    return [
        "Inside which HTML element do we put the JavaScript?;<js>;<scripting>;~<script>;<javascript>",
        "What is the correct JavaScript syntax to change the content of the HTML element below?\n\n<p id=\"demo\">This is a demonstration.</p>;~document.getElementById(\"demo\").innerHTML = \"Hello World!\";#demo.innerHTML = \"Hello World!\";document.getElement(\"p\").innerHTML = \"Hello World!\";document.getElementByName(\"p\").innerHTML = \"Hello World!\"",
        "Where is the correct place to insert a JavaScript?;The <body> section;~Both the <head> section and the <body> section are correct;The <head> section",
        "What is the correct syntax for referring to an external script called \"xxx.js\"?;<script href=\"xxx.js\">;~<script src=\"xxx.js\">;<script name=\"xxx.js\">",
        "The external JavaScript file must contain the <script> tag;True;~False",
        "How do you write \"Hello World\" in an alert box?;~alert(\"Hello World\");msg(\"Hello World\");msgBox(\"Hello World\");alertBox(\"Hello World\")",
        "How you create a function in JavaScript?;~function myFunction();function = myFunction();function:myFunction()",
        "How do you call a function named \"myFunction\"?;call myFunction();call function myFunction();~myFunction()",
        "How do you write an IF statement in JavaScript?;if i==5 then;if i = 5 then;~if (i == 5);if i = 5",
        "How do you write an IF statement for executing some code if \"i\" is NOT equal to 5?;if i <> 5;if i=! 5 then;~if (i != 5);if (i <> 5)"
    ]
}