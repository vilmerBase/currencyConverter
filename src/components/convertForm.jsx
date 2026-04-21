import {useState} from 'react';

import changeImg from '../images/change.png';
import copy from '../images/copy.png';
import loader from '../images/loader.svg';


export default function ConvertForm() {
    const [currencyImg,setCurrencyImg] = useState(0);

    let cur1optionCurrent = 0, 
    cur2optionCurrent = 0, 
    vCur1 = 0, vCur2 = 0;

    function changeCurrency () {
        cur1optionCurrent = document.querySelector('.currencyList1');
        cur2optionCurrent = document.querySelector('.currencyList2');
        vCur1 = cur1optionCurrent.value;
        vCur2 = cur2optionCurrent.value;
        if (vCur1!==vCur2) {
            cur1optionCurrent.value = vCur2;
            cur2optionCurrent.value = vCur1;
         }
        
    };

    return (
        <div className='convertContainer'>
        <form id='convertForm' name='convertForm' className='convertForm'>
            <div className="selectCurrency">
                <div>
                <select className='currencyList1 form-select' >
                    <option value='usd' name='usd' >  
                        USD
                    </option>
                    <option value='eur' name='euro'>
                        EURO
                    </option>
                    <option value='rub' name='rub'>
                        RUB
                    </option>
                    <option value='uah' name='uah'>
                        UAH
                    </option>
                </select>
                </div>
                <div className='changeLink'>
                <span>В</span>
                <img className='changeLink-img' src={changeImg} alt='link-image' onClick={changeCurrency}/>
                </div>
                <div>
                <select className='currencyList2 form-select'> 
                    <option value='usd' name='usd'>  
                        USD
                    </option>
                    <option value='eur' name='euro'> 
                        EURO
                    </option>
                    <option value='rub' name='rub'>
                        RUB
                    </option>
                    <option value='uah' name='uah'>
                        UAH
                    </option>
                </select>
                </div>
            </div>
            <div className="curValue">
                <img src={loader} alt="loader image" className='loaderImage'/>
                <span className='value' data-currency='none' data-value='0'>0</span>
                <img className='copyIcon' src={copy} onClick={copyVal}/>
                <span className='copied'>&#10004;</span>
            </div>
            <div className='currencyValue'>
                <label htmlFor='convertForm' >Введите сумму: </label>
                <div className='inputWrapper'> 
                <div className='currencyInfo'>
                <img src='' className='currencyImg' alt="currency logo" />
                <span className='currencyName'></span>
                </div>
                <input type="text" className="currentValue form-control" name='currentValue' pattern='^[0-9]*$' required/>
                </div>
            </div>
            <div className="calcResult">
                <button className='calcButton btn btn-primary btn-lg"' onClick={getCurrencies}>Рассчитать</button>
            </div>    
        </form>
    </div>
    );
};


async function getCurrencies (e) {
    let currentValInput = document.querySelector('input[name="currentValue"]').value;
    let curValueField = document.querySelector('.curValue .value'),
    loader = document.querySelector('.loaderImage'),
    curInfoBlock = document.querySelector('.currencyInfo'),
    curImg = document.querySelector('.currencyImg'),
    copyImg = document.querySelector('.copyIcon'),
    copied = document.querySelector('.copied');;
    let numPattern = /^[0-9]*$/;
    let curInfo = 0,
        curRates = [];

    if(currentValInput!=='' && numPattern.test(currentValInput)) {
        e.preventDefault();
        curValueField.style.display = 'none';
        curInfoBlock.style.display = 'none';
        loader.style.display = 'block';
        copyImg.style.display = 'block';
        copied.style.display = 'none';
        console.log(copyImg,copied)
        let cur1 = document.querySelector('.currencyList1 option:checked').value,
        cur2 = document.querySelector('.currencyList2 option:checked').value,
        curRes = 0,
        textValue = document.querySelector('.curValue > span'),
        curValue = document.querySelector('.currentValue').value;
        await fetch('https://currency-rate-exchange-api.onrender.com/'+cur1)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    curInfo = data;
                    curRates = curInfo.rates[cur1];
                    curRes= Math.round(curRates[cur2]*100)/100 * curValue;
                    textValue.textContent = cur2.toUpperCase()+': '+curRes.toFixed(2);
                    textValue.dataset.currency = cur2.toUpperCase();
                    textValue.dataset.value = curRes.toFixed(2);
                    curValueField.style.display = 'block';
                    curImg.src = curInfo.flagImage;
                    curInfoBlock.lastElementChild.textContent = cur1.toUpperCase()+':';
                    curInfoBlock.style.display = 'flex';
                    loader.style.display = 'none';
                }).catch(error =>{
                    alert(error+'\n'+'Ошибка запроса. Проверьте интернет-соединение.');
                });
    }

}


function copyVal () {
        let curValue = document.querySelector('.value').dataset.value,
        copyImg = document.querySelector('.copyIcon'),
        copied = document.querySelector('.copied');
      // Select the text field
      // curValue.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(curValue);
        copyImg.style.display = 'none';
        copied.style.display = 'inline';

};