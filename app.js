const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs',
    port: 3307
});

app.use(bodyParser.json())

// SELECT ALL 
app.get('/', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        }

        connection.query('SELECT * FROM my_table', (error, result) => {
            if (error) {
                return res.status(401).json({
                    message: 'Some thing went wrong'
                });
            }

            res.status(200).json(result);
        });
    });
});

// SELECT BY ID
app.get('/:id', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query('SELECT * FROM my_table WHERE id = ?', [req.params.id], (error, result) => {
            connection.release();

            if (error) {
                return res.status(401).json({
                    message: 'Some thing went wrong'
                });
            }

            res.status(200).send(result);
        });
    });
});

// DELETE BY ID
app.delete('/:id', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query('DELETE FROM my_table WHERE id = ?', [req.params.id], (error, result) => {
            connection.release();

            if (error) {
                return res.status(401).json({
                    message: 'Some thing wend wrong'
                });
            }

            res.status(200).json({
                message: 'id' + req.params.id + ' deleted from database'
            });
        });
    });
});

// ADD RECORD( TO DATABASE
app.post('/', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const values = {
            name: req.body.name,
            lastname: req.body.lastname,
            phone: req.body.phone,
            photo: req.body.photo
        }
        console.log(values);
        connection.query(`INSERT INTO my_table SET ?`, values, (error, result) => {
            connection.release();
            if (error) {
                return res.status(401).json({
                    error: error
                });
            }

            res.status(200).json({
                message: 'record added to database'
            });
        });
    });
});

// UPDATE RECORD 
app.put('/', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const {id, name, lastname, phone, photo} = req.body;
        connection.query('UPDATE my_table SET name = ?, lastname = ?, WHERE id = ?', [name, lastname, id], (error, result) => {
            connection.release();
            if (error) {
                return res.status(401).json({
                    error: error
                });
            }

            res.status(200).json({
                message: 'record updated successfully'
            });
        })
    })
})

module.exports = app;