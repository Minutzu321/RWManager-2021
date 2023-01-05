import {React, useState} from 'react'
import Countdown from 'react-countdown';
import GoogleMapReact from 'google-map-react';


const Completionist2 = () => <h1>Da refresh</h1>;

const renderer2 = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Completionist2 />;
  } else {
    return <h1><b>{seconds}</b></h1>;
  }
};

const Completionist = () => <>
  <h1><b>Se generează traseul..</b></h1>
  <Countdown
    date={Date.now() + 30000}
    renderer={renderer2}
  />
</>;

const renderer = ({ hours, minutes, seconds, completed }) => {
  
  if (completed) {
    return <Completionist />;
  } else {
    return <h1><b>{hours}:{minutes}:{seconds}</b></h1>;
  }
};

function accept(cli) {
    cli.send(JSON.stringify({
        'comanda': "accept",
        'argumente': "da"
      }));
}

const Conditii = ({cli}) => {
    

      return <div className="card card-body">
        <h2>Termeni și condiții</h2>
        <h3>Am luat la cunoștință că prețul plătit reprezintă o donație și nu o obligație contractuală</h3>
        <h3><b>NU</b> vom folosi mașini, autobuze, motociclete, trotinete, biciclete, skate-uri, hoverboard-uri sau orice alte mijloace de transport care ne vor avantaja în timpul jocului, în caz contrar, vom fi descalificați fără posibilitatea de a primi banii inapoi.</h3>
        <h3>Suntem de acord ca datele oferite de sistemul GPS al device-ului să fie folosite pentru a preveni fraudele jocului.</h3>
        <h3>Suntem de acord ca pozele în care apărem, făcute în timpul jocului, să fie postate pe social media(Instagram, Facebook, etc)</h3>
        <h3>Am luat la cunoștință faptul că echipa River Wolves nu își asumă răspunderea în cazul furturilor sau accidentărilor din timpul jocului.</h3>
        <h3>Echipa River Wolves <b>NU</b> va vinde, posta sau folosi datele participanților, acestea fiind șterse după eveniment.</h3>
        <hr/>
        <button className="btn btn-primary" onClick={() => {accept(cli)}}>Acceptam</button>
      </div>;
  };

export default function Asteptare({incepe, platite, conditii, cli, indiciu, lat, lng}) {
    const [ce, setCe] = useState(false);
    const endTime = Date.parse(incepe);
    return (
        <>
        {conditii?<>
        <Countdown
                date={endTime}
                renderer={renderer}
        />
        {indiciu&&<div style={{ height: '80vh', width: '100%' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyCYIJcYglr_De2AxFgxZfgV2PwpNiF7XQU' }}
                  defaultCenter={{lat: lat, lng: lng}}
                  defaultZoom={15}
                  yesIWantToUseGoogleMapApiInternals={true}
                  onGoogleApiLoaded={({map, maps}) =>
                    new maps.Circle({
                      strokeColor: '#FF0000',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: '#FF0000',
                      fillOpacity: 0.3,
                      map,
                      center: {lat: lat, lng: lng},
                      radius: 400,
                    })}
                >
                </GoogleMapReact>
              </div>}
        {ce?<button className="btn btn-primary" onClick={() => {setCe(false)}}>Ascunde</button>:<button className="btn btn-primary" onClick={() => {setCe(true)}}>Ce se va întampla?</button>}
        {ce?<>
        <h3><b>Ce se va întampla?</b></h3>
        <h4><b>-</b>Când cronometrul va ajunge la 0, vi se va da primul indiciu. Când îl veți rezolva, sistemul vă va trimite la alt indiciu și tot așa.</h4>
        <h4><b>-</b>Pot fi mai multe echipe rivale la un indiciu, deci aveți grijă la ce persoane vă pot auzi :)</h4>
        <h4><b>-</b>Scopul este de a face cât mai multe indicii pe parcursul a 2 ore.</h4>
        <h4><b>-</b>La anumite intervale de timp, veți avea niște taskuri. După ce rezolvați un task, faceți o poză iar aceasta va fi analizată la sediul nostru și va fi aprobată dacă ați îndeplinit cerințele.</h4>
        <h4><b>-</b>La intervale aleatorii de timp, veți fi repartizați la stațiile noastre de volunari unde veți face jocuri cu o echipă adversă. Dacă câștigați, veți primi un skip gratuit pentru ce indiciu vreți.</h4>
        </>:<></>}
            </>:<Conditii cli={cli}/>
            }
        </>
    )
}
