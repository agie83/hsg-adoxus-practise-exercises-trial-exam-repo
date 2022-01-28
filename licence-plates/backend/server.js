import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(cors());

app.get('/search/:brand', (req, res) => {

    const brand = (req.params.brand) ? req.params.brand : '';
    const licensePlateList = fs.readFileSync('license-plates.json', 'utf8');
    const licensePlateObj = JSON.parse(licensePlateList);
    const datasToFrontend = [];

    licensePlateObj.forEach((licensePlate) => {
        if (licensePlate.car_brand === brand) {
            datasToFrontend.push({
                "license": licensePlate.plate,
                "brand": licensePlate.car_brand,
                "model": licensePlate.car_model,
                "year": licensePlate.year,
                "color": licensePlate.color
            });
        }
    });

    res.json({
        "result": "ok",
        "data": datasToFrontend
    });
});

app.get(['/', '/search'], (req, res) => {

    const receivedQ = (req.query.q) ? req.query.q : '';
    let filter = '';
    if ((req.query.diplomat)) {
        filter = 'DT';
    }
    if((req.query.police)){
        filter = 'RB';
    }


    const licensePlateList = fs.readFileSync('license-plates.json', 'utf8');
    const licensePlateObj = JSON.parse(licensePlateList);
    const datasToFrontend = [];

    const regex = /^([A-Z0-9-]){0,7}$/g;
    const found = regex.test(receivedQ);

    if (receivedQ != '' && !(found)) {
        res.json({
            "result": "error",
            "data": "invalid input"
        });
        return;
    }

    licensePlateObj.forEach((licensePlate) => {

        if (filter === '' && ((licensePlate.plate.indexOf(receivedQ) > -1))) {
            datasToFrontend.push({
                "license": licensePlate.plate,
                "brand": licensePlate.car_brand,
                "model": licensePlate.car_model,
                "year": licensePlate.year,
                "color": licensePlate.color
            });
        }
        if (filter !== '' && ((licensePlate.plate.indexOf(receivedQ) > -1) && (licensePlate.plate.indexOf(filter) === 0))) {
            datasToFrontend.push({
                "license": licensePlate.plate,
                "brand": licensePlate.car_brand,
                "model": licensePlate.car_model,
                "year": licensePlate.year,
                "color": licensePlate.color
            });
        }
    })
    res.json({
        "result": "ok",
        "data": datasToFrontend
    });

})

app.listen(port, () => {

    console.log(`Az app a ${port}-s port-on fut.`);
});

