const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Restaurant = require('./models/restaurant'); //載入 restaurant model
// 引用 body-parser
const bodyParser = require('body-parser');

const app = express();
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // 設定連線到 mongoDB

const port = 3000;

// 取得資料庫連線狀態
const db = mongoose.connection;
// 連線異常
db.on('error', () => {
    console.log('mongodb error!');
});
// 連線成功
db.once('open', () => {
    console.log('mongodb connected!');
});

// load json
const restaurantList = require('./restaurant.json');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// index首頁
app.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .then((restaurants) => res.render('index', { restaurants }))
        .catch((error) => console.error(error)); // 錯誤處理
});

// 新增一家餐廳
app.get('/restaurants/new', (req, res) => {
    const columns = ['name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'description'];
    return res.render('new', { columns });
});

// Create
app.post('/restaurants', (req, res) => {
    const { name, name_en, category, image, location, phone, google_map, description }= req.body; // 從 req.body 拿出表單裡的資料
    return Restaurant.create({ name, name_en, category, image, location, phone, google_map, description }) // 存入資料庫
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch((error) => console.log(error));
});

// 修改餐廳資訊

// 刪除一家餐廳

// show
app.get('/restaurants/:id', (req, res) => {
    // 模板的this._id，_id等同id，因為/restaurants/:id的路由":id"。
    const id = req.params.id;
    return Restaurant.findById(id)
        .lean()
        .then((restaurant) => {
            res.render('show', { restaurant });
        })
        .catch((error) => console.error(error));
});

// search
app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    const restaurants = restaurantList.results.filter((item) => {
        return (
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.category.toLowerCase().includes(keyword.toLowerCase())
        );
    });
    res.render('index', { restaurants: restaurants, keyword: keyword });
});

app.listen(port, () => {
    console.log(`express is running in localhost:${port}`);
});
