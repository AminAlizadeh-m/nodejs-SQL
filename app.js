const express = require('express');
const app = express();
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs',
    port: 3307
})

// READ FROM SQL DATABASE
app.get('/', (req, res, next) => {
    pool.getConnection((err, connectin) => {
        if (err) {
            throw err;
        }

        connectin.query('SELECT * FROM my_table', (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'Some thing went wrong'
                });
            }

            res.status(200).send(result);
        });
    });
});

module.exports = app;