'use strict';
// http://jsfiddle.net/robertc/kKuqH/

var factory = require("./factory");
var chat = require("./chat");
var settings = require("./settings");
var memory = require("./memory");
var cookies = require("./cookies");
var questions = require("./questions");

// This can be very handy!
// Inspects the methods and attributes of an object.
function insp(ins){
  console.log('Type: ' + typeof ins);
  console.log('Methods:');
  for (let m in ins){
    if (typeof ins[m] == 'function'){
      console.log(ins[m]);
    }
  }

  console.log('Attributes:');
  console.log(JSON.stringify(ins, null, 4));
}


document.pwdDataObj = {
  // This object is attached to the document object, BAD JOHN!
  navigationSel: 0,
  navigationSelId: '',
  dragNDropdDivId: '',
  openApplications: [],
  username: 'NSA, World Police',

  closeApplication: (appWindowId) => {
    // Get the parent element
    let parent = document.querySelector('#desktop');
    // Get the child element
    let child = document.querySelector('#' + appWindowId);
    // If we cant find parent or child
    if (child !== null && parent !== null){
      parent.removeChild(child);
    }
    else {
      console.log('Cant find child: ' + appWindowId);
    }
    // Remove from openApplications list
    let index = document.pwdDataObj.openApplications.indexOf(appWindowId);
    if (index > -1) {
      document.pwdDataObj.openApplications.splice(index, 1);
    }
    else{
      console.log('Could not remove from openApplications list');
    }
  }
}


document.querySelector('#btnabout').addEventListener('click', (event) => {
  let newd = document.createElement('div');
  let newt = document.createTextNode('This is a PWD application made by John Herrlin.');
  newd.appendChild(newt);

  let d = factory.createDraggableDiv(newd);
  document.querySelector('#desktop').appendChild(d.content);
  document.pwdDataObj.openApplications.push(d.appWindowId);
});


document.querySelector('#btnchat').addEventListener('click', (event) => {
  let d = factory.createDraggableDiv(chat.chat());
  document.querySelector('#desktop').appendChild(d.content);
  document.pwdDataObj.openApplications.push(d.appWindowId);
});


document.querySelector('#btnsettings').addEventListener('click', (event) => {
  let d = factory.createDraggableDiv(settings.settings());
  document.querySelector('#desktop').appendChild(d.content);
  document.pwdDataObj.openApplications.push(d.appWindowId);
});


document.querySelector('#btnmem').addEventListener('click', (event) => {
  let d = factory.createDraggableDiv(memory.memory());
  document.querySelector('#desktop').appendChild(d.content);
  document.pwdDataObj.openApplications.push(d.appWindowId);
});

document.querySelector('#btnquestion').addEventListener('click', (event) => {
  let d = factory.createDraggableDiv(questions.questions());
  document.querySelector('#desktop').appendChild(d.content);
  document.pwdDataObj.openApplications.push(d.appWindowId);
  questions.startGame();
});


function drop(event) {
  let mouseOffset = event.dataTransfer.getData("text/plain").split(',');
  var dm = document.querySelector('#' + document.pwdDataObj.dndDivId);
  dm.style.left = (event.clientX + parseInt(mouseOffset[0],10)) + 'px';
  dm.style.top = (event.clientY + parseInt(mouseOffset[1],10)) + 'px';
  dm.style.display = 'block';  
  event.preventDefault();
  return false;
}



document.body.addEventListener('drop', drop, false);
document.body.addEventListener('dragleave', drop, false); 
document.body.addEventListener('dragover', (event) => {
  var dm = document.querySelector('#' + document.pwdDataObj.dndDivId);
  dm.style.display = 'none';  
  event.preventDefault(); 
  return false; 
});

(() => {
  /*
    Application init function.
  */
  console.log('Application init.');


  // Allowing cookies?
  if (cookies.isCookiesAccepted() === false){
    cookies.acceptCookiesTemplate();
  }

  var username = localStorage.getItem('username');
  
  if (username == null){
    let d = factory.createDraggableDiv(settings.settings());
    console.log(d.content);
    let firstTime = document.createElement('h2');
    let firstTimeText = document.createTextNode('Welcome! Please set a username!');
    firstTime.appendChild(firstTimeText);
    d.content.appendChild(firstTime);
    document.querySelector('#desktop').appendChild(d.content);
    document.pwdDataObj.openApplications.push(d.appWindowId);
    
    //localStorage.setItem('username', document.pwdDataObj.username);
  }
  else {
    document.pwdDataObj.username = username;
  }

})()

document.body.addEventListener('keypress', (event) => {
  // Next
  if (event.key === 'n'){
    let workon = document.querySelector('#'+document.pwdDataObj.dndDivId);
    let memboard = workon.children[1].children[0].children[1];
    if (memboard.id === 'memoryGameBoard'){
      memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'none';
      document.pwdDataObj.navigationSel = (document.pwdDataObj.navigationSel + 1) % 12;
      memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'dotted';
      document.pwdDataObj.navigationSelId = memboard.children[document.pwdDataObj.navigationSel].id;
      while (document.querySelector('#'+document.pwdDataObj.navigationSelId).style['background-color'] === 'grey'){
        memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'none';
        document.pwdDataObj.navigationSel = (document.pwdDataObj.navigationSel + 1) % 12;
        memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'dotted';
        document.pwdDataObj.navigationSelId = memboard.children[document.pwdDataObj.navigationSel].id;
      }
    }
    
  }
  // Prec
  if (event.key === 'p'){
    let workon = document.querySelector('#'+document.pwdDataObj.dndDivId);
    let memboard = workon.children[1].children[0].children[1];
    if (memboard.id === 'memoryGameBoard'){
      memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'none';
      document.pwdDataObj.navigationSel = (document.pwdDataObj.navigationSel === 0) ? document.pwdDataObj.navigationSel=11 : document.pwdDataObj.navigationSel - 1;
      memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'dotted';
      document.pwdDataObj.navigationSelId = memboard.children[document.pwdDataObj.navigationSel].id;
      while (document.querySelector('#'+document.pwdDataObj.navigationSelId).style['background-color'] === 'grey'){
        memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'none';
        document.pwdDataObj.navigationSel = (document.pwdDataObj.navigationSel === 0) ? document.pwdDataObj.navigationSel=11 : document.pwdDataObj.navigationSel - 1;
        memboard.children[document.pwdDataObj.navigationSel].style['border-style'] = 'dotted';
        document.pwdDataObj.navigationSelId = memboard.children[document.pwdDataObj.navigationSel].id;
      }
    }
  }
});
