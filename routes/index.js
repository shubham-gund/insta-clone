var express = require('express');
var router = express.Router();
const userModel=require('./users');
const postModel=require('./posts');
const passport = require('passport');
const localStratergy = require('passport-local');
const upload=require('./multer')
passport.use(new localStratergy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register',function(req,res){
  res.render("register");
});

router.post('/register',(req,res)=>{
  const userData =new userModel({
    username: req.body.username,
    password : req.body.password,
    email : req.body.email
  });
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
});

router.get('/profile',isLoggedIn,async function(req,res){
  const posts=await postModel.find().populate('user');
  const user=await userModel.findOne({username:req.session.passport.user}).populate("posts");

  res.render("profile",{ user: user, posts: posts });
})

router.get('/edit',isLoggedIn,async function(req,res){
  const user=await userModel.findOne({username:req.session.passport.user});
  res.render("edit",{ footer: true,user });
})

router.post('/update',isLoggedIn,upload.single('image'),async (req,res)=>{
  const user = await userModel.findOneAndUpdate(
    {username:req.session.passport.user},
    {name:req.body.name,bio:req.body.bio},
    {new:true});

    if(req.file){
      user.profileImage=req.file.filename;
    }
    await user.save();
    res.redirect('/profile');
});

router.get('/feed',isLoggedIn,async function(req,res){
  const posts=await postModel.find().populate('user');
  const user=await userModel.findOne({username:req.session.passport.user});
  res.render("feed",{ user: user, posts: posts });
})

router.post('/login',passport.authenticate("local",{
  failureRedirect:"/",
  successRedirect:"/profile",
}),function(req,res,next){
});

router.get('/upload',isLoggedIn,(req,res)=>{
  res.render('upload');
})
router.post('/upload',isLoggedIn,upload.single("image"),async (req,res)=>{
  const user=await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.create({
    picture:req.file.filename,
    user:user._id,
    caption:req.body.caption
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect('/feed');
})
router.get("/logout",(req,res,next)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

router.get('/search',isLoggedIn,async (req,res)=>{
  let user = await userModel.findOne({ username: req.session.passport.user });
    res.render('search',{user});
});

router.get('/like/post/:id',isLoggedIn,async (req,res)=>{
  const user = await userModel.findOne({username:req.session.passport.user});
  const post = await postModel.findOne({_id:req.params.id});

  if(post.likes.indexOf(user._id) === -1){
    post.likes.push(user._id);
  }else{
    post.likes.splice(post.likes.indexOf(user._id),1);
  }

  await post.save();
  res.redirect('/feed');
});

router.post('/posts/:id', async (req, res) => {
  try {
      const postId = req.params.id;
      // Delete the post from MongoDB by ID
      const deletedPost = await postModel.findByIdAndDelete(postId);
      if (!deletedPost) {
          return res.status(404).send("Post not found");
      }
      res.redirect('/profile');
  } catch (error) {
      console.error(error);
  }
});


router.get("/search/:user", isLoggedIn, async function (req, res) {
  const searchTerm = `^${req.params.user}`;
  const regex = new RegExp(searchTerm);

  let users = await userModel.find({ username: { $regex: regex } });

  res.json(users);
});






function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}
module.exports = router;
