import User from "../models/user.js"

export const registerForm = (req, res) => {
    res.render('users/register')
}

export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)

        req.login(registeredUser, err => {
            if (err)
                return next(err)
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

export const loginForm = (req, res) => {
    res.render('users/login')
}

export const loginUser = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}

export const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out!')
        res.redirect('/campgrounds')
    })
}

