import {React, useEffect, useState} from 'react'
import CustomHeader from '../CustomHeader'
import PageFooter from '../PageFooter'
import classnames from 'classnames';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import jQuery from 'jquery'
import Sponsori from '../Sponsori';
import QrReader from 'react-qr-reader'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Geolocation from 'react-native-geolocation-service';
import {Camera, FACING_MODES, IMAGE_TYPES} from 'react-html5-camera-photo';
import Modal from "react-bootstrap/Modal";


import Loading from './Loading';
import Eroare from './Eroare';
import Asteptare from './Asteptare';
import Joc from './Joc';
import Sfarsit from './Sfarsit';

let createGraph = require('ngraph.graph');
let ngPath = require('ngraph.path');


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

export default function Th() {
    let queryParams = new URLSearchParams(window.location.search);
    let th_id = queryParams.get('riverwolves_treasurehunt_id');


    return (
<div className="landing-page sidebar-collapse">
  <CustomHeader titlu="River Wolves Treasure Hunt"/>
  <div className="wrapper">
    <div className="main">
        <div className="section section-tabs">
            <div className="row">
                <div className="card">
                  <div className="card-header">
                    <p></p>
                    <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                        <li className="nav-item">
                        <a className= 'nav-link active' data-toggle="tab" href="#statie" role="tab">
                            <i className="now-ui-icons location_compass-05"></i>
                        </a>
                        </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    {
                      (th_id==undefined)?<FaraCod/>:<CuCod cod={th_id}/>
                    }
                  </div>
                </div>

                <Sponsori/>
            </div>
        </div>
        <PageFooter/>
    </div>
  </div>
</div>
    )
}


