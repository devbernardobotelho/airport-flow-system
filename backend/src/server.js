const express = require('express');
const sequelize = require('./config/database');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const controllerDir = path.join(__dirname, 'controller');

fs.readdirSync(controllerDir).forEach((file) => {
    if (file.endsWith('Controller.js')) {
        const entityName = file.replace('Controller.js', '').toLowerCase();
        const controller = require(path.join(controllerDir, file));

        app.use(`/${entityName}`, controller);
        console.log(`Controller registrado: /${entityName}`);
    }
});

sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Servidor rodando e sincronizado!'));
});