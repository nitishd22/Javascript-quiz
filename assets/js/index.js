
const QUIZ_SECTIONS = document.querySelectorAll(".quiz-section");


const START_SECTION = document.getElementById("start");
const START_BTN = document.getElementById("start-button");

const QUIZ_SECTION = document.getElementById("questions");
const TIME_REMAINING = document.getElementById("time-remaining");
const QUESTION = document.getElementById("question");
const CHOICES = document.getElementById("choices");
const CHOICE_STATUSES = document.querySelectorAll(".choice-status");
const CORRECT = document.getElementById("correct");
const WRONG = document.getElementById("wrong");


const END_SECTION = document.getElementById("finish");
const END_TITLE = document.getElementById("finish-header");
const SCORE = document.getElementById("score");
const INITIALS_INPUT = document.getElementById("init");
const SUBMIT_SCORE = document.getElementById("submit-form");
const ERROR_MESSAGE = document.getElementById("error");


class Question {
  constructor(question, choices, indexOfCorrectChoice) {
    this.question = question;
    this.choices = choices;
    this.indexOfCorrectChoice = indexOfCorrectChoice;
  }
}
const QUESTION_1 = new Question("Commonly used data types DO NOT include: ", 
  ["Strings", "Booleans", "Alerts", "Numbers"], 2);
const QUESTION_2 = new Question("The condition in an if / else statement is enclosed within ____.", 
  ["Quotes", "Curly brackets", "Parentheses", "Square brackets"], 2);
const QUESTION_3 = new Question("Arrays in JavaScript can be used to store ____.", 
  ["Numbers and Strings", "Other arrays", "Booleans", "All of the above"], 3);
const QUESTION_4 = new Question("String values must be enclosed within _____ when being assigned to variables.", 
  ["Commas", "Curly brackets", "Quotes", "Parentheses"], 2);
const QUESTION_5 = new Question("A very useful tool used during development and debugging for printing content to the debugger is: ", 
  ["JavaScript", "Terminal/Bash", "For Loops", "console.log"], 3);
const QUESTION_LIST = [QUESTION_1, QUESTION_2, QUESTION_3, QUESTION_4, QUESTION_5];

let currentQuestion = 0;

let totalTime = 75;
let totalTimeInterval;
let choiceStatusTimeout; 

/******** EVENT LISTENERS ********/ 
START_BTN.addEventListener('click', startGame);
CHOICES.addEventListener('click', processChoice);
SUBMIT_SCORE.addEventListener('click', processInput);
SUBMIT_SCORE.addEventListener('submit', processInput);

/******** START GAME ********/ 
function startGame() {
  showElement(QUIZ_SECTIONS, QUIZ_SECTION);
  
  displayTime();  
  displayQuestion();

  startTimer();
}

/******** SHOWING/HIDING ELEMENTS ********/ 
function showElement(siblingList, showElement) {
  for (element of siblingList) {
    hideElement(element);
  }
  showElement.classList.remove("hide");
} 

function hideElement(element) {
  if (!element.classList.contains("hide")) {
    element.classList.add("hide");
  }
}

/******** TIME ********/ 
function displayTime() {
  TIME_REMAINING.textContent = totalTime;
}

function startTimer() {
  totalTimeInterval = setInterval(function() {
    totalTime--;
    displayTime();
    checkTime();

  }, 1000);
}

function checkTime() {
  if (totalTime <= 0) {
    totalTime = 0;
    endQuiz();
  }
}


function displayQuestion() {
  QUESTION.textContent = QUESTION_LIST[currentQuestion].question;

  displayChoiceList();
}

function displayChoiceList() {
  CHOICES.innerHTML = "";

  QUESTION_LIST[currentQuestion].choices.forEach(function(answer, index) {
    const li = document.createElement("li");
    li.dataset.index = index;
    const button = document.createElement("button");
    button.textContent = (index + 1) + ". " + answer;
    li.appendChild(button);
    CHOICES.appendChild(li);
  });
}


