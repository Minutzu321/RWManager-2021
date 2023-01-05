import {React, useState} from 'react'
import Countdown from 'react-countdown';
import GoogleMapReact from 'google-map-react';
import { useForm } from "react-hook-form";

const Punct = () => <>
    <div style={{
        color: 'white', 
        background: 'red',
        padding: '8px 8px',
        display: 'inline-flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%',
    }}></div>
  </>;

const renderer = ({ hours, minutes, seconds, completed }) => {
  
    if (completed) {
      return <p class="category">Jocul s-a terminat.</p>;
    } else {
      return <p class="category">{hours}:{minutes}:{seconds}</p>;
    }
  };

export default function Joc({termina, platite, conditii, cli, indiciu}) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        cli.send(JSON.stringify({
            'comanda': 'raspuns',
            'argumente': data.rasp
        }));
        setValue("rasp", "")
    }

    function skip(){
        cli.send(JSON.stringify({
            'comanda': 'skip',
            'argumente': []
        }));
        setValue("rasp", "")
    }

    return (
        <div classname="card">
            <div classname="card-header"><Countdown
                date={termina}
                renderer={renderer}
        /></div>
            <div classname="card-body">
                <h4><b>{indiciu.text}</b></h4>
                {(indiciu.poza != null)&&<img src={indiciu.poza} alt="Imagine"></img>}
                {indiciu.harta && <div style={{ height: '60vh', width: '100%' }}>
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCYIJcYglr_De2AxFgxZfgV2PwpNiF7XQU' }}
                    defaultCenter={{lat: Number(indiciu.lat), lng: Number(indiciu.lng)}}
                    defaultZoom={15}
                    yesIWantToUseGoogleMapApiInternals={true}
                    >
                        <Punct
                            lat={Number(indiciu.lat)}
                            lng={Number(indiciu.lng)}
                        />
                    </GoogleMapReact>
                </div>}
                <hr/>
                {indiciu.indiciu &&<form id="raspform" onSubmit={handleSubmit(onSubmit)}>
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Raspuns" {...register("rasp", { required: true })}/>
                        <div class="input-group-append">
                            <span class="input-group-text"><i class="now-ui-icons ui-1_send"></i></span>
                        </div>
                    </div>
                    {errors.rasp && <span style={{color: 'red'}}>Campul acesta este obligatoriu</span>}
                    <br/>
                    <input className="btn btn-primary btn-round" type="submit" />
                    <hr/>
                    {(platite > 0) && <button className="btn btn-warning btn-round" onClick={(e) => {e.preventDefault(); skip();
                        }}>SKIP</button>}
                    {(platite > 1) && <><br/><span style={{color: 'red'}}>{platite} skip-uri rămase</span></>}
                    {(platite === 1) && <><br/><span style={{color: 'red'}}>{platite} skip rămas</span></>}
                </form>}
            </div>
            <div class="card-footer text-muted mb-2">
                Contact: 0755484855, 0771264358, 0756219829, 0748953750
            </div>
        </div>
    )
}
