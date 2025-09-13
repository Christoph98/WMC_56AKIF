const url = "https://opentdb.com/api.php?amount=1&category=18&difficulty=easy";

document.getElementById('fetch-question').addEventListener('click', function () {
        const output = document.getElementById('Frage');
        fetch(url)
        .then(response => response.json())
        .then(data => {
        const question = data.results[0].question;
        output.textContent = question;});
    });