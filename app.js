const express               =  require('express'),
      expSession            =  require("express-session"),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user"),
      mongoSanitize         =  require("express-mongo-sanitize"),
      rateLimit             =  require("express-rate-limit"),
      xss                   =  require("xss-clean"),
      helmet                =  require("helmet")

//Connecting database
mongoose.connect("mongodb://127.0.0.1:27017/SNOWJOY");

app.use(expSession({
    secret:"mysecret",       //decode or encode session
    resave: false,          
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 1000 //10 minutes
    }
}))

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));


//=======================
//      O W A S P
//=======================
//data sanitization against NoSQL injection attacks
app.use(mongoSanitize());

//preventing brute force & dos attacks - tate limiting
const limit = rateLimit({
    max: 100, //max requests
    windowMs: 60 * 60 * 1000, //1 hour of 'ban' / lockout
    message: 'Too many requests' //message to send
});
app.use('/routeName', limit); //setting limiter on spectific route

//preventing dos attacks - body parser
app.use(express.json({limit: '10kb'})); //body limit is 10

//data sanitization against xss attacks
app.use(xss());

//helmet to secure connection and data
app.use(helmet());

//=======================
//      R O U T E S
//=======================
app.get("/", (req,res) =>{
    res.render("home");
})
app.get("/products", (req, res) => {
  res.render("products");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/successfulLogin" ,(req,res) =>{
    res.render("successfulLogin");
})
app.get("/successfulRegister", (req, res) => {
  res.render("successfulRegister");
});
//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/successfulLogin",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username,email: req.body.email,phone: req.body.phone}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/successfulRegister");
        })    
    })
})

// app.get("/logout",(req,res)=>{
//     req.logout(req.user, (err) => {
//       if (err) return next(err);
//       res.redirect("/");
//     });
// });

app.get("/logout", function (req, res) {
  req.logout();
  res.status(200).clearCookie("connect.sid", {
    path: "/",
  });
  // res.redirect('/');
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Listen On Server
app.listen(process.env.PORT || 5000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 5000");  
    }
});