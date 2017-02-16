module.exports.setHeaderText = function(text){
  /* 
     Set header text
  */
  document.querySelector('#headertext').textContent = text;
}

module.exports.setInputForm = function(data){
  /* 
     Set Input Form.
     This function adds the input form to the DOM 
  */
  let inputFormTemplate = document.querySelector('#inputform');
  let theForm = inputFormTemplate.content.firstElementChild;
  theForm.firstElementChild.textContent = data.question;
  let template = document.importNode(inputFormTemplate.content, true);
  document.querySelector('#formplace').appendChild(template);
}

module.exports.setSelectForm = function(data){
  /* 
     Set Select Form.
     Form template for selection
     data is the json obj from the Rest API
  */
  let inputSelectTemplate = document.querySelector('#selectform');
  let theForm = inputSelectTemplate.content.firstElementChild;
  theForm.firstElementChild.textContent = data.question;
  let select = theForm.children[1];

  if (select.length > 0){
    // https://siongui.github.io/2012/09/26/javascript-remove-all-children-of-dom-element/
    while (select.hasChildNodes()){
      select.removeChild(select.lastChild);
    }
  }
  for (let a in data.alternatives){
    let option = document.createElement('option');
    option.setAttribute('value', a);
    option.appendChild(document.createTextNode(data.alternatives[a]));
    select.appendChild(option);
  } 
  let template = document.importNode(inputSelectTemplate.content, true);
  document.querySelector('#formplace').appendChild(template);
}

module.exports.removeFormIfExists = function(p, c){
  /* 
     Removes the form if it exists
     p = Parent node
     c = Child node 
  */

  // Get the parent element
  let parent = document.querySelector(p);
  // Get the child element
  let child = document.querySelector(c);
  // If we cant find parent or child
  if (child !== null && parent !== null){
    parent.removeChild(child);
  }
  else {
    console.log('Cant fint either parent: ' + p + ' or child: ' + c);
  }
}
