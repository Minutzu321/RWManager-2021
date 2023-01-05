import React, { Component }  from 'react';
const dbutoane = [
    // {
    //     continut: "Altb",
    //     target: "_blank",
    //     href: "javascript:void(0)",
    //     class: "nav-link",
    //     icon: "now-ui-icons arrows-1_share-66",
    // },
    // {
    //     continut: "Aplica pentru un rol",
    //     target: null,
    //     href: null,
    //     class: "nav-link btn btn-neutral",
    //     icon: "",
    // },
]

const facebookLink = "https://www.facebook.com/RTRWTulcea",
      instaLink = "https://www.instagram.com/riverwolves.049/",
      ltgmLink = "https://liceulmoisil.ro/",
      ltgmTitlu = "LTGM",
      ltgmRel = "Liceul Teoretic Grigore Moisil";
const Navbar = ({butoane}) => {
return(
<nav className="navbar navbar-expand-lg bg-primary fixed-top navbar-transparent " color-on-scroll="400">
    <div className="container">
        <div className="navbar-translate">
            <a className="navbar-brand" target="_blank" href={ltgmLink} rel="noreferrer" rel="tooltip" title={ltgmRel} data-placement="bottom">
            {ltgmTitlu}
            </a>
            <button className="navbar-toggler navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-bar top-bar"></span>
                <span className="navbar-toggler-bar middle-bar"></span>
                <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
        </div>
        <div className="collapse navbar-collapse justify-content-end" id="navigation">
            <ul className="navbar-nav">
                {butoane.map((buton) => (
                    <li className="nav-item">
                        <a className={buton.class} target={buton.target} href={buton.href} rel="noreferrer">
                            <i className={buton.icon}></i>
                            <p>{buton.continut}</p>
                        </a>
                    </li>))}
                <li className="nav-item">
                    <a className="nav-link" rel="tooltip" title="Da-ne un like pe Facebook" data-placement="bottom" href={facebookLink} target="_blank" rel="noreferrer">
                        <i className="fab fa-facebook-square"></i>
                        <p className="d-lg-none d-xl-none">Facebook</p>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" rel="tooltip" title="Urmareste-ne pe Instagram" data-placement="bottom" href={instaLink} target="_blank" rel="noreferrer">
                        <i className="fab fa-instagram"></i>
                        <p className="d-lg-none d-xl-none">Instagram</p>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
)
}

Navbar.defaultProps = {
    butoane: dbutoane,
}

export default Navbar
