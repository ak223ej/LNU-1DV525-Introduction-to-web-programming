'use strict';

module.exports.chat = function(){
  let socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
  
  let main = document.createElement('div');  
  let messages = document.createElement('div');
  messages.id = 'chatMessages';

  let inputArea = document.createElement('div');

  let sendBtn = document.createElement('button');
  let sendBtnText = document.createTextNode('Send');
  sendBtn.appendChild(sendBtnText);
  let inputText = document.createElement('input');
  inputText.setAttribute('type', 'text');

  socket.addEventListener('open', (event) => {
    console.log('Socket is open');
  });

  sendBtn.addEventListener('click', (event) => {
    if (inputText.value.length > 0){
      socket.send(JSON.stringify(
        {
          'type': 'message',
          'data' : inputText.value,
          'username': document.pwdDataObj.username,
          // 'channel': 'linuxchannel',
          'channel': 'my, not so secret, channel',        
          'key': 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        }      
      ))

      inputText.value = '';
    }
  });

  socket.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);
    
    // if ( data.channel === 'linuxchannel' && data.type === 'message'){
    if (data.type === 'message'){
      let message = document.createElement('p');
      let messageText = document.createTextNode(data.username + ': ' + data.data);
      message.appendChild(messageText);
      messages.appendChild(message);
    }
    // else {
    //   console.log(data);
    // }
    
  });

  inputArea.appendChild(sendBtn);
  inputArea.appendChild(inputText);
  main.appendChild(messages);
  main.appendChild(inputArea);
  return main;
}
