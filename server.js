const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session); // connect session with mongo 
const PORT = process.env.PORT || 4000; 
const bcrypt = require('bcrypt');
const app = express();


//EJS setup 
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

// add body middelware 
app.use(express.urlencoded({ extended: false }));

// db seteup
const db = process.env.MONGOURL;
const connect  = mongoose.createConnection(db , { useNewUrlParser : true , useUnifiedTopology: true });
const User = connect.model('User' , require('./models/User'));

const sessionStore = new MongoStore({
    mongooseConnection: connect,
    collection: 'session'
});





// add session middelwarw
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

require('./passport');
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})


app.get('/'  , (req , res) => {
    res.send('hello world');
})


app.get('/login'  ,  (req ,res) => {
    res.render('login');
})


app.post('/login' , passport.authenticate('local' , {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 

}));



app.get('/register' , (req ,res) => {
    res.render('register');
})


app.post('/register' , (req , res) => {
    const {name , email , password } = req.body;

    if (!name || !email || !password){
        res.send('Error')
    }else {
       User.findOne({ email : email})
        .then(user => {
            if(user){
                res.send('the user is alrey exist')
            } else {
                const user = new User({
                    name ,
                    email,
                    password
                });

                bcrypt.hash(user.password , 10 , (err , hash) => {
                    if(err) return
                    else {
                        user.password = hash;
                        user.save().then(user => {
                            res.redirect('login');
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                })
            }
        })
    }

})



app.get('/auth', checkAuthentication , (req , res ) => {
    res.send('hello there ');
})

app.get('/logout' , (req , res) => {
    req.logOut();
    res.redirect('/')
});


function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}

app.listen(PORT , () => {
    console.log('express server is running');
})