function processChoice(event) {
  const userChoice = parseInt(event.target.parentElement.dataset.index);

  resetChoiceStatusEffects();
  checkChoice(userChoice);
  getNextQuestion();
}


function resetChoiceStatusEffects() {
  clearTimeout(choiceStatusTimeout);
  styleTimeRemainingDefault();
}

function styleTimeRemainingDefault() {
  TIME_REMAINING.style.color = "#4616E8";
}

function styleTimeRemainingWrong() {
  TIME_REMAINING.style.color = "#E81648";
}

function checkChoice(userChoice) {
  if (isChoiceCorrect(userChoice)) {
    displayCorrectChoiceEffects();
  } else {
    displayWrongChoiceEffects();
  }
}

function isChoiceCorrect(choice) {
  return choice === QUESTION_LIST[currentQuestion].indexOfCorrectChoice;
}

function displayWrongChoiceEffects() {
  deductTimeBy(10);

  styleTimeRemainingWrong();
  showElement(CHOICE_STATUSES, WRONG);

  choiceStatusTimeout = setTimeout(function() {
    hideElement(WRONG);
    styleTimeRemainingDefault();
  }, 1000);
}

function deductTimeBy(seconds) {
  totalTime -= seconds;
  checkTime();
  displayTime();
}

function displayCorrectChoiceEffects() {
  showElement(CHOICE_STATUSES, CORRECT);

  choiceStatusTimeout = setTimeout(function() {
    hideElement(CORRECT);
  }, 1000);
}


function getNextQuestion() {
  currentQuestion++;
  if (currentQuestion >= QUESTION_LIST.length) {
    endQuiz();
  } else {
    displayQuestion();
  }
}


function endQuiz() {
  clearInterval(totalTimeInterval);
  
  showElement(QUIZ_SECTIONS, END_SECTION);
  displayScore();
  setEndHeading();
}

function displayScore() {
  SCORE.textContent = totalTime;
}

function setEndHeading() {
  if (totalTime === 0) {
    END_TITLE.textContent = "Sorry! You're out of time!";
  } else {
    END_TITLE.textContent = "Congrats! You're done!";
  }
}


function processInput(event) {
  event.preventDefault();

  const init = INITIALS_INPUT.value.toUpperCase();

  if (isInputValid(init)) {
    const score = totalTime;
    const highscoreEntry = getNewHighscoreEntry(init, score);
    saveHighscoreEntry(highscoreEntry);
    window.location.href= "highscore.html";
  }
}

function getNewHighscoreEntry(init, score) {
  const entry = {
    init: init,
    score: score,
  }
  return entry;
}

function isInputValid(init) {
  let error = "";
  if (init === "") {
    error = "You can't submit empty initials!";
    displayFormError(error);
    return false;
  } else if (init.match(/[^a-z]/ig)) {
    error = "Initials may only include letters."
    displayFormError(error);
    return false;
  } else {
    return true;
  }
}

function displayFormError(error) {
  ERROR_MESSAGE.textContent = error;
  if (!INITIALS_INPUT.classList.contains("error")) {
    INITIALS_INPUT.classList.add("error");
  }
}

function saveHighscoreEntry(highscoreEntry) {
  const currentScores = getScoreList();
  placeEntryInHighscoreList(highscoreEntry, currentScores);
  localStorage.setItem('scoreList', JSON.stringify(currentScores));
}

function getScoreList() {
  const currentScores = localStorage.getItem('scoreList');
  if (currentScores) {
    return JSON.parse(currentScores);
  } else {
    return [];
  }
}

function placeEntryInHighscoreList(newEntry, scoreList) {
  const newScoreIndex = getNewScoreIndex(newEntry, scoreList);
  scoreList.splice(newScoreIndex, 0, newEntry);
}

function getNewScoreIndex(newEntry, scoreList) {
  if (scoreList.length > 0) {
    for (let i = 0; i < scoreList.length; i++) {
      if (scoreList[i].score <= newEntry.score) {
        return i;
      }
    } 
  }
  return scoreList.length;
}