import express from 'express';
import { ensureAuth } from '../config/auth.js';
import { Post } from '../models/Post.js';
const router = express.Router();


router.get('/', (req, res) => res.render('welcome', { layout: '../views/layouts/extra'}));

router.get('/dashboard', ensureAuth.ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).lean()
    //console.log(posts)
    res.render('dashboard', {
      name: req.user.name,
      posts,
      pageName: 'dashboard'
    })
  } catch (err) {
    console.log(err)
  }


});


export { router as index };
