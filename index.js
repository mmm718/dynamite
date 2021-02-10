const express = require('express')
const app = express()
const port = 5000


const config = require('./config/key')

const bodyParser = require('body-parser')
const {User} = require("./models/User")

// aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// aplication/json
app.use(bodyParser.json())


// const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://m:12345678910@m.eosql.mongodb.net/m?retryWrites=true&w=majority', {
//     useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false
// }).then(() => console.log('MogoDB Connected...'))
// .catch(err => console.log(err))


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MogoDB Connected...'))
.catch(err => console.log(err))





app.get('/', (req, res) => res.send('안녕하세요.'))



// register router
app.post('/register', (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 클라이언트에서 가져오면
    // 그것들을 DB에 넣어준다.

    const user = new User(req.body)
    
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})



app.listen(port, () => console.log(`Express app listening on port ${port}`))