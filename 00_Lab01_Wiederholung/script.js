const url = "https://opentdb.com/api.php?amount=1&category=18&difficulty=easy";
const data = await res.json();
const question = data.results.quwestion;

document.getElementById('fetch-question').addEventListener('click', () => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const question = data.results.question;
      console.log(question);
    });
});
    