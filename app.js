const express = require('express')
const app = express()
const port = 5000
const bodyparser = require('body-parser')

// connect to database
var mysql = require('mysql');

app.use(bodyparser.json({limit: '50mb'}))

// get users
app.get('/users', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    connection.connect();
    connection.query('SELECT * FROM `users`', function (error, results, fields) {
    res.send(results)
    connection.end()
    });
})

// get user by id
app.get('/users/:id', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    connection.connect();
    connection.query(`SELECT * FROM users WHERE id = ${req.params.id}`, function (error, results, fields) {
    res.send(results)
    });
})

// add user
app.post('/users', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    let data = req.body;
    let inserted_id = "";
    connection.connect();
    connection.query(`INSERT INTO users (username, first_name, last_name, email) VALUES ('${data.username}', '${data.first_name}', '${data.last_name}', '${data.email}')`, function (error, results, fields) {
        inserted_id = results.insertId;
    });
    if (inserted_id !== "") {
        connection.query(`INSERT INTO address (UserID, ProvinceID, KhetID, KhwangID, Zipcode) VALUES ('${inserted_id}', '${data.province}', '${data.khet}', '${data.khwang}', '${data.zipcode}')`, function (error, results, fields) {
        });
    }
    connection.end()
})

// update user
app.put('/users/:id', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    let data = req.body;
    connection.connect();
    connection.query(`UPDATE users SET username = '${data.username}', first_name = '${data.first_name}', last_name = '${data.last_name}', email = '${data.email}', create_by="admin", last_update_by="admin" WHERE id = ${req.params.id}`, function (error, results, fields) {
    });
    connection.query(`UPDATE address SET ProvinceID = '${data.province}', KhetID = '${data.khet}', KhwangID = '${data.khwang}', Zipcode = '${data.zipcode}' WHERE UserID = ${req.params.id}`, function (error, results, fields) {
    });
    connection.end()
})

// delete user
app.delete('/users/:id', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    connection.connect();
    connection.query(`DELETE FROM users WHERE id = ${req.params.id}`, function (error, results, fields) {
    res.send(results)
    connection.end()
    });
})

// get province
app.get('/province/', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    connection.connect();
    connection.query(`SELECT * FROM Province`, function (error, results, fields) {
    res.send(results)
    });
})

// get khet
app.get('/khet/:province_id', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    connection.connect();
    connection.query(`SELECT * FROM Khet WHERE ProvinceID = ${req.params.province_id}`, function (error, results, fields) {
    res.send(results)
    connection.end()
    });
})

// get khwang
app.get('/khwang/:khet_id', (req, res) => {
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'interview'
    });
    connection.connect();
    connection.query(`SELECT * FROM Khwang WHERE KhetID = ${req.params.khet_id}`, function (error, results, fields) {
    res.send(results)
    connection.end()
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})