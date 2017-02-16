'use strict';

module.exports.settings = function(){

  let main = document.createElement('div');
  main.setAttribute('align', 'center');
  // Username
  let usernameHeader = document.createElement('p');
  let usernameHeaderText = document.createTextNode('Username');
  usernameHeader.appendChild(usernameHeaderText);
  
  let usernameInput = document.createElement('input');
  usernameInput.setAttribute('type', 'text');
  usernameInput.id = 'settingsusername';

  usernameInput.value = localStorage.getItem('username') || '';


  let usernameBtn = document.createElement('button');
  let usernameBtnText = document.createTextNode('Save username');
  usernameBtn.appendChild(usernameBtnText);

  usernameBtn.addEventListener('click', (event) => {
    if ( usernameInput.value.length > 0 ){
      document.pwdDataObj.username = usernameInput.value;
      localStorage.setItem('username', document.pwdDataObj.username);
    }
  });

  // Add to settings
  main.appendChild(usernameHeader);  
  main.appendChild(usernameBtn);
  main.appendChild(usernameInput);
  
  return main;
}
