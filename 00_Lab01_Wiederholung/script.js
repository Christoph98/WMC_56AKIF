const baseurl = "https://opentdb.com/api.php?amount=1&encode=url3986";
const categoryUrl = "https://opentdb.com/api_category.php";

// Hilfsfunktion: Highscores aus Local Storage holen
function getHighscores() {
    return JSON.parse(localStorage.getItem('highscores') || '[]');
}

// Hilfsfunktion: Highscores speichern
function saveHighscores(highscores) {
    localStorage.setItem('highscores', JSON.stringify(highscores));
}

// Name aus Input holen
const nameInput = document.getElementById("playerName");
const savedName = localStorage.getItem("playerName") || "";
if (nameInput) {    
    nameInput.value = savedName;
}

// Name speichern
document.getElementById("saveName").addEventListener("click", function() {
    const name = nameInput.value.trim();
    if (!name) {
        alert('Bitte gib einen Namen ein!');
        nameInput.focus();
        return;
    }
    
    // Neuer Name = Neuer Score (0)
    localStorage.setItem("playerName", name.slice(0, 30));
    score = 0; // Score zurücksetzen
    setScoreForPlayer(name, score); // Score für neuen Spieler speichern
    renderScore(); // Anzeige aktualisieren
    alert("Name gespeichert: " + name);
});

// Score für aktuellen Spieler holen
function getScoreForPlayer(name) {
    const highscores = getHighscores();
    const entry = highscores.find(e => e.name === name);
    return entry ? entry.score : 0;
}

// Score für aktuellen Spieler setzen
function setScoreForPlayer(name, score) {
    let highscores = getHighscores();
    
    // Alten Eintrag komplett entfernen
    highscores = highscores.filter(e => e.name !== name);
    
    // Neuen Eintrag mit aktuellem Score hinzufügen
    highscores.push({ name, score });
    
    saveHighscores(highscores);
}

// Aktuellen Namen holen
function getCurrentPlayer() {
    return localStorage.getItem('playerName') || '';
}

let score = getScoreForPlayer(getCurrentPlayer());

function renderScore() {
    document.getElementById("score").textContent = score;
    renderHighscoreList();
}

function renderHighscoreList() {
    const highscores = getHighscores();
    const list = document.getElementById('highscore-list');
    list.innerHTML = '';
    // Sortiere nach Score absteigend
    highscores.sort((a, b) => b.score - a.score);
    highscores.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        list.appendChild(li);
    });
}

fetch(categoryUrl)
.then(response => response.json())
.then(data => {
    const select = document.getElementById('category');
    const allOptions = document.createElement('option');
    allOptions.value = '';
    allOptions.textContent = 'Alle Kategorien';
    select.appendChild(allOptions);

    data.trivia_categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
        select.value = '9';
    });
});


document.getElementById('fetch-question').addEventListener('click', function () {
    // Prüfen ob Name eingegeben wurde
    const currentName = localStorage.getItem('playerName');
    if (!currentName) {
        alert('Bitte gib zuerst deinen Namen ein!');
        nameInput.focus();
        return;
    }
    
    const output = document.getElementById('Frage');
    const output2 = document.getElementById('answers');
    output2.innerHTML = '';
    let selectedCat = document.getElementById("category").value;
    let url = baseurl;
    if (selectedCat) {
    url += `&category=${selectedCat}`;
    }
    fetch(url)
    .then(response => response.json())
    .then(data => {
    const question = data.results[0].question;
    output.textContent = decodeURIComponent(question);
    const incorrect_answers = data.results[0].incorrect_answers, correct = data.results[0].correct_answer;
    const combined = [...incorrect_answers, correct].sort(()=>Math.random()-0.5);
    let answered = false;
    combined.forEach(element => {
    const button = document.createElement('button');
    button.textContent = decodeURIComponent(element); 
    output2.appendChild(button);
       button.addEventListener('click', function () {
                if (answered) return;      
                answered = true;           
                if (element === correct) {
                    score++;
                    const currentPlayer = getCurrentPlayer(); // aktuellen Spieler holen
                    setScoreForPlayer(currentPlayer, score);
                    renderScore();
                } 
        });
        document.getElementById('answers').addEventListener('click', function () {
            if (element === correct) {
                button.style.backgroundColor = 'green';
            } else {   
                button.style.backgroundColor = 'red';
            }
        });
    });
});
});
renderScore();

document.getElementById('clear-cache').addEventListener('click', function() {
 localStorage.removeItem('playerName');    // Name löschen
    localStorage.removeItem('highscores');    // Highscores (Scores) löschen
    score = 0;                               // Score-Variable zurücksetzen
    if (nameInput) nameInput.value = "";     // Eingabefeld leeren
    renderScore();
    renderHighscoreList();
    alert('Name und Scores gelöscht!');    
});

