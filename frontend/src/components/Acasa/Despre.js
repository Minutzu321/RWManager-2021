import {React, useState} from 'react'
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import ReCAPTCHA from "react-google-recaptcha";
import jQuery from 'jquery'
import Sponsori from '../Sponsori';

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

const Despre = () => {
  const [modal, setModal] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [eroare, setEroare] = useState(false);
  const [capt, setCapt] = useState("")

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = (data) => {

      let fin = {
        tel: data.tel,
        nume: data.nume,
        captcha: capt,
        part: data.part
      }

      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(fin)
      };
      fetch('https://'+window.location.host+'/rw-api/rezerva/', requestOptions)
        .then(response => response.json())
        .then(data => {setEroare(data.err); setMesaj(data.raspuns)});
      
      window.grecaptcha.reset();
    }

    return (
        <div className="section">
          <div className="container text-center">
            <div className="row justify-content-md-center">
              <div className="col-md-12 col-lg-8">
                <h2 className="title">Despre noi</h2>
                <h5 className="description"><b>Noi suntem prima echipă de robotică din Județul Tulcea și ajutați în special de <strong rel="tooltip" title="Desfasoara in mare parte cursuri de Astronomie si Electronica la Palatul Copiilor">Societatea Științifică Orion</strong> și de <strong rel="tooltip" title="Liceul Grigore Moisil din Tulcea">Liceul Teoretic Grigore Moisil</strong> am reușit să parcurgem <strong>5</strong> sezoane din concursul <strong rel="tooltip" title="F.I.R.S.T. este un concurs international de robotica pentru toate varstele">FIRST Tech Challange</strong></b></h5>
                <h5 className="description"><b>Țelul nostru și al competiției este de a evolua, de a învăța lucruri noi. Prin educatia <strong rel="tooltip" title="Science Technology Engineering Mathematics">STEM</strong> punem în aplicare cunoștințele noastre asupra lumii fizice, nu doar teoretice.</b></h5>
              </div>
            </div>
          </div>


          {/* <Modal show={modal} onHide={() => setModal(false)}>
              <Modal.Body>
                <h3>Rezerva bilete</h3>
                <form id="rezform" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                      <label for="nume_rez">Nume</label>
                      <input type="text" className="form-control" id="nume_rez" placeholder="Nume" {...register("nume", { required: true })}/>
                      {errors.nume && <span style={{color: 'red'}}>Campul acesta este obligatoriu</span>}
                  </div>
                  <div className="form-group">
                      <label for="tel_rez">Numar de telefon</label>
                      <input type="text" className="form-control" id="tel_rez" placeholder="Numar de telefon" {...register("tel", { required: true })}/>
                      {errors.tel && <span style={{color: 'red'}}>Campul acesta este obligatoriu</span>}
                  </div>
                  <div className="form-group">
                      <label for="part_rez">Cati sunteti in echipa?</label>
                      <select className="form-control" id="part_rez" {...register("part")}>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                      </select>
                  </div>
                  <ReCAPTCHA
                      sitekey="6LcZQekUAAAAAHuwfLoI666DnVr6B3JkVhuQMTrR"
                      onChange={(value) => setCapt(value)}
                    />
                    <hr/>
                  {mesaj.length > 1 ? eroare ? <nodiv><span style={{color: 'red'}}>{mesaj}</span><br/></nodiv>:<nodiv><span style={{color: 'green'}}>{mesaj}</span><br/></nodiv>:""}
                  <button className="btn btn-success">Rezerva</button>
                </form>
              </Modal.Body>
          </Modal> */}

          {/* <div className="col-md-10 ml-auto col-xl-10 mr-auto">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                  <li className="nav-item">
                    <p></p>
                    <a className="nav-link active" data-toggle="tab" href="#rezervare" role="tab">
                      <i className="now-ui-icons location_map-big"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <br/>
              <div className="card-body">
                <div className="tab-content text-center">
                  <div className="tab-pane active" id="rezervare" role="tabpanel">
                    <h3><b>Rezervă bilete pentru echipa ta!</b></h3>
                    <h4>Participă la a doua ediție a Treasure Hunt-ului nostru!</h4>
                    <h5>Pe parcursul verii am perfecționat algoritmii și premiile noastre, așa că rezervă bilete pentru grupul tău și intrați în concurs!</h5>
                    <h4><b>Ce poți câștiga?</b></h4>
                    <h5><b><span className="sport_trophy"/> PREMIUL 1</b></h5>
                    <h5>+Abonament gratuit <b>GreenGym</b> pentru <b>12 luni</b></h5>
                    <h5>+200 de lei</h5>

                    <h5><b><span className="sport_trophy"/> PREMIUL 2</b></h5>
                    <h5>+Abonament gratuit <b>GreenGym</b> pentru <b>6 luni</b></h5>
                    <h5>+150 de lei</h5>

                    <h5><b><span className="sport_trophy"/> PREMIUL 3</b></h5>
                    <h5>+Abonament gratuit <b>GreenGym</b> pentru <b>3 luni</b></h5>
                    <h5>+100 de lei</h5>

                    <h5><b><span className="sport_trophy"/> Mențiunile 1 si 2</b></h5>
                    <h5>+Cupoane <b>PICKUP</b> pentru cafele gratuite</h5>

                    <button className="btn btn-primary btn-round" type="button" onClick={() => setModal(true)}>Rezerva bilete</button>

                    <hr/>
                    <h6>! Dificultățile pentru echipe se vor stabili după vârsta medie a grupului</h6>
                    <h6>! Premiile sunt diferite pentru cele două dificultăți</h6>
                    <h6>! Cupoanele GreenGym se pot împărți între câștigători</h6>
                    <h6>! Media de vârstă minimă: 12 ani</h6>
                  </div>
                </div>
              </div>
              <Sponsori/>
              <br/>
            </div>
          </div> */}

          


          <div className="col-md-10 ml-auto col-xl-10 mr-auto">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                  <li className="nav-item">
                    <p></p>
                    <a className="nav-link active" data-toggle="tab" href="#cefacem" role="tab">
                      <i className="now-ui-icons education_atom"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <br/>
              <div className="card-body">
                <div className="tab-content text-center">
                  <div className="tab-pane active" id="cefacem" role="tabpanel">
                    <h3><b>Ce facem noi?</b></h3>
                    <h5>Concursul se numește <b>FIRST Tech Challange</b>.</h5>
                    <h5>În fiecare an/sezon se dezvăluie câte o nouă temă. Noi trebuie să construim un robot care să îndeplinească provocările temei propuse, făcându-l cât mai eficient pentru a câștiga cât mai multe puncte.</h5>
                    <h5><b>Din fericire</b>, acest concurs <b>nu</b> înseamnă numai roboți. Trebuie să interacționăm cât mai mult cu cei din comunitate, făcând activități, colaborări sau cerând sponsorizări. Relația cu oamenii este crucială când vine vorba de tehnologie, întrucât aceasta(tehnologia) are rolul de a ne ajuta.</h5>
                    <h5>Toate aceste activități sunt puse în <b>caietul tehnic</b> care arată aportul nostru în societate. Pe măsura implicării, se pot da diferite premii echipelor care au iesit in evidenta.</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-10 ml-auto col-xl-10 mr-auto">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                  <li className="nav-item">
                    <p></p>
                    <a className="nav-link active" data-toggle="tab" href="#abilitati" role="tab">
                      <i className="now-ui-icons sport_trophy"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <br/>
              <div className="card-body">
                <div className="tab-content text-center">
                  <div className="tab-pane active" id="abilitati" role="tabpanel">
                    <h3><b>Premii</b></h3>
                    <img src="https://ro049.com/media/innovationAward.jpg" style={{width: 100 + '%', maxWidth: 482 + 'px', height: 'auto'}}></img>
                    <h5>Am câștigat <b>Locul 1</b> la partea de <b>Inovatie</b> în 2021.</h5>
                    <h5>Am reușit să dezvoltăm un design creativ şi ingenios iar, folosindu-ne inventivitatea, <i>l-am adus la viață</i>.</h5>
                    <a href="media/Caiet%20RO049-V3.pdf" target="_blank"><h5>Click aici ca să descărcați/vizualizați robotul și activitatea noastră pe anul 2020-2021</h5></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
    )
}

export default Despre
