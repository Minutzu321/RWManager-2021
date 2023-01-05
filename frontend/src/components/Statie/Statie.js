import {React, useEffect, useState, useRef} from 'react'
import CustomHeader from '../CustomHeader'
import Navbar from '../Navbar'
import PageHeader from '../PageHeader'
import PageFooter from '../PageFooter'
import Acasa from '../Acasa/Acasa'
import classnames from 'classnames';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import jQuery from 'jquery'

export default function Statie() {
    return (
<div className="landing-page sidebar-collapse">
  <CustomHeader titlu="River Wolves"/>
  <Navbar/>
  <div className="wrapper">
    <div className="main">
        <div className="section section-tabs">
          <div className="container">
            <div className="row">
              <div className="col-md-10 ml-auto col-xl-10 mr-auto ">
                <div className="card">
                  <div className="card-header">
                    <p></p>
                    <ul className="nav nav-pills nav-pills-just-icons nav-pills-primary justify-content-center" role="tablist">
                        <li className="nav-item">
                        <a className= 'nav-link active' data-toggle="tab" href="#statie" role="tab">
                            <i className="now-ui-icons location_pin"></i>
                        </a>
                        </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="tab-content text-center">
                        <div className= 'tab-pane active' id="statie" role="tabpanel">
                            <h1>Statie</h1>
                        </div>
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
