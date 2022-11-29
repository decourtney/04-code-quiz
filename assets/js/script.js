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
    isRunning = false;
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

    RemoveElement("#scores-list");
    RemoveElement("#answers li");

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

    sortTable();
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

    isRunning = true;
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
        gameOver();
    }
}

function gameOver()
{
    mainmenuButtonEl.children[0].textContent = "Main Menu";
    clearInterval(timerCount);
    loadHighScores();
    isRunning = false;
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

// CutnPaste from W3Schools - adjust table value and g2g
function sortTable()
{
    var table, rows, switching, i, x, y, shouldSwitch;
    table = scoreBoardEl  
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching)
    {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++)
        {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[1];
            y = rows[i + 1].getElementsByTagName("TD")[1];
            // Check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase())
            {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch)
        {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
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

function createQAList()
{
    return [
        "What goes up must come down?;aYes;No;Maybe;I don\'t know",
        "Whats inside-out?;Inside;aOutside"
    ]
}

main();
