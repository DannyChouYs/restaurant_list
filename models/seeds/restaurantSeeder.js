const mongoose = require('mongoose');
const Restaurant = require('../restaurant'); // 載入 todo model
const restaurantList = require('../../restaurant.json');
const restaurantListSeeds = restaurantList['results'];

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', () => {
    console.log('mongodb error!');
});
db.once('open', () => {
    // 創造假資料
    for (let i = 0; i < 8; i++) {
        Restaurant.create({
            name: restaurantListSeeds[i]['name'],
            name_en: restaurantListSeeds[i]['name_en'],
            category: restaurantListSeeds[i]['category'],
            image: restaurantListSeeds[i]['image'],
            location: restaurantListSeeds[i]['location'],
            phone: restaurantListSeeds[i]['phone'],
            google_map: restaurantListSeeds[i]['google_map'],
            description: restaurantListSeeds[i]['description'],
        });
    }
    console.log('done');
});
