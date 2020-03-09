const defCollectionDiv = document.querySelector("#definition-collection");
const welcomeDiv = document.querySelector("#welcome");
const headerDiv = document.querySelector("#header");
const footerDiv = document.querySelector("#footer");
const scoreDiv = document.querySelector("#score");
const leaderboardDiv = document.querySelector("#leaderboard");
const currentWordEl = document.createElement("h1");
const livesEl = document.createElement("h1");
const scoreEl = document.createElement("h1");
const timer = document.createElement("button");
timer.setAttribute("id", "counter");
timer.className = "timer";
const addBtn = document.createElement("button");
addBtn.className = "game";
let score = 0;
let lives = 3;
let game_id = null;
let user_id = null;

//TIMER:
function countdown() {
  let seconds = 90;
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

// starting game
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

//get scores
const renderScores = scores => {
  const scoreTable = document.createElement("table");
  const scoreHeader = document.createElement("thead");
  const scoreHeaderEl = document.createElement("tr");
  const scoreHeaderUserEl = document.createElement("th");
  scoreHeaderUserEl.innerText = "Username";
  const scoreHeaderScoreEl = document.createElement("th");
  scoreHeaderScoreEl.innerText = "Score";
  const scoreBody = document.createElement("tbody");

  // const rowUserEl = document.createElement("td");
  // const rowScoreEl = document.createElement("td");

  scores.forEach(score => {
    const scoreRowEl = document.createElement("tr");
    const rowUserEl = document.createElement("td");
    const rowScoreEl = document.createElement("td");
    (rowUserEl.innerText = score.user.username),
      (rowScoreEl.innerText = score.game.scored);
    scoreRowEl.append(rowUserEl, rowScoreEl);
    scoreBody.append(scoreRowEl);
  });

  scoreHeaderEl.append(scoreHeaderUserEl, scoreHeaderScoreEl);
  scoreHeader.append(scoreHeaderEl);
  scoreTable.append(scoreHeader, scoreBody);
  leaderboardDiv.append(scoreTable);
};

// const renderScoreInfo = score => {

// };

// Game over screen
const gameOver = () => {
  API.getScores().then(scores => renderScores(scores));
  gameSubmit();
  timer.remove();
  livesEl.remove();
  currentWordEl.innerText = "Game over..Thanks for Playing! :)";
  defCollectionDiv.innerHTML = ""; //clears page
  scoreEl.innerHTML = `Your final score is: ${score}`;
  const timesUpEl = document.createElement("h1");
  const userForm = document.createElement("form");
  const inputForm = document.createElement("input");
  const instructionEl = document.createElement("h2");
  const formBtn = document.createElement("button");
  formBtn.className = "form";
  timesUpEl.innerText = "Time's up!";
  instructionEl.innerText = "Enter your name to save your score!";
  inputForm.setAttribute("type", "text");
  inputForm.setAttribute("name", "username");
  inputForm.setAttribute("value", "");
  inputForm.setAttribute("placeholder", "Enter your name...");
  inputForm.className = "input-text";
  formBtn.innerText = "save score";
  userForm.addEventListener("submit", handleFormSubmit);
  userForm.append(timesUpEl, instructionEl, inputForm, formBtn);
  defCollectionDiv.append(userForm);
  scoreDiv.append(scoreEl);
};

// Select Answer Event Listener Function
const clear = () => {
  defCollectionDiv.innerHTML = "";
  footerDiv.innerHTML = "";
};

const selectedAnswer = (event, randomN) => {
  const selctedA = parseInt(event.path[1].id); //hard coding! change later
  let arrEl = randomN + 1;
  if (selctedA == arrEl) {
    score++;
    clear();
    API.getWords().then(words => renderWords(words));
  } else if (selctedA != arrEl && lives == 0) {
    gameOver();
    timer.remove();
    livesEl.remove();
  } else {
    lives--;
    clear();
    API.getWords().then(words => renderWords(words));
  }
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

//Home

const renderHome = () => {
  const nameEl = document.createElement("h1");
  nameEl.innerText = "Urban Trivia";
  nameEl.className = "bounce";
  addBtn.innerText = "Play Game";
  welcomeDiv.append(nameEl, addBtn);
};

// NEW POST REQUEST USER, SCORE, GAME
const handleFormSubmit = event => {
  event.preventDefault();
  let scoreObj = null;
  const username = event.target.elements.username;
  const newUser = constructUserObject(username.value);
  gameSubmit().then(() =>
    API.postUser(newUser)
      .then(assignUser)
      .then(() => {
        event.target.reset();
      })
      .then(() => (scoreObj = constructScoreObject()))
      .then(scoreOb => API.postScore(scoreOb))
  );
};

const constructUserObject = username => {
  return {
    username: username
  };
};

const assignUser = user => {
  user_id = user.id;
};

const constructScoreObject = () => {
  return {
    user_id: user_id,
    game_id: game_id
  };
};

//Game submit
const gameSubmit = () => {
  const scored = score;
  const newGame = constructGameObject(scored);
  return API.postGame(newGame).then(game => (game_id = game.id));
  // console.log(test)
};

//CONSTRUCT GAME OBJECT
const constructGameObject = scored => {
  return {
    scored
  };
};

//Post Request
const postConfig = obj => {
  return config("POST", obj);
};

const patchConfig = obj => {
  return config("PATCH", obj);
};

const config = (method, obj) => {
  return {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(obj)
  };
};

// API request
const jsonify = response => response.json();
const URL = "http://api.urbandictionary.com/v0/random";
const gameURL = "http://localhost:3000/games";
const userURL = "http://localhost:3000/users";
const scoreURL = "http://localhost:3000/scores";
const API = {
  getWords: () => fetch(URL).then(jsonify),
  postGame: game => fetch(gameURL, postConfig(game)).then(jsonify),
  postUser: user => fetch(userURL, postConfig(user)).then(jsonify),
  postScore: score => fetch(scoreURL, postConfig(score)).then(jsonify),
  getScores: () => fetch(scoreURL).then(jsonify)
};
const newGame = () => {
  API.getWords().then(words => renderWords(words));
};

renderHome();
