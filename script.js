const quiz = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: "4"
  },
  {
    question: "Capital of France?",
    options: ["Berlin", "London", "Paris", "Rome"],
    correct: "Paris"
  }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const submitBtn = document.getElementById("submit-btn");
//const nextBtn = document.getElementById("next-btn");
const scoreBoard = document.getElementById("score-board");
const timerEl = document.getElementById("timer");

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreBoard.textContent = "";
  //nextBtn.disabled = true;
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  startTimer();
  //nextBtn.disabled = true;
  submitBtn.disabled = false;

  const current = quiz[currentQuestionIndex];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";

  current.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "option-label";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = option;
    input.id = `option-${index}`;

    label.htmlFor = `option-${index}`;
    label.appendChild(input);
    label.appendChild(document.createTextNode(option));
    optionsEl.appendChild(label);
  });
}

function getSelectedOption() {
  const selected = document.querySelector('input[name="answer"]:checked');
  return selected ? selected.value : null;
}

function highlightAnswers(selected) {
  const correct = quiz[currentQuestionIndex].correct;
  const labels = document.querySelectorAll(".option-label");

  labels.forEach(label => {
    const input = label.querySelector("input");
    const value = input.value;
    label.classList.remove("correct", "incorrect");
    if (value === correct) {
      label.classList.add("correct");
    } else if (value === selected) {
      label.classList.add("incorrect");
    }
    input.disabled = true;
  });
}

function startTimer() {
  timeLeft = 10;
  timerEl.textContent = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeOut();
    }
  }, 1000);
}

function handleTimeOut() {
  alert("Time's up!");
  highlightAnswers(null);
  submitBtn.disabled = true;
  //nextBtn.disabled = false;
}
submitBtn.addEventListener("click", () => {
  const selected = getSelectedOption();
  if (!selected) {
    alert("Please select an option.");
    return;
  }

  clearInterval(timer);
  const correct = quiz[currentQuestionIndex].correct;
  if (selected === correct) {
    score++;
  }

  highlightAnswers(selected);
  submitBtn.disabled = true;
   // We don't need it anymore

  // ⏱️ Automatically go to next question after 1.5 seconds
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 1500);
});


//nextBtn.addEventListener("click", () => {
 // currentQuestionIndex++;
 // if (currentQuestionIndex < quiz.length) {
 //   showQuestion();
 // } else {
  //  endQuiz();
  //}
//}
//);

function endQuiz() {
  
  questionEl.textContent = "Quiz Completed!";
  optionsEl.innerHTML = "";
  timerEl.textContent = "";

  // Hide buttons after quiz ends
  submitBtn.style.display = "none";
  

  // Show only the number of correct answers
  scoreBoard.textContent = `Your score: ${score}/${quiz.length}`;


}

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
  scores.push({ date: new Date().toLocaleString(), score });
  localStorage.setItem("quizScores", JSON.stringify(scores));
}

function displayPastScores() {
  const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
  const scoreList = scores.map(s => `${s.date}: ${s.score}`).join("<br>");
  scoreBoard.innerHTML += `<br><br><strong>Past Scores:</strong><br>${scoreList}`;
}

startQuiz();
