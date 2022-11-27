Storage.prototype.setObj = function (key, obj) { return this.setItem(key, JSON.stringify(obj)) }
Storage.prototype.getObj = function (key) { return JSON.parse(this.getItem(key)) }
let timerEl = document.getElementById("timer");
let questionsEL = document.getElementById("questions");
let answersEl = document.getElementById("answers");
let startButtonEl = document.getElementById("start");
let highScoresButtonEl = document.getElementById("highscores");
let rulesButtonEl = document.getElementById("rules");
let mainmenuButtonEl = document.getElementById("mainmenu");
let characterButtonEl = document.getElementById("character");
let scoreBoardEl = document.getElementById("scores");

const listQA = createQAList();
const points = 100;
let isRunning = false;
var timerCount;
let nextIndex = 0;
let playerScore = 0;
let pointMulti = 1;


function main()
{
    mainmenuButtonEl.addEventListener("click", loadMainMenu);
    startButtonEl.addEventListener("click", loadArena);
    characterButtonEl.addEventListener("click", startQuiz);
    highScoresButtonEl.addEventListener("click", loadHighScores);


}

function loadMainMenu()
{
    setVisible(".arena", false);
    setVisible(".left", false);
    setVisible(".highscores", false);
    setVisible(".start", true);

    highScoresButtonEl.children[0].style.display = "block";
    rulesButtonEl.children[0].style.display = "block";

    clearInterval(timerCount);
    removeQA();
    removeForm();
    timerEl.textContent = '00';
    isRunning = false;
    nextIndex = 0;
    playerScore = 0;
    pointMulti = 1;

}

// Need to sort by highest score then by name
function loadHighScores()
{
    setVisible(".start", false);
    setVisible(".arena", false);
    setVisible(".left", false);
    setVisible(".highscores", true);

    removeTable();

    for (let i = 0; i < localStorage.length; i++)
    {
        let score = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let tr = scoreBoardEl.insertRow();
        tr.setAttribute("id", "scores-list")
        let td1 = tr.insertCell();
        let td2 = tr.insertCell();
        td1.textContent = score.name;
        td2.textContent = score.score;
    }
}

// For now only the character select will appear
// Add health bars
function loadArena()
{
    setVisible(".start", false);
    setVisible(".highscores", false);
    setVisible(".arena", true);
    setVisible(".left", true);
}

// Will load characters and start quiz once selected
function loadCharacterSelect() { }

function gameOver()
{
    clearInterval(timerCount);
    loadHighScores();
    isRunning = false;
    pointMulti = 1;
    
    let player = {
        name: '',
        score: ''
    }

    let tbl = document.createElement("table");
    let tr = tbl.insertRow();
    let td1 = tr.insertCell();
    let td2 = tr.insertCell();


    let form = document.createElement("input");
    form.setAttribute("id", "playerInitials");
    form.setAttribute("size", "5");
    form.setAttribute("text", "submit");
    form.defaultValue = "AAA";

    let enterScore = document.getElementById("enter-score");

    td1.appendChild(form);
    td2.textContent = playerScore;
    enterScore.appendChild(tbl);

    form.onkeydown = function (event)
    {
        if (event.key === "Enter")
        {
            player.name = form.value;
            player.score = playerScore;
            localStorage.setItem(player.name, JSON.stringify(player));
            loadHighScores();
            removeForm();
        }
    }

    playerScore = 0;
}

// For now the character select button will start quiz
// Change to start after character has been selected
// Change Main Menu text to quit
function startQuiz()
{
    highScoresButtonEl.children[0].style.display = "none";
    rulesButtonEl.children[0].style.display = "none";

    isRunning = true;
    countDownTimer();
    displayNextQA(nextIndex);


}

function getAnswer(event)
{
    element = event.target;

    if (element.matches(".correct") === true)
    {
        // correct answer found
        playerScore = points * pointMulti;
        pointMulti++;
    } else
    {
        // wrong answer found
        pointMulti = 1;
    }

    displayNextQA(nextIndex);
}

// function ScoreKeeper(value)
// {

//     if (arguments.length == 0)
//     {
//         console.log("nothing passed. should return score");
//     } else
//     {
//         let multiplier = value
//         console.log(multiplier);
//         playerScore = points * multiplier;
//     }

// }

function countDownTimer()
{
    let timeLeft = 10;

    timerCount = setInterval(function ()
    {
        if (timeLeft > 1)
        {
            timerEl.textContent = timeLeft;
            timeLeft--;
        } else
        {
            timerEl.textContent = '00';
            gameOver();
        }
    }, 1000);

}

function displayNextQA(index)
{
    removeQA();

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
        gameOver();
    }
}

function removeQA()
{
    questionsEL.textContent = '';
    let list = document.querySelectorAll("#answers li");
    list.forEach(element =>
    {
        element.parentNode.removeChild(element);
    });
}

function removeForm()
{
    let highscores = document.querySelectorAll("#enter-score table");
    highscores.forEach(element => { element.parentNode.removeChild(element) });
}

function removeTable()
{
    let scoresList = document.querySelectorAll("#scores-list");
    scoresList.forEach(element =>
    {
        element.parentNode.removeChild(element);
    });
}

function createQAList()
{
    return [
        "What goes up must come down?;aYes;No;Maybe;I don\'t know",
        "Whats inside-out?;Inside;aOutside"
    ]
}

main();
