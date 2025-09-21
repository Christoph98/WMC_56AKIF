const baseurl = "https://opentdb.com/api.php?amount=1&encode=url3986";
const categoryUrl = "https://opentdb.com/api_category.php";
let answered = false; // Variable für Antwort-Status hinzufügen

// Funktionen für die Highscores speicherung im Local Storage
function getHighscores() {
    return JSON.parse(localStorage.getItem('highscores') || '[]');
}

// Highscores werden gespeichert als JSON String
function saveHighscores(highscores) {
    localStorage.setItem('highscores', JSON.stringify(highscores));
}

// Spieler name wird aus dem Input geholt und gespeichert
const nameInput = document.getElementById("playerName");
const savedName = localStorage.getItem("playerName") || "";
if (nameInput) {    
    nameInput.value = savedName;
}

// Hier wird geprüft ob der Name eingegeben wurde und Name gespeichert undes werden leerzeichen entfernt
document.getElementById("saveName").addEventListener("click", function() {
    const name = nameInput.value.trim();
    if (!name) {
        alert('Bitte gib einen Namen ein!');        document.getElementById('fetch-question').addEventListener('click', function () {
            const currentName = localStorage.getItem('playerName');
            if (!currentName) {
                alert('Bitte gib zuerst deinen Namen ein!');
                return;
            }
        });
        return;
    }
    
    // Neuer Name = Neuer Score (0)
    localStorage.setItem("playerName", name.slice(0, 30));
    score = 0; // Score zurücksetzen
    setScoreForPlayer(name, score); // Score für neuen Spieler speichern
    renderScore(); // Anzeige aktualisieren
    alert("Name gespeichert: " + name);
});

// Score von spieler wird hier rausgeholt ausm local storage
function getScoreForPlayer(name) {
    const highscores = getHighscores();
    const entry = highscores.find(e => e.name === name);
    return entry ? entry.score : 0;
}

// Score wird hier gespeichert für den aktuelen spieler
function setScoreForPlayer(name, score) {
    let highscores = getHighscores();
    
    // Alten Eintrag komplett entfernen
    highscores = highscores.filter(e => e.name !== name);
    
    // Neuen Eintrag mit aktuellem Score hinzufügen
    highscores.push({ name, score });
    
    saveHighscores(highscores);
}

// Aktueler spieler name wird hier geholt
function getCurrentPlayer() {
    return localStorage.getItem('playerName') || '';
}

let score = getScoreForPlayer(getCurrentPlayer());

// Score wird hier angezeigt aufm bildschirm
function renderScore() {
    document.getElementById("score").textContent = score;
    renderHighscoreList();
}

// Highscore liste wird hier erstelt und sortirt
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

// Kategorien werden hier von der API geholt und in select eingefügt
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
        return;
    }
    
    const output = document.getElementById('Frage');
    const output2 = document.getElementById('answers');
    output2.innerHTML = '';
    answered = false; // Reset answered status
    let selectedCat = document.getElementById("category").value;
    let url = baseurl;
    if (selectedCat) {
    url += `&category=${selectedCat}`;
    }
    // Neue frage von API holen mit category
    fetch(url)
    .then(response => response.json())
    .then(data => {
        // Frage wird decodirt und angezeigt
        const question = data.results[0].question;
        output.textContent = decodeURIComponent(question);
        
        // Antworten werden gemischt und buttons erstelt
        const incorrect_answers = data.results[0].incorrect_answers, 
              correct = data.results[0].correct_answer;
        const combined = [...incorrect_answers, correct].sort(()=>Math.random()-0.5);
        
        // Für jede antwort wird ein button erstelt
        combined.forEach(element => {
            const button = document.createElement('button');
            button.textContent = decodeURIComponent(element); 
            output2.appendChild(button);
               button.addEventListener('click', function () {
                    if (answered) return;      
                    answered = true;           
                    if (element === correct) {
                        score++;
                        const currentPlayer = getCurrentPlayer();
                        setScoreForPlayer(currentPlayer, score);
                        renderScore();
                        button.style.backgroundColor = 'green';
                    } else {
                        button.style.backgroundColor = 'red';
                        // Zeige richtige Antwort
                        const buttons = output2.getElementsByTagName('button');
                        for(let btn of buttons) {
                            if(decodeURIComponent(correct) === btn.textContent) {
                                btn.style.backgroundColor = 'green';
                            }
                        }
                    }
                });
        });
    });
});
renderScore();

// Cache leeren button löscht alles ausm local storage
document.getElementById('clear-cache').addEventListener('click', function() {
    localStorage.removeItem('playerName');    
    localStorage.removeItem('highscores');    
    score = 0;                               
    if (nameInput) nameInput.value = "";     // Eingabefeld leeren
    renderScore();
    renderHighscoreList();
    alert('Name und Scores gelöscht!');    
});

