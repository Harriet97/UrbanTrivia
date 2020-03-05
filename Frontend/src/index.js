const defCollectionDiv = document.querySelector("#definition-collection");
const welcomeDiv = document.querySelector("#welcome");
const headerDiv = document.querySelector("#header");
const footerDiv = document.querySelector("#footer");
const scoreDiv = document.querySelector("#score");
const currentWordEl = document.createElement("h1");
const livesEl = document.createElement("h1");
const scoreEl = document.createElement("h1");
let score = 0;
let lives = 3;
const timer = document.createElement("button");
timer.setAttribute("id", "counter");
timer.className = "timer";
// let game = false;
const addBtn = document.createElement("button");
addBtn.className = "game";
const EMPTY_HEART = "♡";
const FULL_HEART = "♥";

//TIMER:
function countdown() {
  let seconds = 60;
  const tick = () => {
    seconds--;
    timer.innerHTML = "00:" + (seconds < 10 ? "0" : "") + seconds.toString();
    if (seconds > 0) {
      setTimeout(tick, 1000);
    } else {
      timer.innerHTML = "Time's up!";
      gameOver();
    }
  };
  tick();
}

///TOY TALE

document.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", () => {
    welcomeDiv.remove();
    newGame();
    countdown();
    // }
  });
});

// let random = Math.floor(Math.random() * 3);
const random = () => {
  return Math.floor(Math.random() * 3);
};

// Game over screen
const gameOver = () => {
  const gameEl = document.createElement("h1");
  gameEl.innerText = "Game Over! :(";
  lives = gameEl.innerText;
  currentWordEl.innerText = "Game over..Thanks for Playing! :)";
  defCollectionDiv.innerHTML = ""; //clears page
  //clears scoreEl and livesEl so it can be updates with rerender
  //render blank screen
  scoreEl.innerHTML = `Your final score is: ${score}`;
  const timesUpEl = document.createElement("h1");
  const userForm = document.createElement("form");
  const inputForm = document.createElement("input");
  inputForm.innerText = "username";
  timesUpEl.innerText = "Time's up!";
  timer.remove();
  livesEl.remove();
  const instructionEl = document.createElement("h2");
  instructionEl.innerText = "Enter your name to save your score!";
  const formBtn = document.createElement("button");
  formBtn.className = "form";
  formBtn.innerText = "save score";
  userForm.append(timesUpEl, instructionEl, inputForm, formBtn);
  defCollectionDiv.append(userForm);
  scoreDiv.append(scoreEl);
};

// Select Answer Event Listener Function
const selectedAnswer = (event, randomN) => {
  const selctedA = parseInt(event.path[1].id); //hard coding! change later
  let arrEl = randomN + 1;
  //If the answer the user selected is the correct then score++
  if (selctedA == arrEl) {
    score++;
    defCollectionDiv.innerHTML = ""; //clears page
    footerDiv.innerHTML = ""; //clears scoreEl and livesEl so it can be updates with rerender
    API.getWords().then(words => renderWords(words));
  } else if (selctedA != arrEl && lives == 0) {
    gameOver();
    timer.remove();
    livesEl.remove();
  } else {
    lives--;
    defCollectionDiv.innerHTML = ""; //clears page
    footerDiv.innerHTML = ""; //clears scoreEl and livesEl so it can be updates with rerender

    API.getWords().then(words => renderWords(words));
  }

  // defCollectionDiv.innerHTML = ""; //clears page
  // footerDiv.innerHTML = ""; //clears scoreEl and livesEl so it can be updates with rerender

  // API.getWords().then(words => renderWords(words)); //renders new definitions
};

// Render Index Page
const renderWords = words => {
  welcomeDiv.innerHTML = "";
  scoreEl.className = "score";
  scoreEl.innerText = `Score: ${score}`;

  livesEl.className = "lives";

  livesEl.innerText = `Lives: ${lives}`;
  let wordsArray = words.list.slice(0, 4);
  let randomN = random();
  currentWordEl.innerText = wordsArray[randomN].word;
  headerDiv.append(currentWordEl);
  let id = 1;
  wordsArray.forEach(word => renderWord(word, id++, randomN));
  footerDiv.append(scoreEl, timer, livesEl);
};

const renderWord = (word, id, randomN) => {
  const wordDiv = document.createElement("div");
  wordDiv.className = "card";
  wordDiv.id = id;
  wordDiv.addEventListener("click", () => {
    selectedAnswer(event, randomN);
  });

  const definitionEl = document.createElement("h3");
  definitionEl.innerHTML = word.definition;

  wordDiv.append(definitionEl);
  defCollectionDiv.append(wordDiv);
};

///////////////////////////////
const URL = "http://api.urbandictionary.com/v0/random";
const API = {
  getWords: () => fetch(URL).then(response => response.json())
};
const newGame = () => {
  API.getWords().then(words => renderWords(words));
};
const renderHome = () => {
  const nameEl = document.createElement("h1");
  nameEl.innerText = "Urban Trivia";
  nameEl.className = "bounce";
  addBtn.innerText = "Play Game";

  // const playGameButton = document.createElement("button");
  // playGameButton.innerText = "Play Game";
  // playGameButton.addEventListener("click", newGame());

  welcomeDiv.append(nameEl, addBtn);
};

renderHome();
