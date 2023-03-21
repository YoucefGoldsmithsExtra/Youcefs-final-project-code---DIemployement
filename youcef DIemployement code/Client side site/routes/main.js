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
                                                                                                                                               
     app.get('/listusers',redirectLogin, function(req, res) {
     let sqlquery = "SELECT * FROM userdetails"; 
     db.query(sqlquery, (err, result) => {
           if (err) {
              res.redirect('./');
           }
           let newData = Object.assign({}, jobData, {availableUserdetails:result});
           res.render("listusers.ejs", newData)
        });
     });
    

    app.get('/search-result', [check('keyword').isAlpha().trim()], function(req, res) {
     const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.redirect('./search')}
     else {
    let sqlquery = "select * from jobs where role like '%" + req.query.keyword + "%'"; 
    db.query(sqlquery, (err, result) => {
          if (err) {
             res.redirect('./');
          }
         let newData = Object.assign({}, jobData, {availableJobs:result});
         res.render("list.ejs", newData)
       });
     }
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
             result = 'Hello '+ req.sanitize(req.body.first)  + ' '+ req.sanitize(req.body.last) +' you are now registered! We will send an ema
il to you at ' + req.sanitize(req.body.email);
             result += 'Your current password is: '+ req.sanitize(req.body.password) + '<a href='+'./'+'>Home</a>' ;
             res.send(result);                                                                                                                 
            });
         })
       }
     });
    
    
      app.get('/addjob',redirectLogin,  function (req,res) {
        res.render('addbook.ejs', jobData);
    });
    

    app.post('/jobadded',function (req,res){
          let sqlquery = "INSERT INTO recipe (name, typicalvalues, unit, carbs, fat, protein, salt, sugar, username) VALUES (?,?,?,?,?,?,?,?,?)
";
          let newrecord = [req.body.name, req.body.typicalvalues, req.body.unit, req.body.carbs, req.body.fat, req.body.protein, req.body.salt,
 req.body.sugar, req.body.username ];
          db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
              return console.error(err.message);
            }
            else
            res.send('Information recieved, thank you!'  +  '<a href='+'./'+'>Home</a>');
          });
                                                                                                                                               
      });
                                                                                                                                               
                                                                                                                                               
                                                                                                                                               
                                                                                                                                               
}