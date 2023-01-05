// import logo from './logo.svg';
import React  from 'react';
import {useEffect} from 'react'
import jQuery from 'jquery'
import { BrowserRouter, Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom';

import Acasa from './components/Acasa/Acasa';
import Register from './components/LaR/Register';
import Login from './components/LaR/Login';
import RDIR from './components/RDIR';
import Membru from './components/Membru/Membru';
import Statie from './components/Statie/Statie';
import Th from './components/Th/Th';
import RWC from './components/RWC/RWC';

function binSearch(fn, min, max) {
  if (max < min) return -1;
  let mid = (min + max) >>> 1;
  if (0 < fn(mid)) {
      if (mid == min || 0 >= fn(mid - 1)) {
          return mid;
      }
      return binSearch(fn, min, mid - 1);
  }
  return binSearch(fn, mid + 1, max);
}

function findFirstPositive(fn) {
  let start = 1;
  while (0 >= fn(start)) start <<= 1;
  return binSearch(fn, start >>> 1, start) | 0;
}

function findDPI() {
  let counter = 0;
  return findFirstPositive((x) => (++counter, matchMedia(`(max-resolution: ${x}dpi)`).matches));
}

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

function App() {
  let tkn = getCookie("csrftoken")
  useEffect(() => {
    if(tkn!=null){
      const { innerWidth: width, innerHeight: height } = window;
      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': tkn
        },
        body: JSON.stringify({ dpi: findDPI(), width: width, height: height})
      };
      fetch('https://'+window.location.host+'/rw-api/sessionmeta/', requestOptions).catch();
    }
  }, [])
  if(tkn==null){
    let redto = "/rw-api/setup/?intoarce="+(window.location.pathname+window.location.search);
    // history.push()
    return (
    <BrowserRouter>
      <Redirect to={redto}/>
      <Route path="/rw-api/setup" component={RDIR} />
    </BrowserRouter>
    )
  }
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Acasa} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/membru" component={Membru} />
          <Route exact path="/statie" component={Statie} />
          <Route exact path="/th" component={Th} />
          <Route exact path="/rwc" component={RWC} />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
