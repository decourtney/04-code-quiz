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
const listQA = CreateArrayOfQA();
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
function CheckDisplay(value){
    if(value.matches){
        maxScoreListSize = 5;
    } else {
        maxScoreListSize = 10;
    }
}

function main() {
    // Probably unnecessary to have these event listeners in main() but it just feels better
    mainmenuButtonEl.addEventListener("click", loadMainMenu);
    startButtonEl.addEventListener("click", loadArena);
    readyButtonEl.addEventListener("click", startQuiz);
    highScoresButtonEl.addEventListener("click", loadHighScores);
    CheckDisplay(mobileDisplay);
    mobileDisplay.addEventListener(CheckDisplay);

    // Only one character to load for now
    LoadCharacterIcons()
}

function LoadCharacterIcons() {
    // Create an img element and set some attributes
    let el = document.createElement("img");
    el.src = "./assets/images/ninjagirl-icon.png"
    el.setAttribute("alt", "Ninja Girl Icon");
    characterSelectEl.appendChild(el);

    // The icon is useless. This line tests applying a style to the img
    el.addEventListener("click", function () { el.setAttribute("style", "box-shadow: 0 5px 15px rgba(145, 92, 182, 1);") });
}

function loadMainMenu() {
    // Set display properties of Screens
    setDisplay(".arena-frame", false);
    setVsibility(".left", false);
    setDisplay(".highscores-frame", false);
    setDisplay(".start-frame", true);

    // Make highscores-frame button visible when in Main Menu
    highScoresButtonEl.parentElement.style.display = "flex";

    // If the player returns to Main Menu during quiz then reset game info and clear QA window
    clearInterval(timerCount);
    RemoveElement("#answers li");
    RemoveElement("#enter-score table");
    timerEl.textContent = '00';
    nextIndex = 0;
    playerScore = 0;
    pointMulti = 1;
}

function loadHighScores() {
    // Set display properties of Screens
    setDisplay(".start-frame", false);
    setDisplay(".arena-frame", false);
    setVsibility(".left", false);
    setDisplay(".highscores-frame", true);

    // Clear any score display present before populating scores list
    RemoveElement("#scores li");
    RemoveElement("#answers li");

    // Get an array of the scores sorted by points
    let sortedScores = SortScores();
    // Iterate array and append up to the top 10
    for (let i = 0; i < sortedScores.length && i < maxScoreListSize; i++) {
        let liName = document.createElement("li");
        let liScore = document.createElement("li");
        liName.textContent = sortedScores[i].name;
        liScore.textContent = sortedScores[i].score;
        scoreBoardEl.appendChild(liName);
        scoreBoardEl.appendChild(liScore);
    }
}

function loadArena() {
    // Set display properties of Screens
    setDisplay(".start-frame", false);
    setDisplay(".highscores-frame", false);
    setDisplay(".arena-frame", true);
    setVsibility(".left", true);
}

function startQuiz() {
    // Set display properties of Screens
    setVsibility(".left", false);

    // Hide the highscores-frame button
    highScoresButtonEl.parentElement.style.display = "none";

    // Start timer and display questions
    countDownTimer();
    displayNextQA(nextIndex);
}

function displayNextQA(index) {
    // Clear previously displayed Q and A
    RemoveElement("#answers li");

    // Check where we are in the list of QandA's
    if (index < listQA.length) {
        // Get next indexed QA. QA's are divided by semicolons 
        let nextQA = listQA[index].split(";", listQA[index].length);

        // Question becomes first index in new array - Apply to element
        questionsEL.textContent = nextQA[0];

        // Now iterate through the possible answers - Create and apply to li element
        for (let i = 1; i < nextQA.length; i++) {
            let li = document.createElement("li");

            // Correct answers start with a lowercase 'a' - Split and check first character of answer and apply appropriate class attr
            if (nextQA[i].split("", 1).toString() === "a") {
                li.textContent = nextQA[i].slice(1, nextQA[i].length);
                li.setAttribute("class", "button correct hover");
            } else {
                li.textContent = nextQA[i];
                li.setAttribute("class", "button hover");
            }

            // Make the li respond to clicks and append to the answers ordered list
            li.addEventListener("click", getAnswer);
            answersEl.appendChild(li);
        }

        // Increase index
        nextIndex++;
    } else {
        // Reached the end of the QandA's - Stop timer and end game
        clearInterval(timerCount);
        setTimeout(function () { gameOver() }, changeScreenDelay);
    }
}

function getAnswer(event) {
    element = event.target;

    // Each correctly selected subsequent answer increases point multiplier and Character hits the opponent
    // Incorrectly selected answers reset point multiplier, reduces time on the clock, and Opponent hits the character
    if (element.matches(".correct") === true) {
        // correct answer
        playerScore = points * pointMulti;
        pointMulti++;
        PlayerAttack();
    } else {
        // incorrect answer
        pointMulti = 1;
        timeLeft += -3;
        OpAttack();
    }

    // Selection made, consequences reaped - Display next QandA
    displayNextQA(nextIndex);
}

// Ran out of time or questions
function gameOver() {
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

    // Once the player 'enters' their name - Convert to uppercase and assign each value to the 'player' object and store locally
    // loadHighScores after saving to local storage so the displayed list is updated with new info then remove the table
    form.onkeydown = function (event) {
        if (event.key === "Enter") {
            player.name = form.value.toUpperCase();
            player.score = playerScore;
            localStorage.setItem(player.name, JSON.stringify(player));
            loadHighScores();
            RemoveElement("#enter-score table");
            playerScore = 0;
        }
    }
}

// Timer function keeps calling itself until cleared
function countDownTimer() {
    timeLeft = 30;

    timerCount = setInterval(function () {
        if (timeLeft > 0) {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else {
            // Timer reaches zero - game over
            timerEl.textContent = '00';
            clearInterval(timerCount);
            setTimeout(function () { gameOver() }, changeScreenDelay);
        }
    }, 1000);
}

// Sort and Return the locallystored scores
function SortScores() {
    let scores = []

    for (let i = 0; i < localStorage.length; i++) {
        scores[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

    }
    return scores.sort(function (a, b) { return b.score - a.score });
}

// Pass element id name to have it removed
function RemoveElement(value) {
    if (value === "#answers li") {
        questionsEL.textContent = '';
    }

    let el = document.querySelectorAll(value);
    el.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

// Pass element to change display value
function setDisplay(selector, display) {
    document.querySelector(selector).style.display = display ? 'block' : 'none';
}
// Pass element to change visibility value
function setVsibility(selector, visible) {
    document.querySelector(selector).style.visibility = visible ? 'visible' : 'hidden';
}

main();

// Array of Q and A's each semicolon separated (question;answer;anwer;...)
// Correct answers will start with the string 'a'
function CreateArrayOfQA() {
    return [
        "What goes up must come down?;aYes;No;Maybe;I don\'t know",
        "Whats inside-out?;Inside;aOutside"
    ]
}