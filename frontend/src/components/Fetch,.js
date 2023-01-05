import { useEffect, useState } from "react";
import React, { Component } from 'react'
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

export default function Fetch({ render, url }) {

  const [state, setState] = useState({
    data: {},
    isLoading: false
  });

  useEffect(() => {
    setState({ data: {}, isLoading: true });

    const _fetch = async () => {
    const requestOptions = {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
    };
      const res = await fetch(url, requestOptions);
      const json = await res.json();

      setState({
        data: json,
        isLoading: false,
      });
    }

    _fetch();
  }, []);

  return render(state);
}