const CuCod = ({cod}) => {
  const [comp, setComp] = useState(<Loading/>)

  const [modalDeschis, setModalDeschis] =useState(false);
  const [modalMesaj, setModalMesaj] = useState('');

  const [locatieOK, setLocatieOK] = useState(false);
  const [harta, setHarta] = useState(<></>);

  let locatieData = null;
  let lastUpdate = 10;
  let watchID = -1;

  let pk = 0;
  let grafPrimitiv = {}
  let graph = createGraph();

  let client = undefined;
  let recon = true;
  let connd = false;

  function modal(mesaj) {
    setModalMesaj(mesaj);
    setModalDeschis(true);
  }

  const wp = () => {
    if(watchID !== -1) Geolocation.clearWatch(watchID);
    let wid = Geolocation.watchPosition(
        (position) => {
              if(!locatieOK)
                setLocatieOK(true);
              lastUpdate = 10;
              if(locatieData==null){
                locatieData = {
                  acc: Number((position.coords.accuracy).toFixed(4)),
                  vit: position.coords.speed,
                  hed: position.coords.heading,
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                client.send(JSON.stringify({
                  'comanda': "ping",
                  'argumente': [locatieData.acc, locatieData.vit, locatieData.lat, locatieData.lng]
                }));
              }
              locatieData = {
                  acc: Number((position.coords.accuracy).toFixed(4)),
                  vit: position.coords.speed,
                  hed: position.coords.heading,
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
        },
        (error) => {
          setLocatieOK(false);
          modal("A aparut o eroare la locatie. Asigura-te ca ai locatia pornita si ca ai acordat permisiunile site-ului.")
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, forceRequestLocation: true, distanceFilter: 50}
    );
    watchID = wid;
  }

  function findPath(n1, n2, blocate){
    // console.log(blocate);
    let pathFinder = ngPath.aStar(graph, {
      distance(fromNode, toNode, link) {
        if(blocate.includes(Number(toNode.id)))
          return Number.POSITIVE_INFINITY;
        else
          return link.data.weight;
      }
    });
      return pathFinder.find(n1, n2);
  }

  function conecteaza(wsr) {
    client = new W3CWebSocket('wss://'+ window.location.host+'/rw-api/ws_th/'+wsr+'/');
    let mere = true;
    
    client.onopen = () => {
      connd = true;
      mere = true;
      setInterval(() => {
        if(mere){
          client.send(JSON.stringify({
            'comanda': "ping",
            'argumente': [locatieData.acc, locatieData.vit, locatieData.lat, locatieData.lng]
          }));
        }
      }, 1000 * 20);
    }

    client.onclose = function(e) {
      connd=false;
      mere=false;
      if(recon){
        console.log('Socket-ul s-a inchis. Se va incerca reconectarea in 2 secunde..', e.reason);

        setTimeout(function() {
          conecteaza(wsr)
        }, 2000);
      }else{
        console.log('Reconectare anulata. Se schimba adresa..');
      }
    }

    client.onerror = function(err) {
      console.error('Eroare la socket: ', err, 'Se inchide socketul..');
      mere=false;
      client.close();
    };

    client.onmessage = (message) => {
        let data = JSON.parse(message.data);
        let cmd = data.comanda;
        let args = data.argumente;

        if(cmd == "eroare"){
          setComp(<Eroare mesaj={args[0]}/>)
          recon=false;
          connd=false;
          client.close();
        }
        if(cmd == "modal"){
          modal(args[0])
        }
        if(cmd == "tts"){
          if(args[1].pk != 0)
            pk = args[1].pk;
          console.log(pk)
          setComp(<Joc termina={args[2]} platite={args[0]} conditii={true} cli={client} indiciu={args[1]}/>);
        }
        if(cmd == "alege"){
          generateGraf(grafPrimitiv);
          let blocate = args[0];
          let tinte = args[1];

          let gasit = false;
          for(let tid = 0; tid < tinte.length; tid++){
            let pthg = findPath(tinte[tid].toString(), pk.toString(), blocate);
            if(pthg.length > 2){
              client.send(JSON.stringify({
                'comanda': "aleeg",
                'argumente': pthg[2].id
              }));
              gasit=true;
              break;
            }
            if(pthg.length == 2){
              client.send(JSON.stringify({
                'comanda': "aleeg",
                'argumente': pthg[1].id
              }));
              gasit=true;
              break;
            }
          }
          if(!gasit)
            client.send(JSON.stringify({
              'comanda': "aleeg",
              'argumente': 0
            }));
        }
        if(cmd == "status"){
          wp();
          let stat_id = args[0];
          let nume = args[1];
          if(stat_id === 0){
            if(args[6]){
                setComp(<Asteptare incepe={args[2]} platite={args[4]}
                  conditii={args[5]} cli={client} indiciu={args[6]} lat={args[7]} lng={args[8]}/>);
              }else{
                setComp(<Asteptare incepe={args[2]} platite={args[4]}
                  conditii={args[5]} cli={client} indiciu={args[6]} lat={args[7]} lng={args[8]}/>);
              }
            
            grafPrimitiv=args[3];
            generateGraf(grafPrimitiv);
            
          }
          if(stat_id === 1){
            if(args[6].pk != 0)
              pk = args[6].pk;
            console.log(pk)
            setComp(<Joc termina={args[2]} platite={args[4]} conditii={args[5]} cli={client} indiciu={args[6]}/>);
            grafPrimitiv=args[3];
            generateGraf(grafPrimitiv);         
          }
          if(stat_id === 2){
            setComp(<Sfarsit ranks={args[2]}/>)
          }
        }

    }
  }

  function generateGraf(graf) {
    graph.clear();
    for (let n1 in graf) {
      for (let n2 in graf[n1]) {
        let w = graf[n1][n2];
        graph.addLink(n1, n2, {weight: w});
      }
    }
  }

  useEffect(() => {
    setInterval(() => {
      if(lastUpdate <= 8){
        wp();
        lastUpdate = 10;
      }
      lastUpdate--;
    }, 1000 * 5);
    conecteaza(cod);
  }, [])




  return(
    <div className="tab-content text-center">
      <div className= 'tab-pane active' id="statie" role="tabpanel">
        <Modal show={modalDeschis} onHide={() => setModalDeschis(false)}>
          <Modal.Body><h5>{modalMesaj}</h5></Modal.Body>
          <Modal.Footer>
              <button className="btn btn-danger" onClick={() => setModalDeschis(false)}>Ok</button>
          </Modal.Footer>
        </Modal>
        {locatieOK? comp: <>
            <h3 style={{color: "red"}}><b>Nu te poți conecta la server fără să ai locația activată.</b></h3>
            <button className="btn btn-primary" onClick={() => {wp()}}>Incearcă din nou</button>
        </>}
      </div>
    </div>
  )
}





const FaraCod = () => {
  const [scan, setScan] = useState(false);
  return(
    <div className="tab-content text-center">
        {
          (scan)&&<div className= 'tab-pane active' id="statie" role="tabpanel">
            <h2>Îndreaptă camera către codul QR.</h2>
            <QrReader
              delay={500}
              onScan={(data) => {
                if (data != null)
                  window.location.href = "https://ro049.com/th/?riverwolves_treasurehunt_id="+data.replace("https://ro049.com/th/?riverwolves_treasurehunt_id=","")
                }
              }
              style={{ width: '100%' }}
            />
            <button className="btn btn-danger" onClick={() => setScan(false)}>Anuleaza</button>
          </div>
        }
        {
          (!scan)&&<div className= 'tab-pane active' id="statie" role="tabpanel">
            <h2>Nu ești conectat la o echipă.</h2>
            <h3>Scanează codul QR de la sediul nostru pentru a te conecta.</h3>
            <button className="btn btn-primary" onClick={() => setScan(true)}>Scaneaza codul QR</button>
          </div>
        }
    </div>
  )
}
