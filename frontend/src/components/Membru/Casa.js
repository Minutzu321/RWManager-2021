import {React, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useForm } from "react-hook-form";
import 'react-html5-camera-photo/build/css/index.css';
import Modal from "react-bootstrap/Modal";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { QRCode } from 'react-qrcode-logo';
import Sponsori from '../Sponsori';


const Casa = ({client, pk}, ref) => {
    const [rezervari, setRezervari] = useState([]);
    const [areRezervare, setAreRezervare] =useState(false);

    const [modalDeschis, setModalDeschis] =useState(false);
    const [modalMesaj, setModalMesaj] = useState('');
    const [qr, setQR] = useState('');

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        client.send(JSON.stringify({
            'comanda': 'adauga_echipa',
            'argumente': [data.nume, data.tel, parseInt(data.pers), parseInt(data.dif), !data.green, parseInt(data.skips)]
        }));

        setValue("nume", "");
        setValue("tel", "");
        setValue("pers", 0);

    }

    const handleOnSelect = (item) => {
        setAreRezervare(false);
        setValue("nume", item.nume);
        setValue("tel", item.tel);
        setValue("pers", item.pers);
      }

      const resetF = (item) => {
        setValue("nume", "");
        setValue("tel", "");
        setValue("pers", 0);
        setValue("skips", 0);
      }

    useImperativeHandle(ref, () => ({
        onmessage(message) {
            let data = JSON.parse(message.data);
            if(data.comanda == "send_rezervari"){
                setRezervari(data.argumente);
            }
            if(data.comanda == "send_qr"){
                setModalMesaj(data.argumente[1])
                setQR("https://ro049.com/th/?riverwolves_treasurehunt_id="+data.argumente[0]); 
                setModalDeschis(true);
            }
        }
    }));


return (
    <div>
        <h1>Casa de marcat</h1>

    <Modal show={modalDeschis} onHide={() => setModalDeschis(false)}>
        <Modal.Body>
            <h3>{modalMesaj}</h3>
            <QRCode value={qr} logoImage="https://ro049.com/static/img/logo-transparent.png" size="400" qrStyle="dots" ecLevel="H"/>
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-danger" onClick={() => setModalDeschis(false)}>Ok</button>
        </Modal.Footer>
    </Modal>

    {
        (areRezervare)?<button className="btn btn-primary btn-round" type="button" onClick={() => setAreRezervare(false)}>Nu are rezervare?</button>
        :
        <button className="btn btn-primary btn-round" type="button" onClick={() => {resetF(); setAreRezervare(true)}}>Are rezervare?</button>
    }
    {areRezervare && <div className="card-body">
        <label>Nume/Numar de telefon de la rezervare</label>
        <ReactSearchAutocomplete
         items={rezervari}
         fuseOptions={{ keys: ["nume", "tel"] }}
         resultStringKeyName="nume"
         onSelect={handleOnSelect}
        />
    </div>
    }
    {!areRezervare && <div className="card-body">
        <form id="echform" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label for="echipa_nume">Nume</label>
                <input type="text" className="form-control" id="echipa_nume" placeholder="Nume" {...register("nume", { required: true })}/>
                {errors.nume && <span style={{color: 'red'}}>Campul acesta este obligatoriu</span>}
            </div>
            <div className="form-group">
                <label for="echipa_tel">Numar de telefon</label>
                <input type="number" min="10" className="form-control" id="echipa_tel" placeholder="Numar de telefon" {...register("tel", { required: true })}/>
                {errors.tel && <span style={{color: 'red'}}>Campul acesta este obligatoriu</span>}
            </div>
            <div className="form-group">
                <label for="echipa_dif">Dificultate</label>
                <select className="form-control" id="echipa_dif" {...register("dif")}>
                    <option value="0">Mediu</option>
                    <option value="1">Greu</option>
                </select>
            </div>
            <div className="form-group">
                <label for="echipa_pers">Persoane</label>
                <select className="form-control" id="echipa_pers" {...register("pers")}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div className="form-group">
                <label for="echipa_pers">Skips</label>
                <select className="form-control" id="echipa_pers" {...register("skips")}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>
            <div class="form-check">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" value="" {...register("green")}/>
                    FARA Voucher GreenGym?
                    <span class="form-check-sign">
                        <span class="check"></span>
                    </span>
                </label>
            </div>
            <hr/>
            <input className="btn btn-success btn-round" type="submit" />
        </form>
    </div>
    }
</div>
    )
}

export default forwardRef(Casa)
