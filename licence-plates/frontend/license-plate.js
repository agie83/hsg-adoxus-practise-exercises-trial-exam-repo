'use strict';

const form = document.getElementById('license-plate-form');

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const qField = document.getElementById('q');
    const parentElement = qField.parentElement;
    const errorMessageContent = parentElement.querySelector('.invalid-feedback');
 
    const regex = /^([A-Z0-9-]){0,7}$/;
  
    const found = regex.test(qField.value);

    if (qField.value !== '' && !(found)) {
        qField.setCustomValidity('Sorry, the submitted license plate is not valid');
        errorMessageContent.textContent = qField.validationMessage;
    }
    else {
        qField.setCustomValidity("");
    }

    e.target.classList.add('was-validated');

    let formData = new FormData(form);
    let searchParams = new URLSearchParams(formData).toString();

    let filterList = document.getElementsByName('filter');

    for (let i = 0; i < filterList.length; i++) {
        if (filterList[i].checked) {
            searchParams = searchParams.replace('filter=', '') + "=1";
        }
    }

    if (e.target.checkValidity()) {

        let formAction = e.target.action;
        createTableWithCars(formAction + '?' + searchParams);
    }
});


function createTableRowsFromCars(carList) {

    if (!(carList)) {

        document.querySelector('table').classList.add('d-none');
        let errorDiv = document.querySelector('.error-message');
        errorDiv.textContent = 'Sorry, the submitted license plate is not valid';
        errorDiv.classList.remove('d-none');
        return;
    }

    document.querySelector('.error-message').classList.add('d-none');
    document.querySelector('table').classList.remove('d-none');
    document.getElementsByTagName('table')[0].innerHTML = ' <thead><tr><th >License plate</th><th >Brand</th><th >Model</th><th >Color</th><th >Year</th></tr></thead><tbody></tbody>';

    carList.forEach((car) => {

        let tr = document.createElement('tr');
        let properties = Object.getOwnPropertyNames(car);

        properties.forEach((prop) => {
            let td = tr.insertCell(-1);
            td.textContent = car[prop];

            if (prop === 'brand') {
                const brandUrl = form.action + '/' + car[prop];
                td.addEventListener('click', () => {
                    createTableWithCars(brandUrl);
                });
            }

        });

        document.getElementsByTagName('table')[0].appendChild(tr);
    });
}


async function getCarList(url) {
    const carListResponse = await fetch(url);
    const carList = await carListResponse.json();
    return (carList.result === 'ok') ? carList : false;
}

async function createTableWithCars(url) {
    const carList = await getCarList(url);
    createTableRowsFromCars(carList.data);
}
