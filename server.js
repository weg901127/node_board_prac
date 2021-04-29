const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://aa:1234@cluster0.zxkqg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

app.listen(3000, function() {
    console.log('listening on 3000')
})

MongoClient.connect(url, {
    useUnifiedTopology: true
} , function(err, database) {
    if(err) {
        console.error("MongoDB 연결 실패", err);
        return;
    }
    console.log("Connected to Database")
    const db = database.db('test')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))
    });
    app.get('/', (req, res) => {
         //res.sendFile(__dirname + '/index.ejs')
        const cursor = db.collection('quotes').find().toArray()
            .then(results => {
                res.render('index.ejs', { quotes: results })
            })
            .catch(error => console.error(error))

    })
    // app.use , app.get , app.post, app.listen 사용해서 db작업!
})