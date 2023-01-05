import {React, useState, forwardRef, useImperativeHandle } from 'react'
import { Doughnut } from 'react-chartjs-2';

function sort_membri(a, b){
        if(a.status===0 && b.status !== 0)
            return -1;
        if(a.online && !b.online)
            return -1;
        if(a.perm > b.perm)
            return 1;
        if(a.rookie && !b.rookie)
            return 1;
        if(a.id > b.id)
            return 1;
        return 0;
}

const Useri = ({client, pk}, ref) => {
    const [membri, setMembri] = useState([])
    const [membriData, setMembriData] = useState([])
    const culoare = ["gray", "red", "orange", "blue", "yellow", "purple", "green", "brown"]

useImperativeHandle(ref, () => ({
    onmessage(message) {
        const data = JSON.parse(message.data);
        // console.log("USER",data);
        if(data.comanda == "membri"){
            setMembri(data.argumente);
            let md = [];
            
            for (let i = 0; i < membri.length; i++) {
                if(md.length == 0){
                    md.push({nume: membri[i].rol, p: 1})
                }else{
                    let gas = false;
                    for(let j = 0; j<md.length; j++)
                        if(md[j].nume === membri[i].rol){
                            md[j].p++;
                            gas = true;
                            break;
                            
                        }
                    if(!gas){
                        md.push({nume: membri[i].rol, p: 1})
                    }
                }
            }
            let lbls = [];
            let rezs = [];
            for (let i = 0; i < md.length; i++) {
                lbls.push(md[i].nume);
                rezs.push(md[i].p);
            }
            const datag = {
                labels: lbls,
                datasets: [
                  {
                    label: '# din roluri',
                    data: rezs,
                    backgroundColor: [
                      'rgba(234, 242, 227, 1)',
                      'rgba(97, 232, 225, 1)',
                      'rgba(242, 87, 87, 1)',
                      'rgba(242, 232, 99, 1)',
                      'rgba(242, 205, 96, 1)',
                      'rgba(48, 102, 190, 1)',
                      'rgba(175, 62, 77, 1)',
                      'rgba(169, 124, 115, 1)',
                    ],
                  },
                ],
              };
            setMembriData(datag);
        }
        if(data.comanda == "online"){
            let membri_updatati = membri;
            for (var i = 0; i < membri_updatati.length; i++) {
                if (membri_updatati[i].id == data.argumente[0]) {
                    membri_updatati[i].online = data.argumente[1];
                    break;
                }
            }
            setMembri(membri_updatati);
        }
    }
}), [])

return (
    <nodiv>
        <h2>Membri</h2>
        <h4>{membri.length}</h4>
        {/* <Doughnut data={membriData} /> */}
        <div className="row">
            {
                membri.sort((a, b) => sort_membri(a, b)).map((membru) => (
                    <div className="card col-md-10 ml-auto col-xl-5 mr-auto">
                        <div className="card-header mt-2">
                            <span {...(membru.online ? { className: 'badge badge-success' } : { className: 'badge badge-danger' })}>{membru.online ? "Online":"Offline"}</span>
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">{membru.nume}</h3>
                            <h5 className="card-text"><b>Rol: </b>{membru.rol}</h5>
                            <h5 className="card-text"><b>Email: </b>{membru.email}</h5>
                            <h5 className="card-text"><b>Data nasterii: </b>{membru.data_nastere}</h5>
                            {membru.telefon == undefined ? "":<h5 className="card-text"><b>Telefon: </b>{membru.telefon}</h5>}
                            {membru.activitate == undefined ? "":<h5 className="card-text"><b>Activitate: </b>{membru.activitate}%</h5>}
                            {membru.incredere == undefined ? "":<h5 className="card-text"><b>Incredere: </b>{membru.incredere}%</h5>}
                            {membru.status == undefined ? "":<ActiuniUser membru={membru} client={client}/>}
                        </div>
                    </div>
                ))
            }
        </div>
    </nodiv>
    )
}
function send(client, comanda, argumente) {
    client.send(JSON.stringify({
        'comanda': comanda,
        'argumente': argumente
    }));
}


const ActiuniUser = ({membru, client}) => {
    function accept() {
        send(client, "accept", [membru.id, true])
    }
    function refuz() {
        send(client, "accept", [membru.id, false])
    }
    if(membru.status===0)
        return (
            <nodiv>
                <button class="btn btn-success" onClick={accept}>Accepta</button>
                <button class="btn btn-danger" onClick={refuz}>Refuza</button>
            </nodiv>
    )
        return <nodiv/>
}

export default forwardRef(Useri)
