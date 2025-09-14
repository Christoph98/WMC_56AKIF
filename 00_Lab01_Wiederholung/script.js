const baseurl = "https://opentdb.com/api.php?amount=1&category=18&difficulty=easy";
const categoryUrl = "https://opentdb.com/api_category.php";
let score = parseInt(localStorage.getItem("score")) || 0;

function renderScore() {
    document.getElementById("score").textContent = score;
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
    });
});



document.getElementById('fetch-question').addEventListener('click', function () {
        const output = document.getElementById('Frage');
        const output2 = document.getElementById('answers');
        output2.innerHTML = '';
        const selectedCat = document.getElementById("category").value;
        let url = baseurl;
        if (selectedCat) {
        url += `&category=${selectedCat}`;
        }
        fetch(url)
        .then(response => response.json())
        .then(data => {
        const question = data.results[0].question;
        output.textContent = question;
        const incorrect_answers = data.results[0].incorrect_answers, correct = data.results[0].correct_answer;
        const combined = [...incorrect_answers, correct].sort(()=>Math.random()-0.5);
        let answered = false;
        combined.forEach(element => {
        const button = document.createElement('button');
        button.textContent = element; 
        output2.appendChild(button);
           button.addEventListener('click', function () {
                    if (answered) return;      
                    answered = true;           
                    if (element === correct) {
                        button.style.backgroundColor = 'green';
                        score++;
                        localStorage.setItem("score", score);
                        renderScore();
                    } else {
                        button.style.backgroundColor = 'red';
                    }
        });
        });
    });
});

renderScore();
