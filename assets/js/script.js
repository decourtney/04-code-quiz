Storage.prototype.setObj = function (key, obj) { return this.setItem(key, JSON.stringify(obj)) }
Storage.prototype.getObj = function (key) { return JSON.parse(this.getItem(key)) }
let timerEl = document.getElementById("timer");
let questionsEL = document.getElementById("questions");
let answersEl = document.getElementById("answers");
let startButtonEl = document.getElementById("start");
let highScoresButtonEl = document.getElementById("highscores");
let rulesButtonEl = document.getElementById("rules");
let mainmenuButtonEl = document.getElementById("mainmenu");
let readyButtonEl = document.getElementById("ready");
let characterSelectEl = document.getElementById("character-select");
let scoreBoardEl = document.getElementById("scores").children[0];

const listQA = createQAList();
const points = 100;
var timerCount;
let nextIndex = 0;
let playerScore = 0;
let pointMulti = 1;
let changeScreenDelay = 1000;


function main()
{
    mainmenuButtonEl.addEventListener("click", loadMainMenu);
    startButtonEl.addEventListener("click", loadArena);
    readyButtonEl.addEventListener("click", startQuiz);
    highScoresButtonEl.addEventListener("click", loadHighScores);

    LoadCharacterIcons()

}

function LoadCharacterIcons()
{

    let el = document.createElement("img");
    el.src = "./assets/images/ninjagirl-icon.png"
    el.setAttribute("alt", "Ninja Girl Icon");
    characterSelectEl.appendChild(el);

    el.addEventListener("click", function () { el.setAttribute("style", "box-shadow: 0 5px 15px rgba(145, 92, 182, 1);")});

}

function loadMainMenu()
{
    setDisplay(".arena", false);
    setVsibility(".left", false);
    setDisplay(".highscores", false);
    setDisplay(".start", true);

    highScoresButtonEl.children[0].style.display = "block";
    rulesButtonEl.children[0].style.display = "block";
    mainmenuButtonEl.children[0].textContent = "Main Menu";

    clearInterval(timerCount);
    RemoveElement("#answers li");
    RemoveElement("#enter-score table");
    timerEl.textContent = '00';
    nextIndex = 0;
    playerScore = 0;
    pointMulti = 1;

}

// Need to sort by highest score then by name
function loadHighScores()
{
    setDisplay(".start", false);
    setDisplay(".arena", false);
    setVsibility(".left", false);
    setDisplay(".highscores", true);

    RemoveElement("#scores li");
    RemoveElement("#answers li");

    let sortedScores = SortScores();
    console.log(sortedScores);

    for (let i = 0; i < sortedScores.length && i < 10; i++)
    {
        let liName = document.createElement("li");
        let liScore = document.createElement("li");
        liName.textContent = sortedScores[i].name;
        liScore.textContent = sortedScores[i].score;
        scoreBoardEl.appendChild(liName);
        scoreBoardEl.appendChild(liScore);


        // let score = JSON.parse(localStorage.getItem(localStorage.key(i)));
        // let tr = scoreBoardEl.insertRow();
        // tr.setAttribute("id", "scores-list")
        // let td1 = tr.insertCell();
        // let td2 = tr.insertCell();
        // td1.textContent = score.name;
        // td2.textContent = score.score;
    }

    // sortTable();
}

// For now only the character select will appear
// Add health bars
function loadArena()
{
    setDisplay(".start", false);
    setDisplay(".highscores", false);
    setDisplay(".arena", true);
    setVsibility(".left", true);


}

// For now the character select button will start quiz
// Change to start after character has been selected
// Change Main Menu text to quit
function startQuiz()
{
    setVsibility(".left", false);

    highScoresButtonEl.children[0].style.display = "none";
    rulesButtonEl.children[0].style.display = "none";
    mainmenuButtonEl.children[0].textContent = "Quit";

    // Add Fight text popup

    // Use delay to allow Fight text to animate
    countDownTimer();
    displayNextQA(nextIndex);


}

// Will load characters and start quiz once selected
function loadCharacterSelect() { }

function getAnswer(event)
{
    element = event.target;

    if (element.matches(".correct") === true)
    {
        // correct answer
        playerScore = points * pointMulti;
        pointMulti++;
        PlayerAttack();
    } else
    {
        // wrong answer
        pointMulti = 1;
        OpAttack();
    }

    displayNextQA(nextIndex);
}

function displayNextQA(index)
{
    RemoveElement("#answers li");

    if (index < listQA.length)
    {
        let nextQA = listQA[index].split(";", listQA[index].length);

        questionsEL.textContent = nextQA[0];

        for (let i = 1; i < nextQA.length; i++)
        {
            let li = document.createElement("li");

            if (nextQA[i].split("", 1).toString() === "a")
            {
                li.textContent = nextQA[i].slice(1, nextQA[i].length);
                li.setAttribute("class", "button correct");
            } else
            {
                li.textContent = nextQA[i];
                li.setAttribute("class", "button wrong");
            }

            li.addEventListener("click", getAnswer);
            answersEl.appendChild(li);
        }

        nextIndex++;
    } else
    {
        setTimeout(function () { gameOver() }, changeScreenDelay);
        clearInterval(timerCount);
    }
}

function gameOver()
{
    mainmenuButtonEl.children[0].textContent = "Main Menu";
    loadHighScores();
    pointMulti = 1;

    let player = {
        name: '',
        score: ''
    };

    let tbl = document.createElement("table");
    let tr = tbl.insertRow();
    let td1 = tr.insertCell();
    let td2 = tr.insertCell();

    let form = document.createElement("input");
    form.setAttribute("id", "player-initials");
    form.setAttribute("size", "3");
    form.setAttribute("type", "text");
    form.setAttribute("maxlength", "3");
    form.defaultValue = "AAA";

    let enterScore = document.getElementById("enter-score");

    td1.appendChild(form);
    td2.textContent = playerScore;
    enterScore.appendChild(tbl);

    form.onkeydown = function (event)
    {
        if (event.key === "Enter")
        {
            player.name = form.value.toUpperCase();
            player.score = playerScore;
            localStorage.setItem(player.name, JSON.stringify(player));
            loadHighScores();
            RemoveElement("#enter-score table");
            playerScore = 0;
        }
    }
}

function countDownTimer()
{
    let timeLeft = 99;

    timerCount = setInterval(function ()
    {
        if (timeLeft > 0)
        {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else
        {
            timerEl.textContent = '00';
            clearInterval(timerCount);
            setTimeout(function () { gameOver() }, changeScreenDelay);
        }
    }, 1000);

}

function SortScores()
{
    let scores = []

    for (let i = 0; i < localStorage.length; i++)
    {
        scores[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

    }
    return scores.sort(function (a, b) { return b.score - a.score });
}

function RemoveElement(value)
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

function setDisplay(selector, display)
{
    document.querySelector(selector).style.display = display ? 'block' : 'none';
}

function setVsibility(selector, visible)
{
    document.querySelector(selector).style.visibility = visible ? 'visible' : 'hidden';
}

function createQAList()
{
    return [
        "What goes up must come down?;aYes;No;Maybe;I don\'t know",
        "Whats inside-out?;Inside;aOutside"
    ]
}

main();
