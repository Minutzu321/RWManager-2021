import {React, Component, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import GoogleMapReact from 'google-map-react';
import '../marker.css'

const Admin = ({client, pk}, ref) => {
    const [rezervari, setRezervari] = useState([]);
    const [pers, setPers] = useState(0);
    const [indicii, setIndicii] = useState([]);
    const [arataIndicii, setArataIndicii] = useState(false);

useImperativeHandle(ref, () => ({
    onmessage(message){
        // console.log("ADMIN",message);
        const data = JSON.parse(message.data);
        if(data.comanda == "send_indicii"){
            setIndicii(data.argumente);
        }
        if(data.comanda == "send_rezervari"){
            setRezervari(data.argumente);
            let tot = 0;
            for(let i=0;i<data.argumente.length;i++)
                tot+=data.argumente[i].pers;
            setPers(tot);
        }
    }
}), [])
return (
    <div>
        <h1>Admin</h1>
        <h4>Rezervari: {rezervari.length}</h4>
        <h4>Total persoane: {pers}</h4>
        <SimpleMap indicii={indicii}/>
        {
            (arataIndicii)?<button className="btn btn-primary btn-round" type="button" onClick={() => setArataIndicii(false)}>Ascunde indicii</button>
            :
            <button className="btn btn-primary btn-round" type="button" onClick={() => setArataIndicii(true)}>Arata indicii</button>
        }
        {
            (arataIndicii)?(indicii.length == 0)?<h4>Nu sunt indicii</h4>:<Indicii indicii={indicii}/>:<nodiv/>
        }
    </div>
    )
}

const Indicii = ({indicii}) => {
    return(
        <div className="row">
            {
                indicii.map((indiciu) => (
                    <div className="card col-md-10 ml-auto col-xl-5 mr-auto">
                        <div className="card-header mt-2">
                            <span>{indiciu.adaugat_de}</span>
                        </div>
                        <div className="card-body">
                            <h5 className="card-text"><b>Text: </b>{indiciu.text}</h5>
                            <h5 className="card-text"><b>Raspuns: </b>{indiciu.rasp}</h5>
                            <h5 className="card-text"><b>Coordonate: </b>{indiciu.lat}, {indiciu.lng}</h5>
                            <h5 className="card-text"><b>Arata locatie: </b>{indiciu.aloc ? "Da":"Nu"}</h5>
                            <h5 className="card-text"><b>Acuratete locatie: </b>{indiciu.acc}</h5>
                            <h5 className="card-text"><b>Arata poza: </b>{indiciu.apoz ? "Da":"Nu"}</h5>
                            <h5 className="card-text"><b>Dificultate: </b>{indiciu.dif}</h5>
                            <h5 className="card-text"><b>Echipe simultan: </b>{indiciu.ech}</h5>
                            <img src={indiciu.poza} alt="Imagine indiciu"/>

                        </div>
                    </div>
                ))
            }
        </div>
    )
}



const AnyReactComponent = ({ text }) => <>
    <div className="pin2" onClick={() => alert(text)}></div>
    {/* <div style={{
        color: 'white', 
        background: 'green',
        padding: '5px 5px',
        display: 'inline-flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '100%',
    }}>{text}</div> */}
  </>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 45.177122,
      lng: 28.801483
    },
    zoom: 15
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCYIJcYglr_De2AxFgxZfgV2PwpNiF7XQU' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
        {
            this.props.indicii.map((indiciu) => (
                <AnyReactComponent
                    lat={Number(indiciu.lat)}
                    lng={Number(indiciu.lng)}
                    text={indiciu.text}
                />
            ))
        }
        </GoogleMapReact>
      </div>
    );
  }
}

export default forwardRef(Admin)
