module.exports.save = function(obj){
  /* 
     Save something to localStorage
     Example: {'table': 'highscore', 'data': {'value': 5, 'username': 'someone'}}
   */

  // Get key with name highscore from localStorage
  var data = localStorage.getItem(obj.table || 'default');

  // If there is no key with the name highscore
  if (data === null || (JSON.parse(localStorage.getItem(obj.table || 'default')).length === 0)){
    // Create a new one.
    localStorage.setItem(obj.table, JSON.stringify([obj.data]));
  }
  else{
    // If key exists in localStorage, parse it to JSON
    data = JSON.parse(data);
    // Add new item to the array
    data.push(obj.data);
    // Save the new array as a string in the key data
    localStorage.setItem(obj.table, JSON.stringify(data));
  }
}

module.exports.reset = function(obj){
  /*
     Reset localStorage key
     Example: {'table': 'highscore'}
  */
  localStorage.setItem(obj.table, JSON.stringify([]));
}

module.exports.load = function(obj, sorted=true, reverse=true){
  /*
     Get the localStorage list
     The list can be sorted in both reverser and not reversed.
  */
  let data = JSON.parse(localStorage.getItem(obj.table));

  if (sorted && reverse){
    return data.sort((a,b) =>{
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

  else if (sorted && !(reverse)){
    return data.sort((a,b) =>{
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      if (a.value > b.value) {
        return -1;
      }
      if (a.value < b.value) {
        return 1;
      }
      // a must be equal to b
      return 0;
      //
    }).slice(0, 5);
  }
  
  else{
    return data;
  }
  
}
