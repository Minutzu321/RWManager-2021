import {React, useEffect, useState, useRef} from 'react'
import CustomHeader from '../CustomHeader'
import Navbar from '../Navbar'
import PageHeader from '../PageHeader'
import PageFooter from '../PageFooter'
import Acasa from '../Acasa/Acasa'
import classnames from 'classnames';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import jQuery from 'jquery'
import { w3cwebsocket as W3CWebSocket } from "websocket";

import General from './General'
import Incarca from './Incarca'
import Profil from './Profil'
import Useri from './Useri'
import Admin from './Admin'
import THAdd from './THAdd'
import Casa from './Casa'
import Statie from './Statie'

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const Membru = () => {
  const [log, setLog] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [perm, setPerm] = useState(0);
  const [cred, setCred] = useState(0);
  const [tabs, setTabs] = useState([
    {
      perm: 0,
      tag: 'incarca',
      icon: 'loader_refresh',
      comp: <Incarca mesaj="Se conecteaza la server.."/>,
    }
  ])
  const userRef = useRef()
  const adminRef = useRef()
  const casaRef = useRef()
  const statieRef = useRef()


  function conecteaza(wsr, pk) {
    const client = new W3CWebSocket('wss://'+ window.location.host+'/rw-api/ws/'+wsr+'/');
    let recon = true;
    let connd = false;
    client.onopen = () => {
      connd = true;
      setInterval(() => {
        if(connd){
          client.send(JSON.stringify({
            'comanda': "ping",
            'argumente': "astept un pong.."
          }));
        }
      }, 1000 * 10);
      // setTabs([
      //   {
      //       perm: 0,
      //       tag: 'general',
      //       icon: 'clothes_tie-bow',
      //       comp: <General client={client} pk={pk}/>,
      //   },
      //   {
      //     perm: 0,
      //     tag: 'profil',
      //     icon: 'business_badge',
      //     comp: <Profil client={client} pk={pk}/>,
      //   },
      //   {
      //     perm: 0,
      //     tag: 'useri',
      //     icon:'users_single-02',
      //     comp: <Useri client={client} pk={pk}/>,
      //   },
      //   {
      //     perm: 70,
      //     tag: 'admin',
      //     icon:'ui-1_lock-circle-open',
      //     comp: <Admin client={client} pk={pk}/>,
      //   }
      // ])
      setTabs([
        {
          perm: 0,
          tag: 'useri',
          icon:'users_single-02',
          comp: <Useri client={client} pk={pk} ref={userRef}/>,
        },
        {
          perm: 80,
          tag: 'thadd',
          icon:'location_map-big',
          comp: <THAdd client={client} pk={pk}/>,
        },
        {
          perm: 90,
          tag: 'admin',
          icon:'ui-1_lock-circle-open',
          comp: <Admin client={client} pk={pk} ref={adminRef}/>,
        },
        {
          perm: 100,
          tag: 'casa',
          icon:'business_money-coins',
          comp: <Casa client={client} pk={pk} ref={casaRef}/>,
        }
        ,
        {
          perm: 0,
          tag: 'statie',
          icon:'location_pin',
          comp: <Statie client={client} pk={pk} ref={statieRef}/>,
        }
      ])
    }

    client.onclose = function(e) {
      connd=false;
      if(recon){
        console.log('Socket-ul s-a inchis. Se va incerca reconectarea in 2 secunde..', e.reason);
        setTabs([
          {
            perm: 0,
            tag: 'incarca',
            icon: 'loader_refresh',
            comp: <Incarca mesaj="Se reconecteaza la server.."/>,
          }
        ]);
        setTimeout(function() {
          if(!connd)
            auth(wsr);
        }, 2000);
      }else{
        console.log('Reconectare anulata. Se schimba adresa..');
      }
    }

    client.onerror = function(err) {
      console.error('Eroare la socket: ', err, 'Se inchide socketul..');
      client.close();
    };

    client.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // console.log("MEMBRU",data);

        userRef.current.onmessage(message)
        adminRef.current.onmessage(message)
        casaRef.current.onmessage(message)
        statieRef.current.onmessage(message)

        if(data.comanda == "online" && data.argumente[0] == pk && !data.argumente[1]){
          recon = false;
          client.close();
          auth();
        }
    }
  }

  function auth(){
      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        }
      };
      fetch('https://'+window.location.host+'/rw-api/auth/', requestOptions)
        .then(response => response.json())
        .then(data => {
          setPerm(data.perm);
          setCred(data.cred);
          setLog(data.valid);
          setLoaded(true);

          conecteaza(data.ws, data.pk);
        });
  }

  useEffect(() => {
    auth();
  }, [])

  if(loaded && !log){
    return (
      <BrowserRouter>
        <Redirect to='/'/>
        <Route exact path="/" component={Acasa} />
      </BrowserRouter>
    )
  }
return (
<div className="landing-page sidebar-collapse">
  <CustomHeader titlu="River Wolves"/>
  <Navbar/>
  <div className="wrapper">
    <PageHeader titlu="River Wolves" subtitlu="Team management system"/>
    <div className="main">
        <div className="section section-tabs">
          <div className="container">
            <div className="row">
              <div className="col-md-10 ml-auto col-xl-10 mr-auto ">
                <div className="card">
                  <div className="card-header">
                    <p></p>
                    <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                    {
                      tabs.filter((tab) => (tab.perm <= perm || tab.perm <= cred))
                        .map((tab, index) => (
                          <li className="nav-item">
                            <a {...(index == 0 ? { className: 'nav-link active' } : { className: 'nav-link' })} data-toggle="tab" href={"#"+tab.tag} role="tab">
                                <i className={classnames("now-ui-icons", tab.icon)}></i>
                            </a>
                          </li>
                      ))
                    }
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="tab-content text-center">
                      {
                      tabs.filter((tab) => (tab.perm <= perm || tab.perm <= cred))
                          .map((tab, index) => (
                            <div {...(index == 0 ? { className: 'tab-pane active' } : { className: 'tab-pane' })} id={tab.tag} role="tabpanel">
                                {tab.comp}
                            </div>
                        ))
                      }
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

export default Membru
