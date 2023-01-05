import React from 'react'

const imgs = [
    {
        img: "static/img/poze/c14.jpg"
    },
    {
        img: "static/img/poze/c15.jpg"
    },
    {
        img: "static/img/poze/c16.webp"
    },
    {
        img: "static/img/poze/c17.webp"
    },
    {
        img: "static/img/poze/c1.webp"
    },
    {
        img: "static/img/poze/c2.webp"
    },
    {
        img: "static/img/poze/c3.webp"
    },
    {
        img: "static/img/poze/c5.webp"
    },
    {
        img: "static/img/poze/c6.webp"
    },
    {
        img: "static/img/poze/c7.webp"
    },
    {
        img: "static/img/poze/c8.jpg"
    },
    {
        img: "static/img/poze/c9.jpg"
    },
    {
        img: "static/img/poze/c10.jpg"
    },
    {
        img: "static/img/poze/c11.jpg"
    },
    {
        img: "static/img/poze/c12.webp"
    },
    {
        img: "static/img/poze/c13.webp"
    },
]

const Imagini = () => {
    return (
        <div className="section" id="carousel">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-12">
                <div id="imagini" className="carousel slide" data-ride="carousel">
                  <ol className="carousel-indicators">
                    {imgs.map((im, index) => (
                        <li data-target="#imagini" data-slide-to={index} {...(index == 0 ? { className: 'active' } : {})}></li>
                    ))}

                  </ol>
                  <div className="carousel-inner" role="listbox">
                    {imgs.map((im, index) => (
                        <div {...(index == 0 ? { className: 'carousel-item active' } : { className: 'carousel-item' })}>
                            <img className="d-block" src={im.img} alt=""/>
                            <div className="carousel-caption d-none d-md-block">
                            </div>
                        </div>
                        ))}

                  </div>
                  <a className="carousel-control-prev" href="#imagini" role="button" data-slide="prev">
                    <i className="now-ui-icons arrows-1_minimal-left"></i>
                  </a>
                  <a className="carousel-control-next" href="#imagini" role="button" data-slide="next">
                    <i className="now-ui-icons arrows-1_minimal-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Imagini
