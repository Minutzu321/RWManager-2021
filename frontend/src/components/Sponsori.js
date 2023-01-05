import {React, useEffect, useState, useRef} from 'react'
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

export default function Sponsori() {
    const [sponsori, setSponsori] = useState([])

    function getSponsori(){
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
        fetch('https://'+window.location.host+'/rw-api/getSponsori/', requestOptions)
          .then(response => response.json())
          .then(data => {
            setSponsori(data.raspuns);
          });
    }
  
    useEffect(() => {
        getSponsori();
    }, [])

    return (
        <div id="sponsori" class="carousel slide" data-ride="carousel" style={{width: 90+'%', maxWidth: 400+'px', height: 'auto', marginLeft: 'auto', marginRight: 'auto'}}>
            <ol class="carousel-indicators">
                {sponsori.map((im, index) => (
                    <li data-target="#sponsori" data-slide-to={index} {...(index == 0 ? { className: 'active' } : {})}></li>
                ))}
            </ol>
            <div class="carousel-inner text-center">
            <h3 className="category">Sponsori</h3>
                {sponsori.map((sponsor, index) => (
                <div {...(index == 0 ? { className: 'carousel-item text-center active' } : { className: 'carousel-item text-center' })}>
                    <img className="d-block w-100" src={sponsor.url} alt={sponsor.nume}/>
                    {(sponsor.link.length > 2) && <div><hr/><h5><a href={sponsor.link} target="_blank">{sponsor.text}</a></h5><br/></div>}
                    {(sponsor.link.length <= 2 && sponsor.text.length > 2) && <div><hr/><h5>{sponsor.text}</h5><br/></div>}
                </div>
                ))}
            </div>
        </div>
    )
}
