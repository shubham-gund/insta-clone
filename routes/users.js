const mongoose=require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect(`mongodb+srv://shubhamgund91:${KEY}@cluster1.a2diun8.mongodb.net/`);
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