import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isLoggedIn, isAuthor, validateCampground } from '../middleware.js';
import * as campgroundController from '../controllers/campgrounds.js';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
const upload = multer({ storage })

const router = express.Router();

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground))


router.route('/new')
    .get(isLoggedIn, campgroundController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgroundController.editForm))

export default router