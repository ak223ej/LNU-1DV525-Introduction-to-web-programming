'use strict';

var _idsCounter = 1;  // Create unique ids for desktop windows.

function getNewId(){
  let id = _idsCounter;
  _idsCounter += 1;
  return id;
}

module.exports.createDraggableDiv = function(app){
  /*
     Argument: app, a div containing an app
     What are we doing here?
     Create a div that can be moved around on the desktop.
     Add the app inside of the 'draggable' div and return.
  */
  let id = getNewId();
  let appWindowId = 'appWindowId' + id;
  let dragDiv = document.createElement('div');

  dragDiv.id = appWindowId;  // New div with unique id
  dragDiv.className = 'draggable';
  dragDiv.setAttribute('draggable', 'true');
  //dragDiv.setAttribute('tabindex', id.toString())

  let dragDivHeader = document.createElement('div');
  dragDivHeader.style['background-color'] = 'red';
  dragDivHeader.id = 'appWindowIdHeader' + id;
  dragDivHeader.className = 'draggableheader';
  
  let dragDivBody = document.createElement('div');  // In here goes the app div
  dragDivBody.id = 'appWindowIdBody' + id;
  dragDivBody.className = 'draggablebody';
  // Append app
  dragDivBody.appendChild(app);
  

  // Events
  dragDiv.addEventListener('mouseenter', (event) => {
    document.pwdDataObj.dndDivId = appWindowId;
    event.target.style['z-index'] = 99;

  });

  dragDiv.addEventListener('mouseleave', (event) => {
    event.target.style['z-index'] = 1;
  });

  dragDiv.addEventListener('dragstart', (event) => {
    //document.pwdDataObj.dndDivId = '#appWindowId' + id;  // Set the selected element id to our var
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
                               (parseInt(style.getPropertyValue("left"),10) - event.clientX) +
                               ',' +
                               (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    event.dataTransfer.effectAllowed = 'move';
  });

  dragDivHeader.addEventListener('click', (event) => {
    document.pwdDataObj.closeApplication(appWindowId);
  });

  dragDiv.appendChild(dragDivHeader);
  dragDiv.appendChild(dragDivBody);


  return {appWindowId: 'appWindowId' + id, content: dragDiv};
}

