import {React, Component, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import Geolocation from 'react-native-geolocation-service';

const Statie = ({client, pk}, ref) => {
    const [echipe, setEchipe] = useState([]);
    const [locStat, setLocStat] = useState([]);
    const [areStatie, setAreStatie] = useState(false);

    let locPornita = false;

    useImperativeHandle(ref, () => ({
        onmessage(message){
            const data = JSON.parse(message.data);
            if(data.comanda == "send_statie"){
                setEchipe(data.argumente);
                setAreStatie(true);
                if(!locPornita)
                    wp();
            }
        }
    }), [])


    function castigat(nr){
        client.send(JSON.stringify({
            'comanda': 'castigator',
            'argumente': nr
        }));
    }

    function cere(){
        client.send(JSON.stringify({
            'comanda': 'cauta_echipe',
            'argumente': []
        }));
    }

    const wp = () => {
        Geolocation.watchPosition(
            (position) => {
                    locPornita = true;
                    let data = {
                        acc: Number((position.coords.accuracy).toFixed(4)),
                        vit: position.coords.speed,
                        hed: position.coords.heading,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    if(position.coords.accuracy < 15){
                        setLocStat(<span className="badge badge-success">Locatie perfecta!</span>);
                    }else if(position.coords.accuracy < 25){
                        setLocStat(<span className="badge badge-success">Locatie OK</span>);
                    }else if(position.coords.accuracy < 40){
                        setLocStat(<span className="badge badge-warning">Locatie acceptabila</span>);
                    }else if(position.coords.accuracy < 80){
                        setLocStat(<span className="badge badge-danger">Locatie GROAZNICA</span>);
                    }else{
                        setLocStat(<span className="badge badge-danger">Locatie INUTILIZABILA</span>);
                    }

                    client.send(JSON.stringify({
                        'comanda': 'loc',
                        'argumente': [data.acc, data.lat, data.lng]
                    }));
                    
                
            },
            (error) => {
              setLocStat(<span className="badge badge-danger">Eroare la locatie</span>)
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, forceRequestLocation: true, distanceFilter: 50}
        );
    }

return (
    <div>
        <h1>Statie</h1>
        {areStatie? <>{locStat}
        <hr/>
        {echipe.length > 0?<>
        <h3>{echipe[0]}</h3>
        <button className="btn btn-primary" onClick={() => {castigat(1)}}>Castigatoare echipa 1</button>
        <h3>{echipe[1]}</h3>
        <button className="btn btn-primary" onClick={() => {castigat(2)}}>Castigatoare echipa 2</button>
        </>:<><button className="btn btn-primary" onClick={() => {cere()}}>Cere echipe</button></>}</>:
        <><h4>Nu ai o statie atribuita</h4></>}
        

    </div>
    )
}
export default forwardRef(Statie)
