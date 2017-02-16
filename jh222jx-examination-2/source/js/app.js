'use strict';

var cookies = require("./cookies");
var ajax = require("./ajax");
var ui = require("./ui");

// -------------------- Global Vars --------------------
var nextUrl = 'http://vhost3.lnu.se:20080/question/1',
    // If there is choices in the questions.
    isAlternatives = false,
    // Where the generator starts.
    timerValue = 20,
    // username
    username = '',
    // Generates numbers from timerValue down to 0.
    timeGenerator = genNumber(),
    // Users total working time.
    totalTime = 0,
    // Variable for setInterval function, used here to
    // be able to clear it.
    interval;

 
// -------------------- END Global Vars --------------------

function insp(ins){
  /* 
     Inspects the methods and attributes of an object.
     Only used for debug/learning
  */
  console.log('Methods:');
  for (let m in ins){
    if (typeof ins[m] == 'function'){
      console.log(ins[m]);
    }
  }
  console.log('Attributes:');
  console.log(JSON.stringify(ins, null, 4));
}

function* genNumber(){
  /* 
     Generator for timer values 
  */
  while (timerValue != 0){
    timerValue -= 1;
    var reset = yield timerValue;
    if (reset){
      timerValue = 20;
    }
  }
}

function startTimer(){
  /*
     Starts the timer.
     The timer asks a generator for a new value each second.
     If timer is done, stop timer and call endGame.
  */
  interval = setInterval( () => {
    let timertext = document.querySelector('#timer');
    let timeleft = timeGenerator.next();
    if (timeleft.done === true){
      // Call end game
      endGame();
    }
    else{
      timertext.textContent = username + ' - Timeleft ' + timeleft.value;
    }
  }, 1000);
}

function stopTimer(){
  /*
     Stops the timer.
  */
  clearInterval(interval);
}

function resetTimer(){
  /*
     Reset timer.
  */
  timerValue = 20;
}

function getQuestion(){
  /* 
     Get question 
     Call request to get a question.
     The promise is done check what type of answer input it is
     call the function that have the right form for the question.
  */
  ajax.request({method: 'get', url: nextUrl})
    .then( data => {
      var data = JSON.parse(data);
      nextUrl = data.nextURL;
      if (data.alternatives === undefined){
        isAlternatives = false;
        ui.removeFormIfExists('#formplace', 'form');
        ui.setInputForm(data);
        //console.log(JSON.stringify(data, null, 4));
      }
      else{
        isAlternatives = true;
        ui.removeFormIfExists('#formplace', 'form');
        ui.setSelectForm(data);
      }
    })
    .catch( error => {
      console.log(error);
    });
}

function sendAnswer(answer){
  /* 
     Send answer 
     Sends the answer to request and when promise is done
     get a new question if there is a nextURL in the answer respons.
  */
  ajax.request({method: 'post', url: nextUrl, data: answer})
  .then( data => {
    var data = JSON.parse(data);
    //console.log(JSON.stringify(data, null, 4));
    totalTime += (20 - timerValue);
    resetTimer();
    if (data.nextURL){
      nextUrl = data.nextURL;
      ui.setHeaderText('Good work! But not done yet!');      
      getQuestion();
    }
    else{
      addHighscore(username, totalTime);
      endGame();
    }
  })
  .catch( error => {
    ui.setHeaderText(JSON.parse(error).message);
  });
}

function getHighscore(){
  /*
     Get the highscore list, sorted and sliced.
  */
  let highscore = JSON.parse(localStorage.getItem('highscore'));
  return highscore.sort((a,b) =>{
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    // a must be equal to b
    return 0;
    //
  }).slice(0, 5);
}

function addHighscore(username, value){
  /* 
     Adds highscore to localStorage
     username = str
     value = int
   */

  // Get key with name highscore from localStorage
  var highscore = localStorage.getItem('highscore');

  // If there is no key with the name highscore
  if (highscore === null || (JSON.parse(localStorage.getItem('highscore')).length === 0)){
    // Create a new one.
    localStorage.setItem('highscore', JSON.stringify([{'username': username, 'value': value}]));
  }
  else{
    // If key exists in localStorage, parse it to JSON
    highscore = JSON.parse(highscore);
    // Add new item to the array
    highscore.push({'username': username, 'value': value});
    // Save the new array as a string in the key highscore
    localStorage.setItem('highscore', JSON.stringify(highscore));
  }
}

