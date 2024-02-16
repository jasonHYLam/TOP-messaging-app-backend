const bcrypt = require('bcryptjs');

const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

function initializePassport(passport) {

    // when is this called?
    passport.use(
        new LocalStrategy( async (username, password, done) => {
            try {
                const user = await User.findOne({ username: username })
                // console.log('seeking user')
                if (!user) {
                    // what happens after this
                    console.log('checking username... ')
                    console.log(username)
                    return done(null, false, { message: 'Incorrect username '})
                }

                const match = await bcrypt.compare(password, user.password)
                // console.log('check if match is true')
                // console.log(match)
                if (!match) {
                    console.log('no match ?!?!?!?')
                    console.log('checking username and password!!!')
                    console.log(username)
                    console.log(password)
                    return done(null, false, { message: 'Incorrect password'})
                }

                // console.log('please work')
                return done(null, user);
            }
            catch(err) {
                // console.log('a senior moment perhaps')
                return done(err)
            }

        })
    )

    passport.serializeUser((user, done) => {
        // console.log('serializeUser')
        // console.log(user)
        // console.log(user.id)
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        // console.log('deserializeUser')
        // console.log('what is id?')
        // console.log(id)
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch(err) {
            done(err)
        } 
    })

}

module.exports = initializePassport;