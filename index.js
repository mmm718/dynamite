const express = require('express')
const app = express()
const port = 5000

const {auth} = require('./middleware/auth')

const cookieParser = require('cookie-parser')

const config = require('./config/key')

const bodyParser = require('body-parser')
const {User} = require("./models/User")

// aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// aplication/json
app.use(bodyParser.json())

app.use(cookieParser())


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
app.post('/api/users/register', (req, res) => {
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


app.post('/api/users/login', (req, res) => {

    // 요청된 이메일을 DB에서 있는지 찾는다.(중복확인)
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json (
                {
                    loginSuccess: false,
                    message: "이메일을 확인해주세요."
                })
        }

        // 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인
        user.comparePassword( req.body.password, (err, isMatch) => {
            if(!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호를 확인해주세요."})

            // 비밀번호가 맞다면 토큰을 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)
                
                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지, 섹션
                // 쿠키에 저장
                 res.cookie("x_auth", user.token)
                 .status(200)
                 .json({loginSuccess: true, userId: user._id})
            })
        })
    })
})



// Auth
app.get('/api/users/auth', auth, (req, res) => {

    // 여기까지 미들웨어를 통과해 왔다는 이야기는
    // Authentication이 true라는 말
    res.status(200).json({
        _id: req.user._id,

        // role이 0이면 일반유저,  role이 0이 아니면 관리자
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

})



app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id }, 
        { token: "" },
        (err, user) => {
            if(err) return res.json({ success: false, err})
            return res.status(200).send({
                success: true
            })
        })
})



app.listen(port, () => console.log(`Express app listening on port ${port}`))    