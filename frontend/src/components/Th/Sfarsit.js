import {React, useEffect, useState} from 'react'
import Sponsori from '../Sponsori';

export default function Sfarsit({ranks, nume}) {
    const [arataMediu, setArataMediu] = useState(false);
    const [arataGreu, setArataGreu] = useState(false);


    function sort_ranks(a, b){
        if(a.inds > b.inds)
            return -1;
        return 1;
    }


    return (<>
        <div className="card col-md-10 ml-auto col-xl-5 mr-auto">
            <h2><b>Jocul s-a terminat</b></h2>
            <h3>Vă rugăm să vă întoarceti la Casa Avramide pentru a participa la tombolă și pentru a lua pozele de la Photo Booth</h3>
            <h6>PENTRU A EVITA AGLOMERAȚIA, VĂ RUGĂM SĂ INTRAȚI MAXIMUM 2 PERSOANE/ECHIPĂ</h6>
            <h6 style={{color: 'red'}}>REZULTATELE JOCULUI SUNT MAI JOS</h6>
            <hr/>
            <Sponsori/>
            <hr/>
            <h4><b>REZULTATE DIFICULTATE MEDIE</b></h4>
            {
                ranks.filter(rnk => rnk.dif === 0).sort((a, b) => sort_ranks(a, b)).map((rank, index) => (
                    (index===0)?<>
                        <h1><b>Locul 1</b> {rank.nume}</h1><hr/>
                    </>:(index===1)?<>
                        <h2><b>Locul 2</b> {rank.nume}</h2><hr/>
                    </>:(index===2)?<>
                        <h3><b>Locul 3</b> {rank.nume}</h3><hr/>
                    </>:(index===3)?<>
                        <h4><b>Mentiune 1</b> {rank.nume}</h4><hr/>
                    </>:(index===4)?<>
                        <h4><b>Mentiune 2</b> {rank.nume}</h4><hr/>
                    </>:<><h5><b>Rank #</b><b>{index+1}</b> {rank.nume}</h5><hr/></>
                    
                ))
            }
            <h4><b>REZULTATE DIFICULTATE GREA</b></h4>
            {
                ranks.filter(rnk => rnk.dif === 1).sort((a, b) => sort_ranks(a, b)).map((rank, index) => (
                    (index===0)?<>
                        <h1><b>Locul 1</b> {rank.nume}</h1><hr/>
                    </>:(index===1)?<>
                        <h2><b>Locul 2</b> {rank.nume}</h2><hr/>
                    </>:(index===2)?<>
                        <h3><b>Locul 3</b> {rank.nume}</h3><hr/>
                    </>:(index===3)?<>
                        <h4><b>Mentiune 1</b> {rank.nume}</h4><hr/>
                    </>:(index===4)?<>
                        <h4><b>Mentiune 2</b> {rank.nume}</h4><hr/>
                    </>:<><h5><b>Rank #</b><b>{index+1}</b> {rank.nume}</h5><hr/></>
                    
                ))
            }
        </div>
        </>
    )
}
