var mongoose=require('mongoose')

var Todo= mongoose.model('Todo',{
  title:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  content:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  createdAt:{
    type:Number,
    default:null
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  }
})

module.exports={Todo}
