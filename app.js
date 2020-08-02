const express=require("express");
const expressLayouts=require("express-ejs-layouts");
const mongoose=require("mongoose");
const flash=require("connect-flash");
const session=require("express-session");
const passport = require("passport");
const MongoStore=require("connect-mongo")(session);

const app=express();

require('./config/passport')(passport);


//DB config
const db=require('./config/keys').MongoURI;

//connect to DB
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log("MongoDB Conneted..."))
.catch(err =>console.log(err));

app.use(expressLayouts);
app.set("view engine","ejs");

app.use(express.urlencoded({extended:false}));

app.use(session({
   secret:'secret',
   resave:false,
   saveUninitialized:false,
   store:new MongoStore({mongooseConnection:mongoose.connection}),
   cookie:{maxAge:180*60*1000}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req,res,next){
   res.locals.session=res.session;
   res.locals.success_msg=req.flash('success_msg');
   res.locals.error_msg=req.flash('error_msg');
   res.locals.error=req.flash('error');
   next();

});

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT=process.env.PORT || 3000;


app.listen(PORT,()=>{
   console.log("Server is working");
})