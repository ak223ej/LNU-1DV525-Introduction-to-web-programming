
module.exports.isCookiesAccepted = () => {
  /*
     Is cookies accepted
     Check in local storage if there is a key named acceptingCookies
     that has the value of true.
     
     Returns: true or false
  */
  
  // Get key with name highscore from localStorage
  var highscore = localStorage.getItem('acceptingCookies');

  // If there is no key with the name highscore
  if (highscore === null || (JSON.parse(localStorage.getItem('acceptingCookies')) === false)){
    return false;
  }
  else {
    return true;
  }
}

module.exports.acceptCookiesTemplate = () => {
  /*
     Accept cookies template
     Adds the template to the DOM.
     Btn that sets the value of acceptingCookies to true in localStorage.
  */
  
  let cookiesTemplate = document.querySelector('#acceptcookietemplate');
  // Import template node with deep copy true
  let template = document.importNode(cookiesTemplate.content, true);

  template.firstElementChild.children[2].addEventListener('click', (event) => {
    // Dont reload page on submit
    event.preventDefault();
    
    localStorage.setItem('acceptingCookies', JSON.stringify(true));

    document.location.reload(true);
  })

  document.querySelector('main').appendChild(template);
}