function resetHighscore(){
  localStorage.setItem('highscore', JSON.stringify([]));
  endGame();
}

function showHighscore(){
  /*
     Show highscore.
     Get the template and localStorage and add it to the DOM.
  */
  
  // Get template
  let highTemplate = document.querySelector('#highscoretemplate');
  // Import template node with deep copy true
  let template = document.importNode(highTemplate.content, true);
  // Create main element
  let main = document.createElement('main');
  main.setAttribute('align', 'center');

  let highscore = getHighscore();
  
  if (highscore.length == 0){
    let p = document.createElement('p');
    // Set text in p element
    p.appendChild(document.createTextNode('Highscore is empty!'));
    // Add element to template node
    template.appendChild(p);
  }
  else{
    // Get highscore and iterate over it.
    highscore.forEach( obj => {
      // Create new p element
      let p = document.createElement('p');
      // Set text in p element
      p.appendChild(document.createTextNode(obj.username + ':' + obj.value));
      // Add element to template node
      template.appendChild(p);
    })
  }
  let reloadBtn = document.createElement('button');
  reloadBtn.setAttribute('align', 'center');
  let reloadBtnText = document.createTextNode('Play Again!');
  reloadBtn.appendChild(reloadBtnText);
  reloadBtn.addEventListener('click', (event) => document.location.reload(true));
  template.appendChild(reloadBtn);

  let resetHighScoreBtn = document.createElement('button');
  resetHighScoreBtn.setAttribute('align', 'center');
  let resetHighScoreBtnText = document.createTextNode('Rest highscore!');
  resetHighScoreBtn.appendChild(resetHighScoreBtnText);
  resetHighScoreBtn.addEventListener('click', (event) => resetHighscore());
  template.appendChild(resetHighScoreBtn);

  // Add to DOM
  document.querySelector('body').appendChild(main).appendChild(template);
}

(() => {
  /*
     Init game.
     Add the init template. 
     When nickname is set and btn clicker, 
     remove its own template and call startGame
  */
  // Allowing cookies?
  if (cookies.isCookiesAccepted() === false){
    cookies.acceptCookiesTemplate();
  }
  else{
    let starttemplate = document.querySelector("#starttemplate");
    let clone = document.importNode(starttemplate.content, true);
    document.querySelector("main").appendChild(clone);
    let form = starttemplate.content.firstElementChild
    
    var initbtn = document.querySelector('#initbtn');
    initbtn.addEventListener('click', (event) => {
      // Dont reload page on submit
      event.preventDefault();
      
      let form = document.querySelector('form');
      let inputText = form.children[1].value;
      if (inputText.length > 0){
        username = inputText;
        ui.removeFormIfExists('main', 'form');
        ui.setHeaderText('Game is on!');   
        startGame();
      }
      else {
        ui.setHeaderText('Enter a username!');
      }
    });
  }
})();

function startGame(){
  /*
     Start game
  */
  
  // Add the game template
  let gametemplate = document.querySelector("#gametemplate");
  document.querySelector("main").appendChild(document.importNode(gametemplate.content, true));
  
  // Start application with asking for a question
  getQuestion();

  // Start counting timer.
  startTimer();
  
  var btn = document.querySelector('#btn');
  btn.addEventListener('click', (event) => {

    if (isAlternatives){
      let select = document.querySelector('#alternatives');
      let value = select.options[select.selectedIndex].value;
      
      sendAnswer(value);
    }
    else {
      let value = document.querySelector('form').children[1].value
      if (value.length > 0){
        sendAnswer(value);
      }
      else{
        setHeaderText('Please enter a answer!');
      }
    }
  });
}

function endGame(){
  /*
     End game.
     Remove content from DOM and call showHighScore.
  */
  stopTimer();
  console.log('Game ended');
  ui.removeFormIfExists('body', 'main');
  showHighscore();
}
