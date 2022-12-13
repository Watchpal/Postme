import express from 'express';
import { index } from './routes/index.js';
import { users } from './routes/users.js';
import expressLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import { URI } from './config/keys.js';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import { Pass } from './config/passport.js';
import { posts } from './routes/posts.js';
import methodOverride  from 'method-override';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

Pass(passport);

const db = URI.MongoURI;

mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

app.use(express.urlencoded({ extended: false}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));