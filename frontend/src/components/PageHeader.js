import React, { Component }  from 'react';
const PageHeader = ({ titlu, subtitlu, subsubtitlu }) => {
    return (
        <div className="page-header clear-filter" filter-color="orange">
            <div className="page-header-image" data-parallax="true" style={{backgroundImage: 'url("../static/img/header.jpg")'}}/>
            <div className="container">
                <div className="content-center brand">
                    <img className="rvw-logo" src="/static/img/logo-contur.png" alt=""/>
                    <h1 className="h1-seo">{titlu}</h1>
                    <h3>{subtitlu}</h3>
                    <h5>{subsubtitlu}</h5>
                    <br/><br/>
                    <h3 className="category category-absolute">
                        <img src="/static/img/minerva.png" className="locali-logo-minerva" />
                    </h3>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                </div>
            </div>
        </div>
    )
}

PageHeader.defaultProps = {
    titlu: 'River Wolves',
    subtitlu: 'We howl. We work. We succeed. Toghether.',
    subsubtitlu: 'Romanian FTC Robotics team',
}


export default PageHeader
