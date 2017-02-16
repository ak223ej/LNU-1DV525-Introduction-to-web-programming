'use strict';

var timeCount = 0,
    interval;

var per = require("./persistence");

function sleep (time) {
  // http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  return new Promise((resolve) => setTimeout(resolve, time));
}

var Singleton = (function () {
  // http://www.dofactory.com/javascript/singleton-design-pattern
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
  
  function* idMaker(){
    var index = 0;
    while(true)
      yield index++;
  }

  var instance = idMaker();
  
  return {
    getId: function () {
      return instance.next();
    }
  };  
})();

function startTimer(){
  /*
     Starts the timer.
     The timer asks a generator for a new value each second.
     If timer is done, stop timer and call endGame.
  */
  interval = setInterval( () => {
    timeCount += 1;
  }, 1000);
}

function stopTimer(){
  /*
     Stops the timer.
  */
  clearInterval(interval);
}

function showHighscore(div, reset=false){
  /*
    Show highscore in memory div.
    Reset is set to true when the btn reset calls the function.
  */
  try{
    while (div.firstElementChild) {
      div.removeChild(div.firstElementChild);
    }
  }
  catch(e){
    console.log(e);
  }
  div.setAttribute('align', 'center');

  if (reset === false){
    var header = document.createElement('h2');
    var headerText = document.createTextNode('Good work!');
    header.appendChild(headerText);

    var time = document.createElement('h3');
    var timeText = document.createTextNode('You finshed in: ' + timeCount.toString() + ' sec');
    time.appendChild(timeText);
  }
  
  var hr = document.createElement('hr');
  
  let highscoreTitle = document.createElement('h3');
  var highscoreTitleText = document.createTextNode('Highscore:');
  highscoreTitle.appendChild(highscoreTitleText);

  var highscoreList = document.createElement('div');
  var highscore = per.load({'table': 'memhighscore'});
  if (highscore.length > 0){
    highscore.forEach( (h) => {
      var highscoreItem = document.createElement('p');
      highscoreItem.appendChild(document.createTextNode(h.username + ' : ' + h.value.toString()));
      highscoreList.appendChild(highscoreItem);
    });
  }
  else{
    var highscoreItem = document.createElement('p');
    highscoreItem.appendChild(document.createTextNode('Empty!'));
    highscoreList.appendChild(highscoreItem);
  }

  var resetBtn = document.createElement('button');
  var resetBtnText = document.createTextNode('Reset highscore');
  resetBtn.appendChild(resetBtnText);

  resetBtn.addEventListener('click', (event) => {
    per.reset({'table': 'memhighscore'});
    showHighscore(div, reset=true);
  });

  if (reset === false){
    div.appendChild(header);
    div.appendChild(time);
    div.appendChild(hr);
  }
  div.appendChild(highscoreTitle);
  div.appendChild(highscoreList);
  div.appendChild(hr);
  div.appendChild(resetBtn);  
}

