const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();
const mongoose = require("mongoose");
// db seteup
const db = process.env.MONGOURL;
const connect = mongoose.createConnection(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const User = connect.model("User", require("./models/User"));

// custom fielsd
const customFields = {
	usernameField: "email",
	passwordField: "password",
};


const verifycallback = (email, password, done) => {
	User.findOne({ email }, function (err, user) {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, { message: "Incorrect username." });
		}

	bcrypt
			.compare(password, user.password)
			.then((result) => {
				if (result) {
					return done(null, user);
				} else {
					return done(null, false, { message: "error" });
				}
			})
			.catch((err) => {
				return err;
			});	
	});
};

const Strategy = new LocalStrategy(customFields, verifycallback);

passport.use(Strategy);

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {

    User.findById(id).then(user => (
        done(null , user)
    )).catch(err => done(err))
})