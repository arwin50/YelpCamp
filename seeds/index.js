import mongoose from 'mongoose';
import cities from './cities.js';
import properties from './seedHelpers.js';
import Campground from '../models/campground.js';
import axios from 'axios';

main().then(() => console.log('Connected to the Database'))
    .catch(err => console.log('OHNO ERROR!', err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelpCamp');
}

const { descriptors, places } = properties;
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '65ac1fd997eada9c8ff7cfe6',
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dxiuysrao/image/upload/v1705875790/YelpCamp/download_rupmgh.jpg',
                    filename: 'YelpCamp/download_rupmgh',
                },
                {
                    url: 'https://res.cloudinary.com/dxiuysrao/image/upload/v1705875787/YelpCamp/download_1_dmenu8.jpg',
                    filename: 'YelpCamp/download_1_dmenu8',
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
              },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus architecto doloremque numquam sequi neque eveniet soluta eius, similique ex! Saepe, optio. Fuga voluptate rem tenetur aut est commodi cupiditate! Quis?',
            price
        })
        await camp.save();
    }

}

async function seedImg() {
    try {
        const resp = await axios.get('https://random.imagecdn.app/500/150', {
            params: {
                client_id: 'R7QI53li8M3OHw81Io6IjgnPtLfJDpmFC1KKGzMl_EM',
                collections: 483251,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})