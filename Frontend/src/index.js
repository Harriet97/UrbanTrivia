const defCollectionDiv = document.querySelector("#definition-collection");
const welcomeDiv = document.querySelector("#welcome");
const headerDiv = document.querySelector("#header");
const footerDiv = document.querySelector("#footer");
const currentWordEl = document.createElement("h1");
const livesEl = document.createElement("h1");
const scoreEl = document.createElement("h1");
const scoreDiv = document.querySelector("#score");
let score = 0;
let lives = 3;
let game = false;
const addBtn = document.createElement("button");
///TOY TALE

document.addEventListener("DOMContentLoaded", () => {
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    game = !game;
    if (game) {
      newGame();
    }
  });
});


// let random = Math.floor(Math.random() * 3);
const random = () => {
  return Math.floor(Math.random() * 3);
};

// Select Answer Event Listener Function
const selectedAnswer = (event, randomN) => {
  const selctedA = parseInt(event.path[1].id); //hard coding! change later
  let arrEl = randomN + 1;
  //If the answer the user selected is the correct then score++
  if (selctedA == arrEl) {
    score++
  } else if (selctedA != arrEl && lives == 0) {
    // livesEl.innerText = "Game Over! :("
    const gameEl = document.createElement("h1")
    gameEl.innerText = "Game Over! :("
    lives = gameEl.innerText
    currentWordEl.innerText = "End of Game..Thanks for Playing! :)"
    
    //render blank screen
  } else {
    lives--;
  }
  
  
  
  
  // else if (lives = 0) {
  //   const gameEl = document.createElement("h1")
  //   gameEl.innerText = "Game Over! :("
  //   lives = gameEl.innerText
  // }else if (lives = "Game Over! :(") {
  //   currentWordEl.innerText = "End of Game..Thanks for Playing! :)"
  //   definitionEl.innerText = "";
  // }


  defCollectionDiv.innerHTML = ""; //clears page
  footerDiv.innerHTML = ""; //clears scoreEl and livesEl so it can be updates with rerender

  API.getWords().then(words => renderWords(words)); //renders new definitions
  //   }
  // };

  // const renderHome = {
  //   const newGameButton = document.createElement("button")
  //   newGameButton.addEventListener("click", )
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
  scoreDiv.append(scoreEl);
  footerDiv.append(livesEl);
};

const renderWord = (word, id, randomN) => {
  const wordDiv = document.createElement("div");
  // wordDiv.innerHTML = "";
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
  addBtn.innerText = "Play Game";

  // const playGameButton = document.createElement("button");
  // playGameButton.innerText = "Play Game";
  // playGameButton.addEventListener("click", newGame());

  welcomeDiv.append(nameEl, addBtn);
};


renderHome();

