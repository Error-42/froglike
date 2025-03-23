const puzzles = {
    "kulcstábla": {
        "title": "Kulcstábla",
        "checker": keyboard,
    }
}

var puzzle;
var allowedWords;
var ready;

function start() {
    let params = new URLSearchParams(document.location.search);
    let name = params.get("puzzle");
    
    puzzle = puzzles[name];
    document.title = puzzle.title;

    let client = new XMLHttpRequest();
    // originally: http://benoke98.f.fazekas.hu/alapadatok/magyar_szavak.txt
    // although here resaved as utf-8
    client.open("GET", "magyar_szavak.txt");
    client.onreadystatechange = function() {
        allowedWords = client.responseText.split('\n').map(word => word.trim());
        ready = true;
    };
    client.send();
}

function inputKeyPressed() {
    if (event.key === "Enter") {
        check();
    }
}

function check() {
    let answer = document.getElementById("answer");

    if (!ready) {
        answer.innerText = "Hiba: nem sikerült betölteni az adatokat";
        return;
    }

    let input = document.getElementById("query");
    let text = input.value;

    if (!allowedWords.includes(text.toUpperCase())) {
        answer.innerText = `${text} ismeretlen szó`
        answer.style.color = "#c0c000";
        return;
    }

    let accepted = puzzle.checker(text);
    
    answer.innerText = accepted
        ? `${text} megfelelő`
        : `${text} nem megfelelő`;
    answer.style.color = accepted
        ? "green"
        : "red";
}

/**
 * word: string
 */
function keyboard(word) {
    let rows = [
        "öüó",
        "qwertzuiopőú",
        "asdfghjkléáű",
        "íyxcvbnm-"
    ];

    return rows.filter(row => row.split('').some(c => word.includes(c))).length === 2;
}