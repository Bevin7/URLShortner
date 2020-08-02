const mongoose=require('mongoose');
const shortid = require('shortid');


const items={
    name:String
};
 
const shortUrlSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    full:{
        type:Array,
        required:true
    },
    urlcode:{
        type:Array,
        required:true
       
    },
    short:{
         type:Array,
         required:true
    }
},{collection:"urls"});

module.exports=mongoose.model('ShortUrl',shortUrlSchema);