import mongoose from 'mongoose';

const PostSchecma = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Public',
    enum: ['Public', 'Private']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
});


const Post = mongoose.model('Post', PostSchecma);

export { Post };