const express = require('express');
const app = express();

const port = 3000;

const exphbs = require('express-handlebars');

// load json
const restaurantList = require('./restaurant.json');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// index
app.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantList.results });
});

// show
app.get('/restaurants/:restaurant_id', (req, res) => {
    const restaurant = restaurantList.results.find((item) => item.id.toString() === req.params.restaurant_id);
    res.render('show', { restaurant: restaurant });
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
