import express from 'express';
import { ensureAuth } from '../config/auth.js';
import { Post } from '../models/Post.js';
const router = express.Router();


router.get('/add', ensureAuth.ensureAuthenticated, (req, res) => {
    res.render('posts/add')
});

router.post('/', ensureAuth.ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Post.create(req.body)
    //console.log(req.body);
    res.redirect('/dashboard')
  } catch (err) {
    console.log(err)
  }
});


router.get('/', ensureAuth.ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({status: 'Public'})
        .populate('user')
        .lean()
        
        res.render('posts/index', {
          posts,
               })
               //console.log(posts);
  } catch (err) {
    console.log(err)
  }
});

router.get('/edit/:id', ensureAuth.ensureAuthenticated, async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id
  }).lean()

  if(post.user != req.user.id) {
    res.redirect('/posts')
  } else {
    res.render('posts/edit', {
      post,
    })
  }
});


router.put('/:id', ensureAuth.ensureAuthenticated, async (req, res) => {
  let post = await Post.findById(req.params.id).lean()

  if(post.user != req.user.id) {
    res.redirect('/posts')
  } else {
    post = await Post.findOneAndUpdate({ _id: req.params.id}, req.body, {
      new: true,
      runValidators: true
    })
    res.redirect('/dashboard')
  }
});

router.delete('/:id', ensureAuth.ensureAuthenticated, async (req, res) => {
  try {
    await Post.remove({_id: req.params.id})
    res.redirect('/dashboard')
               //console.log(posts);
  } catch (err) {
    console.log(err)
  }
});

export { router as posts };