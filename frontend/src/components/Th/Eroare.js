import React from 'react'

function Eroare({mesaj}) {
    return (
        <>
            <h2 style={{color: "red"}}><b>{mesaj}</b></h2>
            <button className="btn btn-primary" onClick={() => {window.location.href = "https://ro049.com/th/";}}>Incearca din nou</button>
        </>
    )
}

export default Eroare
