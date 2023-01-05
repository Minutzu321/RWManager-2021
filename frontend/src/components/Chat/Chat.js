import React, {useEffect} from 'react'
import CustomHeader from '../CustomHeader'
import { w3cwebsocket as W3CWebSocket } from "websocket";

const Acasa = () => {
    const client = new W3CWebSocket('ws://'+ window.location.host+'/ws/chat/chtrm/');
    useEffect(() => {
        client.onopen = () => {
            document.querySelector('#tm-input').focus();
            document.querySelector('#tm-input').onkeyup = function(e) {
                if (e.keyCode === 13) {
                    document.querySelector('#tm-submit').click();
                }
            };
        }
        client.onmessage = (message) => {
            const data = JSON.parse(message.data);
            document.querySelector('#tm-log').value += (data.message + '\n');
        }
    })
    function send(e) {
        e.preventDefault();
        const inputDOM = document.querySelector('#tm-input');
        const message = inputDOM.value;
        client.send(JSON.stringify({
            'message': message
        }));
        inputDOM.value = '';
    }
  return (
    <div>
      <CustomHeader titlu= "Chat"/>
      <textarea id="tm-log" cols="100" rows="20"/>
      <input id="tm-input" type="text" size="100"/>
      <button onClick={send} id="tm-submit">Trimite</button>
    </div>
  )
}

export default Acasa
