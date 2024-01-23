import express from 'express';
const router = express.Router()
import User from '../models/user.js';
import catchAsync from '../utils/catchAsync.js';
import passport from 'passport';
import { storeReturnTo } from '../middleware.js';
import * as userController from '../controllers/users.js';


router.route('/register')
    .get(userController.registerForm)
    .post(catchAsync(userController.registerUser))

router.route('/login')
    .get(userController.loginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser)


router.get('/logout', userController.logoutUser)

export default router