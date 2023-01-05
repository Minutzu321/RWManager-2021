import {React, useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import Geolocation from 'react-native-geolocation-service';
import {Camera, FACING_MODES, IMAGE_TYPES} from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImgPrev from './ImgPrev'
import Modal from "react-bootstrap/Modal";


const THAdd = ({client, pk}) => {
    const [dataUri, setDataUri] = useState('');
    const [cam, setCam] = useState(false);
    const [locatie, setLocatie] = useState({});

    const [locShow, setLocShow] = useState(false);
    const [locStat, setLocStat] = useState(<nodiv/>)
    const [watchID, setWatchID] = useState(-1);

    const [modalDeschis, setModalDeschis] =useState(false);
    const [modalMesaj, setModalMesaj] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        console.log(data, locatie, dataUri);
        if(!dataUri){
            setModalMesaj("Trebuie sa faci o poza pentru a adauga un indiciu.");
            setModalDeschis(true);
            return;
        }
        if(locatie.lat === undefined){
            setModalMesaj("Trebuie sa iei locatia pentru a adauga un indiciu.");
            setModalDeschis(true);
            return;
        }
        client.send(JSON.stringify({
            'comanda': 'add_indiciu',
            'argumente': [data.text, data.rasp, parseInt(data.dif), parseInt(data.ech), data.aloc, data.apoza, locatie.acc, locatie.vit, locatie.hed, locatie.lat, locatie.lng, dataUri]
        }));
        
        setModalMesaj("Indiciul a fost adaugat!");
        setModalDeschis(true);
        setDataUri('');
        setCam(false);
        if(watchID !== -1) {Geolocation.clearWatch(watchID); setWatchID(-1)}
        setLocatie({});
        setLocShow(false);
        document.getElementById("indform").reset();
    }

    const wp = () => {
        if(watchID !== -1) Geolocation.clearWatch(watchID);
        let wid = Geolocation.watchPosition(
            (position) => {
                    setLocShow(true);
                    let data = {
                        acc: Number((position.coords.accuracy).toFixed(4)),
                        vit: position.coords.speed,
                        hed: position.coords.heading,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    if(position.coords.accuracy < 15){
                        setLocStat(<span className="badge badge-success">Perfecta!</span>);
                    }else if(position.coords.accuracy < 25){
                        setLocStat(<span className="badge badge-success">OK</span>);
                    }else if(position.coords.accuracy < 40){
                        setLocStat(<span className="badge badge-warning">Acceptabila</span>);
                    }else if(position.coords.accuracy < 80){
                        setLocStat(<span className="badge badge-danger">GROAZNICA</span>);
                    }else{
                        setLocStat(<span className="badge badge-danger">INUTILIZABILA</span>);
                    }
                    setLocatie(data);
                    console.log(position.coords);
                
            },
            (error) => {
              setLocStat(<span className="badge badge-danger">Eroare la locatie</span>)
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, forceRequestLocation: true, distanceFilter: 50}
        );
        setWatchID(wid);
    }

    // const locationDataCallback = (data) => {
    //     useEffect(() => { setLocatie(data) }, [])
    // }

    // const handleTakePhotoAnimationDone = (dataUri) => {
    //     useEffect(() => { setDataUri(dataUri) }, [])
    // }

    const isFullscreen = false;

return (
    <div>
        <h1>Adauga indicii</h1>
    

    <Modal show={modalDeschis} onHide={() => setModalDeschis(false)}>
        <Modal.Body><h5>{modalMesaj}</h5></Modal.Body>
        <Modal.Footer>
            <button className="btn btn-danger" onClick={() => setModalDeschis(false)}>Ok</button>
        </Modal.Footer>
    </Modal>
    <div className="card-body">
        <form id="indform" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label for="indiciu_text">Indiciu</label>
                <input type="text" className="form-control" id="indiciu_text" placeholder="Indiciu" {...register("text", { required: true })}/>
                {errors.text && <span style={{color: 'red'}}>Campul acesta este obligatoriu</span>}
            </div>
            <div className="form-group">
                <label for="indiciu_rasp">Raspuns</label>
                <input type="text" className="form-control" id="indiciu_rasp" placeholder="Raspuns" {...register("rasp", { required: true })}/>
                {errors.rasp && <span style={{color: 'red'}}>Campul acesta este obligatoriu</span>}
            </div>
            <div className="form-group">
                <label for="indiciu_dif">Dificultate</label>
                <select className="form-control" id="indiciu_dif" {...register("dif")}>
                    <option value="0">Mediu</option>
                    <option value="1">Greu</option>
                </select>
            </div>
            <div className="form-group">
                <label for="indiciu_ech">Echipe pe indiciu</label>
                <select className="form-control" id="indiciu_ech" {...register("ech")}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <div class="form-check">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" value="" {...register("aloc")}/>
                    Arata harta?
                    <span class="form-check-sign">
                        <span class="check"></span>
                    </span>
                </label>
            </div>
            <div class="form-check">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" value="" {...register("apoza")}/>
                    Arata poza?
                    <span class="form-check-sign">
                        <span class="check"></span>
                    </span>
                </label>
            </div>
            <hr/>
            
            {
                (dataUri)
                ? 
                <div>
                    <ImgPrev dataUri={dataUri}
                    isFullscreen={isFullscreen}/>
                    <button type="button" className="btn btn-danger btn-round" onClick={(e) => {e.preventDefault(); if(watchID !== -1) {Geolocation.clearWatch(watchID); setWatchID(-1)} setDataUri('')}}>Incearca din nou</button>
                </div>
                : (cam)
                ?
                <div>
                    <Camera onTakePhotoAnimationDone = {(dataUri) => setDataUri(dataUri)}
                        isFullscreen={isFullscreen}
                        idealFacingMode = {FACING_MODES.ENVIRONMENT}
                        idealResolution = {{width: 640, height: 480}}
                        imageType = {IMAGE_TYPES.JPG}
                        isImageMirror = {false}
                    />
                    <button className="btn btn-danger btn-round" onClick={(e) => {e.preventDefault(); setCam(false);
                    }}>Anuleaza</button>
                </div>
                : <button type="button" className="btn btn-primary btn-round" onClick={(e) => {e.preventDefault(); if(watchID !== -1) {Geolocation.clearWatch(watchID); setWatchID(-1)} setCam(true);}}>Fa o poza</button>
            }
            <button type="button" className="btn btn-primary btn-round" onClick={(e) => {e.preventDefault(); wp()}}>Ia locatia</button>
            {(locShow && <div>
                    <h5>Acuratetea locatiei: {locatie.acc}</h5>
                    {locStat}</div>)
            }
            <hr/>
            <input className="btn btn-success btn-round" type="submit" />
        </form>
    </div>
</div>
    )
}

export default THAdd
