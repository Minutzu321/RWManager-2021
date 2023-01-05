import React, {useState, Component} from 'react'
import CustomHeader from '../CustomHeader'
import Navbar from '../Navbar'
import PageFooter from '../PageFooter'
import jQuery from 'jquery'

import Modal from "react-bootstrap/Modal";
import ReCAPTCHA from "react-google-recaptcha";
import Fetch from '../Fetch,'

import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import Membru from '../Membru/Membru'

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

class Register extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        nume: '',
        email: '',
        telefon: '',
        nastere: '',
        rol: '0',
        captcha: '',
        isOpen: false,
        mesaj: '',
        log: false,
        };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);

      this.onRecaptcha = this.onRecaptcha.bind(this);
      this.initializez = this.initializez.bind(this);

      this.initializez();
    }

    initializez(){
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
              this.setState({log: data.valid})
            }
          );
    }

    showModal(mesajd) {
      this.setState({mesaj: mesajd, isOpen: true})
    }

    hideModal() {
      this.setState({mesaj: '', isOpen: false})
    }

    handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
    }
    
    onRecaptcha(value) {
      this.setState({captcha: value});
    }
  
    handleSubmit(event) {
      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(this.state)
      };
      fetch('https://'+window.location.host+'/rw-api/register/', requestOptions)
        .then(response => response.json())
        .then(data => this.showModal(data.raspuns));
      
      window.grecaptcha.reset();
      event.preventDefault();
    }
    

    
  
render() {
      if(this.state.log){
        return (
          <BrowserRouter>
            <Redirect to='/membru/'/>
            <Route exact path="/membru/" component={Membru} />
          </BrowserRouter>
        )
      }

        return (
    <div className="login-page sidebar-collapse">
    <CustomHeader titlu="Inregistreaza-te"/>
    <Navbar/>
    <Modal show={this.state.isOpen} onHide={this.hideModal}>
      <Modal.Body><h5>{this.state.mesaj}</h5></Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={this.hideModal}>Ok</button>
      </Modal.Footer>
    </Modal>
    <div className="page-header clear-filter">
        <div className="page-header-image" style={{backgroundImage: 'url("../static/img/login.jpg")'}}></div>
        <div className="content">
            <div className="container">
            <div className="col-md-4 ml-auto mr-auto">
                <div className="card card-login card-plain">
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="card-header text-center">
                        <img style={{width: 150+'px', top: -200+'px'}} src="/static/img/logo-contur.png" alt=""/>
                    </div>
                    <div className="card-body">
                    <div className="input-group no-border input-lg">
                        <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className="now-ui-icons users_circle-08"></i>
                        </span>
                        </div>
                        <input name="nume" type="text" className="form-control" placeholder="Numele complet" value={this.state.nume} onChange={this.handleChange} required/>
                    </div>
                    <div className="input-group no-border input-lg">
                        <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className="now-ui-icons ui-1_email-85"></i>
                        </span>
                        </div>
                        <input name="email" type="email" placeholder="Email" className="form-control" value={this.state.email} onChange={this.handleChange} required/>
                    </div>
                    <div className="input-group no-border input-lg">
                        <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className="now-ui-icons tech_mobile"></i>
                        </span>
                        </div>
                        <input name="telefon" type="telephone" placeholder="Numarul de telefon" className="form-control" value={this.state.telefon} onChange={this.handleChange} required/>
                    </div>
                    <div className="input-group no-border input-lg">
                        <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className="now-ui-icons ui-1_calendar-60"></i>
                        </span>
                        </div>
                        <input name="nastere" type="text" className="form-control" placeholder="Data nasterii - zi/luna/an" value={this.state.nastere} onChange={this.handleChange} required/>
                    </div>
                    
                    <div className="input-group no-border input-lg">
                        
                        <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className="now-ui-icons ui-1_zoom-bold"></i>
                        </span>
                        </div>
                        
                        <Fetch
                          url="https://ro049.com/rw-api/getRoluri/"
                          render={({ data }) => (
                            <select className="form-control" name="rol" value={this.state.rol} onChange={this.handleChange} required>
                              {(("vals" in data)==true) > 0 && data.vals.map((rol) => <option className="dropdown-item" value={rol.id}>{rol.display}</option>)}
                            </select>
                          )} />
                    </div>
                    </div>
                    <ReCAPTCHA
                      sitekey="6LcZQekUAAAAAHuwfLoI666DnVr6B3JkVhuQMTrR"
                      onChange={this.onRecaptcha}
                    />
                    <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-round btn-lg btn-block">Inregistreaza-te</button>
                    </div>
                </form>
                </div>
                </div>
            </div>
            </div>
        </div>
        <PageFooter/>
        </div>
        )
    }
}

export default Register