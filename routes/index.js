const express=require("express");
const router=express.Router();
const shortId=require('shortid');
const ShortUrl=require('../models/shortUrl');
const {ensureAuthenticated}=require('../config/auth');


router.get('/',(req,res)=>
{
    res.render('welcome');
})


router.get('/dashboard',ensureAuthenticated,async (req,res)=>{
    const shortUrls=await ShortUrl.findOne({email:req.user.email},function(err,foundUrls){
        if(foundUrls){
        res.render('dashboard',{name:req.user.name,shortUrls:foundUrls.short,fullUrls:foundUrls.full});
        }
        else{
            res.render('dashboard',{name:req.user.name,shortUrls:[],fullUrls:[]});
        }
    
   
})});

router.post('/dashboard',async (req,res,next)=>{
    
    const lurl=req.body.fullUrl;
    const baseUrl="https://intense-citadel-50177.herokuapp.com";
    const mail=req.user.email;
    const code=shortId.generate();
    const short=baseUrl+'/'+code;
    console.log(req.user.email);
    const foundUrls=await ShortUrl.findOne({email:req.user.email});
    if(foundUrls)
    {
        
        foundUrls.full.push(lurl);
        foundUrls.short.push(short);
        foundUrls.urlcode.push(code);
        foundUrls.save();
    }
    else
    {
    var newUrl=new ShortUrl({
        email:mail,
        full:lurl,
        urlcode:code,
        short:short
        
    });
    await newUrl.save();
}
    
    
    
    console.log('item-Saved');
    res.redirect('/dashboard');
});
router.get('/:shortUrl',async (req,res)=>{
    console.log("here");
    const shortUrl=await ShortUrl.findOne({urlcode:req.params.shortUrl});
    if(shortUrl)
    {
        await shortUrl.save();
    res.redirect(shortUrl.full[shortUrl.urlcode.indexOf(req.params.shortUrl)]);
    }
    else{
        return res.sendStatus(404);
    }
  
    
  })
module.exports=router;