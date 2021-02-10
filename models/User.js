const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const saltRounds = 10

const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {

    var user = this

    if(user.isModified('password')) {

        // 비밀번호를 암호화 시킴
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else {
        next()
    }
})


userSchema.methods.comparePassword = function(planPassword, cb) {
    // planPassword 1234567외 
    // 암호화된 비밀번호 $2b$10$Cf6NHBOpihzPNKlvYRdEZ.ywlFTWaEyzDoQvU0Hj/B43dssckt5lW
    // 같은지 체크
    bcrypt.compare(planPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}


userSchema.methods.generateToken = function(cb) {
    
    var user = this

    // jsonwebtoken을 이용해서 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id


    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
    
}


const User = mongoose.model('User', userSchema)

module.exports = {User}
