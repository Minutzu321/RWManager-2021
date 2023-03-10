import {React, useEffect, useState} from 'react'
import jQuery from 'jquery'

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

const Aplica = () => {
    const [suntRecrutari, setSuntRecrutari] = useState(true)
    // useEffect(() => {
    //   const requestOptions = {
    //     credentials: 'include',
    //     method: 'POST',
    //     mode: 'same-origin',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       'X-CSRFToken': getCookie('csrftoken')
    //     }
    //   };
    //   fetch('https://'+window.location.host+'/rw-api/recrutari/', requestOptions)
    //     .then(response => response.json())
    //     .then(data => setSuntRecrutari(data.raspuns));
    // }, [])
    return (
        <div className="section section-tabs">
          <div className="container">
            <div className="row">
              <div className="col-md-10 ml-auto col-xl-10 mr-auto aplica">
                <p className="category">Aplica pentru un rol!</p>
                <div className="card">
                  <div className="card-header">
                    <p></p>
                    <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                      <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#voluntar" role="tab">
                          <i className="now-ui-icons sport_user-run"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#media" role="tab">
                          <i className="now-ui-icons business_bulb-63"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#mecanic" role="tab">
                          <i className="now-ui-icons ui-2_settings-90"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#programator" role="tab">
                          <i className="now-ui-icons tech_laptop"></i>
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#designer" role="tab">
                          <i className="now-ui-icons design-2_ruler-pencil"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="tab-content text-center">
                      <div className="tab-pane active" id="voluntar" role="tabpanel">
                        <h4>Voluntarii sunt cei care vor s?? ajute echipa, f??r?? a se implica prea mult ??n organizarea ei sau cei care nu sunt siguri dac?? vor sau nu s?? intre ??n echip?? a??a c?? vor s?? vad?? mai ??nt??i cum ne desf????ur??m activitatea</h4>
                      </div>
                      <div className="tab-pane" id="media" role="tabpanel">
                        <h4>Cei de la media se ocup?? ??n general cu paginile de facebook ??i instagram, activit????ile de outreach, sponsoriz??ri, rela??iile cu publicul, caietul tehnic, flyere, etc.</h4>
                      </div>
                      <div className="tab-pane" id="mecanic" role="tabpanel">
                        <h4>Cei de la mecanic?? se ocup?? de construc??ia robotului, conectarea modulelor, aranjarea cablurilor ??i g??sirea materialelor</h4>
                      </div>
                      <div className="tab-pane" id="programator" role="tabpanel">
                        <h4>Cei de la programare se ocup?? cu tot ce ??ine de autonomia ??i controlul robotului dar ??i cu site-ul sau alte proiecte secundare cum ar fi aplica??ii cu inteligen???? artificial??, computer vision, etc.</h4>
                      </div>
                      <div className="tab-pane" id="designer" role="tabpanel">
                        <h4>Celor de la design le trebuie o parte mai artistic??, ??ntruc??t ace??tia se ocup?? de ???estetica??? echipei - logo, bannere, flyere, colabor??nd cu cei de la media sau de designul pentru robot, folosind imprimanta 3D ??i colabor??nd cu cei de la mecanic??</h4>
                      </div>
                      {suntRecrutari ? <AplicaDeschis/> : <AplicaInchis/>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
    )
}

const AplicaInchis = () => (
  <h4><b>Aplicatiile pentru rolurile de membru sunt dezactivate pana in luna Iulie</b></h4>
)

const AplicaDeschis = () => (
  <div>
    <h4><b>Apas?? pe butonul de mai jos pentru a deveni un membru ??n cadrul echipei</b></h4>
    <a href="register" className="btn btn-primary btn-icon btn-round btn-lg" type="button">
      <i className="now-ui-icons files_paper"></i>
    </a>
  </div>
)

export default Aplica
