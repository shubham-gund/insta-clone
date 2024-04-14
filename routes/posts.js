const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL);
const postSchema = mongoose.Schema({
  picture:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,ref:"user"
  },
  date:{
    type:Date,
    default:Date.now
  },
  caption:String,
  likes:[{
    type:mongoose.Schema.Types.ObjectId,ref:"user"
  }],
});

module.exports =mongoose.model('post',postSchema);;