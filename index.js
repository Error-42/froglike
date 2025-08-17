const puzzles = {
    // Old name, equivalent to hard difficulty.
    "kulcstábla": {
        "title": "Kulcstábla (nehéz)",
        "checker": word => countRows(word) === 2,
    },
    "kulcstábla-könnyű": {
        "title": "Kulcstábla (könnyű)",
        "checker": word => countRows(word) === 1,
    },
    "kulcstábla-közepes": {
        "title": "Kulcstábla (közepes)",
        "checker": word => countRows(word) <= 2,
    },
    "kulcstábla-nehéz": {
        "title": "Kulcstábla (nehéz)",
        "checker": word => countRows(word) === 2,
    },

    // I don't like it anymore, it's mostly just annoying, and therefore it is removed.
    // 
    // "kastély": {
    //     "title": "Kastély",
    //     "checker": wait,
    // }
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
 * @param {String} word
 * @returns {Number} 
 */
function countRows(word) {
    let rows = [
        "öüó",
        "qwertzuiopőú",
        "asdfghjkléáű",
        "íyxcvbnm-"
    ];

    return rows.filter(row => row.split('').some(c => word.toLowerCase().includes(c))).length;
}

/**
 * @param {String} word
 * @returns {bool}
 */
function wait(word) {
    let pastWordsText = localStorage.getItem("pastWords");
    let pastWords = pastWordsText === null ? {} : JSON.parse(pastWordsText);

    if (pastWords[word] !== undefined) {
        localStorage.setItem("lastInput", new Date().getTime());
        return pastWords[word];
    }

    let lastInput = parseInt(localStorage.getItem("lastInput") ?? "0");
    let currectTime = new Date().getTime();

    let accepted = currectTime - lastInput > 15000;

    pastWords[word] = accepted;

    localStorage.setItem("pastWords", JSON.stringify(pastWords));
    localStorage.setItem("lastInput", currectTime);

    return accepted;
}