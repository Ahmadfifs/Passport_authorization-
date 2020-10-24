
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/login' , (req ,res) => {
    res.render('login');
})

router.get('/register' , (req ,res) => {
    res.render('register');
})


router.post('/register' , (req , res) => {
    const {name , email , password } = req.body;

    if (!name || !email || !password){
        res.send('Error')
    } else {
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