module.exports.memory = function(){
  const obj = {
    
    selected: [],
    done: [],
    select: function(id){
      /*
        Function for handeling a selected item in 
        memory game.

        Returns:
        -1, Turn is over
         0, Select one more
         1, Match found
         2, Game end
      */

      if (this.selected.length === 0){
        this.selected.push(id);
        return {'return': 0};
      }
      
      else if(this.selected.length === 1){
        // If there is a match
        if (this.selected[0][0] == id[0]){
          this.done.push(this.selected[0]);
          this.done.push(id);
          // Change color on the div
          [].forEach.call([this.selected[0], id], (i) => {
            let a = document.querySelector('#'+i);
            a.style['background-color'] = 'grey';
            a.removeChild(a.firstElementChild);
          });

          this.selected.pop();

          if (this.done.length === 12){
            // Game end
            per.save({
              'table': 'memhighscore',
              'data': {
                'username': document.pwdDataObj.username,
                'value': timeCount
              }
            });
            showHighscore(main);
            console.log('saving...');
            return {'return': 2};
          }
          else{
            // Match found
            return {'return': 1};
          }
        }
        // If there is no match
        else{
          // Remove from selected
          return {'return':-1, 'list': [this.selected.pop(), id]};
        }
      }
      return {'return': 2};
    }
  }

  let pieces = [{name: 'a1', color: '#f44242'},
                {name: 'a2', color: '#f48342'},
                {name: 'b1', color: '#f4cb42'},
                {name: 'b2', color: '#ebf442'},
                {name: 'c1', color: '#9ef442'},
                {name: 'c2', color: '#42f498'},
                {name: 'd1', color: '#42f4e8'},
                {name: 'd2', color: '#428ff4'},
                {name: 'e1', color: '#4242f4'},
                {name: 'e2', color: '#bf42f4'},
                {name: 'f1', color: '#f442cb'},
                {name: 'f2', color: '#f44242'}];
  
  let main = document.createElement('div');
  main.id = 'memoryBoard';
  
  let scoreBoard = document.createElement('div');
  scoreBoard.id = 'memoryScoreBoard';

  let gameBoard = document.createElement('div');
  gameBoard.id = 'memoryGameBoard';
  gameBoard.setAttribute('tabindex', '0')

  pieces.forEach( (piece) => {
    let pieceDiv = document.createElement('div');
    pieceDiv.id = piece.name + Singleton.getId().value;
    pieceDiv.classList.add('memoryGamePiece');
    pieceDiv.setAttribute('data-color', piece.color);
    pieceDiv.style['background-color'] = piece.color;
    
    gameBoard.appendChild(pieceDiv);
  });

  gameBoard.addEventListener('keypress', (event) => {
    if (event.key === 'Enter'){
      // Turn on the item
      let item = document.querySelector('#' + document.pwdDataObj.navigationSelId);
      item.style['background-color'] = 'white';
      item.setAttribute('align', 'center');
      let itemH = document.createElement('h1');
      let itemText = document.createTextNode(document.pwdDataObj.navigationSelId[0].toUpperCase());
      itemH.appendChild(itemText);
      item.appendChild(itemH);
      
      let ret = obj.select(document.pwdDataObj.navigationSelId);
      // If no match
      if (ret.return === -1){
        sleep(3000).then(()=>{
          ret.list.forEach((e) => {
            let item = document.querySelector('#'+e);
            item.style['background-color'] = item.getAttribute('data-color');
            //item.removeChild();
            item.removeChild(item.firstElementChild);
            //
          });
        });
      }
      
    }
  });

  gameBoard.addEventListener('mouseenter', (event) => {
    console.log('Mouse enter gameBoard');
    console.log(event.target);
    event.target.focus();
  });

  gameBoard.addEventListener('click', (event) => {
    let isInDone = (obj.done.indexOf(event.target.id) === -1) ? false : true;

    console.log(event.target);

    event.target.focus();

    // If event.target.id is not in obj.done list
    if ((!isInDone) && (event.target.id !== obj.selected[0]) && (event.target.classList.contains('memoryGamePiece'))){
      // Turn on the item
      let item = document.querySelector('#'+event.target.id);
      item.style['background-color'] = 'white';
      item.setAttribute('align', 'center');
      let itemH = document.createElement('h1');
      let itemText = document.createTextNode(event.target.id[0].toUpperCase());
      itemH.appendChild(itemText);
      item.appendChild(itemH);
      
      let ret = obj.select(event.target.id);
      // If no match
      if (ret.return === -1){
        sleep(3000).then(()=>{
          ret.list.forEach((e) => {
            let item = document.querySelector('#'+e);
            item.style['background-color'] = item.getAttribute('data-color');
            //item.removeChild();
            item.removeChild(item.firstElementChild);
            //
          });
        });
      }
    }
    
  });


  main.addEventListener('mouseenter', (event) => {
    try{
      let workon = document.querySelector('#'+document.pwdDataObj.dndDivId);
      let memboard = workon.children[1].children[0].children[1];
      console.log(memboard)
      if (memboard.id === 'memoryGameBoard'){
        memboard.children[0].style['border-style'] = 'dotted';
        document.pwdDataObj.navigationSelId = memboard.children[0].id;
        document.pwdDataObj.navigationSel = 0;
        // console.log(document.pwdDataObj.dndDivId);
        console.log('Enter keyup');
      }
    }
    catch(e){
      console.log(e);
    }
  });

  main.addEventListener('mouseleave', (event) => {
    let item = document.querySelector('#'+document.pwdDataObj.navigationSelId);
    item.style['border-style'] = 'none';
  });
  
  main.appendChild(scoreBoard);
  main.appendChild(gameBoard);

  startTimer();
  
  return main;
}
