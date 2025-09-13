const url = "https://opentdb.com/api.php?amount=1&category=18&difficulty=easy";

document.getElementById('fetch-question').addEventListener('click', function () {
        const output = document.getElementById('Frage');
        const output2 = document.getElementById('answers');
        output2.innerHTML = '';
        fetch(url)
        .then(response => response.json())
        .then(data => {
        const question = data.results[0].question;
        output.textContent = question;
        const incorrect_answers = data.results[0].incorrect_answers, correct = data.results[0].correct_answer;
        const combined = [...incorrect_answers, correct].sort(()=>Math.random()-0.5);
        combined.forEach(element => {
            const button = document.createElement('button');
            button.textContent = element; 
            output2.appendChild(button);
            document.getElementById('answers').addEventListener('click',function (){
            if (element === correct) {
                button.style.backgroundColor = 'green';
            } else {
                button.style.backgroundColor = 'red';
            }
        });
        });
    });
});
