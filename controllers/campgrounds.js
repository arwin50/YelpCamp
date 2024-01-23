import Campground from "../models/campground.js"
import { cloudinary } from "../cloudinary/index.js"
import * as maptilerClient from '@maptiler/client';

const maptilerKey = process.env.MAPTILER_API_KEY
maptilerClient.config.apiKey = maptilerKey




export const index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

export const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

export const createCampground = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

export const showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

export const editForm = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

export const updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

export const deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds')
}