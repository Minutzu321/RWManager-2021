import {React, useEffect, useState} from 'react'
import CustomHeader from '../CustomHeader'
import Navbar from '../Navbar'
import PageFooter from '../PageFooter'
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default function RWC() {

    const [audio, setAudio] = useState(null);
    const [playing, setPlaying] = useState(false);
  
    const toggle = () => setPlaying(!playing);
  
    useEffect(() => {
        playing ? audio.play() : audio.pause();
      },
      [playing]
    );
  
    useEffect(() => {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    }, []);
  

  let client;
  let connd = false;


  function conecteaza() {
    client = new W3CWebSocket('wss://'+ window.location.host+'/rw-api/ws_rwc/bp/');
    let mere = true;
    
    client.onopen = () => {
      connd = true;
      mere = true;
      setInterval(() => {
        if(mere){
          client.send(JSON.stringify({
            'comanda': "ping",
            'argumente': ''
          }));
        }
      }, 1000 * 20);
    }

    client.onclose = function(e) {
      connd=false;
      mere=false;
        console.log('Socket-ul s-a inchis. Se va incerca reconectarea in 2 secunde..', e.reason);

      setTimeout(function() {
        conecteaza();
      }, 2000);
    }

    client.onerror = function(err) {
      console.error('Eroare la socket: ', err, 'Se inchide socketul..');
      mere=false;
      client.close();
    };

    client.onmessage = (message) => {
        let data = JSON.parse(message.data);
        console.log(data);
        let cmd = data.comanda;
        let args = data.argumente;



        if(cmd === "play"){
          if(audio == null){
            setAudio(args[0]);
          }
          setPlaying(true);
        }
        if(cmd === "stop"){
          setPlaying(false);
        }
    }
  }

  useEffect(() => {
      conecteaza();
    }, [])

    return (
<div className="landing-page sidebar-collapse">
  <CustomHeader titlu="River Wolves Championship" />
  <Navbar/>
  <div className="wrapper">
    <div className="main">
        <div className="section section-tabs">
          <div className="container">
            <div className="row">
              <div className="col-md-10 ml-auto col-xl-10 mr-auto ">
                <div className="card">
                  <div className="card-header">
                    <p></p>
                    <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                        <li className="nav-item">
                        <a className= 'nav-link active' data-toggle="tab" href="#muzica" role="tab">
                            <i className="now-ui-icons media-2_note-03"></i>
                        </a>
                        </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="tab-content text-center">
                        <div className= 'tab-pane active' id="muzica" role="tabpanel">
                            <h1>Muzica</h1>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PageFooter/>
    </div>
  </div>
</div>
    )
}

