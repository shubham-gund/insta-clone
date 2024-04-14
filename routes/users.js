const mongoose=require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect(process.env.MONGODB_URL);
const userSchema = mongoose.Schema({
  username:String,
  name:String,
  email:String,
  password:String,
  profileImage:String,
  bio:String,
  posts:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}]
});
console.log("mongo connected");
userSchema.plugin(plm);
module.exports =mongoose.model('user',userSchema);;