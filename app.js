
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import ejsMate from 'ejs-mate';
import ExpressError from './utils/ExpressError.js';
import campgroundRoutes from './routes/campgrounds.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import MongoStore from 'connect-mongo';
const dbUrl = process.env.DB_URL
const port = process.env.PORT



main().then(() => console.log('Connected to the Database'))
    .catch(err => console.log('OHNO ERROR!', err));

async function main() {
    await mongoose.connect(dbUrl);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(ExpressMongoSanitize())

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    secret: 'thisshouldbeabettersecret!'
});

store.on('error',function(e){
    console.log('Session store error!',e)
})

const sessionConfig = {
    store,
    name:'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)



app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh no, something went wrong';
    res.status(statusCode).render('error', { err })

})


app.listen(port, () => {
    console.log('listening to port 3000');
})
