// module importation
var express = require ('express')
var ejs = require('ejs')
var bodyParser= require ('body-parser')
var session = require ('express-session');
var validator = require ('express-validator');
                                                                                                                                               
                                                                                                                                               

const mysql = require('mysql');
const app = express()
const port = 8000
//database info
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'Ihavenoidea%12',
    database: 'DIemlpoyment'
});
                                                                                                                                               
const expressSanitizer = require('express-sanitizer');

app.use(expressSanitizer());                                                                                                                   
                                                                                                                                               
//database connection
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;                                                                                                                                
                                                                                                                                               
                                                                                                                                               
//server session                                                                                                                                            
app.use(session({
secret: 'somerandomstuff',
resave: false,
saveUninitialized: false,
cookie: {
expires: 600000                                                                                                                                
}
}));

                                                                                                                                             
app.use(bodyParser.urlencoded({ extended: true }))
                                                                                                                                               

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);
var jobData = {jobName: "DIemployment"}

require("./routes/main")(app, shopData);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
                                                                                                                             70,1          Bot