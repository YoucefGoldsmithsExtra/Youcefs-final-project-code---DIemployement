module.exports = function(app, jobData) {
                                                                                                                                               
    const { check, validationResult } = require('express-validator');
                                                                                                                                               
                                                                                                                                               
    const redirectLogin = (req, res, next) => {
      if (!req.session.userId ) {
       res.redirect('./loginform')
      } else { next (); }
    }
                                                                                                                                               
    // route handler
    app.get('/',function(req,res){
        res.render('index.ejs', jobData)
    });
    app.get('/list', redirectLogin, function(req, res) {
        let sqlquery = "SELECT * FROM jobs"; 
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, jobData, {availableJobs:result});
            res.render("list.ejs", newData)
         });                                                                                                                                   
    });  
    
    
    //routes for login, logged in, register 
    app.get('/loginform',function(req,res){
        res.render("loginform.ejs", jobData);
    });
    

     app.post('/loggedin', function(req, res) {
    const bcrypt = require('bcrypt');
     let sqlquery = "SELECT password FROM userdetails WHERE username ='" + req.sanitize(req.body.username) + "'";
        db.query(sqlquery, (err, result) => {
            if (err) {
              res.redirect('./');
            }
     HS = result[0].hashedPassword;
     bcrypt.compare(req.sanitize(req.body.password), HS, function(err, result){
            if(err) {
              res.send(err);                                                                                                                   
            }
             else if (result == true) {
             req.session.userId = req.sanitize(req.body.username);                                                                             
             res.send("You've Logged in!"+ ' <a href='+'./'+'>Home</a>');
            }
            else {
           res.send("The passwords dont match: Login has failed!");
            }
         });                                                                                                                                   
                                                                            });
    });
    
    app.get('/logout', redirectLogin, (req,res) => {
     req.session.destroy(err => {
     if (err) {
     return res.redirect('./')
     }
     res.send('you are now logged out. <a href='+'./'+'>Home</a>');
     })
    })
                                                                                                                                               
                                                                                                                                                 
    app.get('/addjob',redirectLogin,  function (req,res) {
        res.render('addjob.ejs', jobData);
    });
    
 
    app.post('/jobadded',function (req,res){
          let sqlquery = "INSERT INTO jobs (role, type, Description, start) VALUES (?,?,?,?)";
          let newrecord = [req.body.role, req.body.type, req.body.Description, req.body.start];
          db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              return console.error(err.message);
            }
            else
            res.send(' The Vacancy has been saved, the name: '+ req.body.role  +  '<a href='+'./'+'>Home</a>');
          });
                                                                                                                                               
      });
           
    //delete job 
     app.get('/deletejob', redirectLogin,function(req,res){
        res.render("deletejob.ejs", jobData);                                                                                                

    });                                                                                                                                        

    //deleted job
    app.post('/jobdeleted', function(req, res) {
    let sqlquery = "DELETE FROM jobs WHERE role = '" + req.sanitize(req.body.role) + "'";
         // execute sql query
        db.query(sqlquery, (err, result) => {
                                                                                                                                               
                                                                                                                                               
            if (err) {
                res,send('error', err)
                                                                                                                                               
            }
                                                                                                                                               
           result = 'The following job has now been deleted : '  + req.sanitize(req.body.role) + '<a href='+'./'+'>Home</a>';
            res.send(result);                                                                                                                  
         });
                                                                                                                                               
    });
    
        app.get('/list', redirectLogin, function(req, res) {
        let sqlquery = "SELECT * FROM jobs"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, jobData, {availableJobs:result});
            res.render("list.ejs", newData)
         });
    });
         
    
 
    
    app.get('/register', function (req,res) {
        res.render('register.ejs', jobData);
    });
                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                         
    app.post('/registered',[check('email').isEmail().trim().escape().normalizeEmail(),
    check('username').notEmpty(), check('first').notEmpty().escape(), check('last').notEmpty().escape()],function (req,res) {
                                                                                                                                               
      const errors = validationResult(req);
       if (!errors.isEmpty()) {
        res.redirect('./register'); }
      else {
                                                                                                                                               

      const bcrypt = require('bcrypt');
      const saltRounds = 12;
      const plainPassword = req.sanitize(req.body.password);
                                                                                                                                               
      bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
         sqlquery = "INSERT INTO userdetails (firstname, lastname, email, username, hashedPassword) VALUES (?,?,?,?,?)";
         let newrecord = [req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email) , req.sanitize(req.body.usern
ame), hashedPassword];
         db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err, message);
         }
          else
             result = 'Hello '+ req.sanitize(req.body.first)  + ' '+ req.sanitize(req.body.last) +' you are now registered! We will send an email, your email is: ' + req.sanitize(req.body.email);
             result += 'Your current password is: '+ req.sanitize(req.body.password) + '<a href='+'./'+'>Home</a>' ;
             res.send(result);                                                                                                                 
            });
         })
       }
     });
    
                                                                                                                                     
                                                                                                                                               
                                                                                                                                               
                                                                                                                                               
}