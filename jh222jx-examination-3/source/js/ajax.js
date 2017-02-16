'use strict';

module.exports.request = function(config){
  /* 
     Does the request to the Rest API
     Returns a promise 
  */
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();

    req.addEventListener('load', () => {
      if (req.status != 200){
        reject(req.responseText);
      }
      resolve(req.responseText);
    });
    
    if (config.data !== undefined){
      req.open(config.method, config.url);
      req.setRequestHeader("Content-type", "application/json");      
      req.send(JSON.stringify({'answer': config.data}));
    }
    
    else{
      req.open(config.method, config.url);
      req.send();
    }
  });
}
