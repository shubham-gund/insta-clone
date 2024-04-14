const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://shubhamgund91:hhwqRKzTBZxmkCFO@cluster1.a2diun8.mongodb.net/");
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