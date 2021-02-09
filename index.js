const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://m:12345678910@m.eosql.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAnModify: false
}).then(() => console.log('MogoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => res.send('안녕하세요.'))

app.listen(port, () => console.log(`Express app listening on port ${port}`))