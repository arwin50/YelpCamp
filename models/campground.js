import mongoose from 'mongoose';
import Review from './review.js';

const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        url: String,
        filename: String
    }
)

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_100')
})

const opts = {toJSON: {virtuals: true}};


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `<strong><a href="/campgrounds/${this._id}" style="text-decoration:none;">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const CampGround = mongoose.model('CampGround', CampgroundSchema)


export default CampGround
