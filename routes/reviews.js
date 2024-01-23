import express from 'express';
import Campground from '../models/campground.js';
import catchAsync from '../utils/catchAsync.js';
import Review from '../models/review.js';
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware.js';
import * as reviewController from '../controllers/reviews.js';
const router = express.Router({ mergeParams: true });



router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

export default router