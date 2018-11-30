const mongoose=require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken')
const _=require('lodash')
const bcrypt=require('bcryptjs')

var UserSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim:true,
    minlength:1,
    unique: true,
    validate:{
      validator:validator.isEmail,
      message:'is not valid email'
    }
  },
  password:{
    type:String,
    require:true,
    minlength:6
  },
  tokens:[
    {
      access:{
        type:String,
        require:true
      },
      token:{
        type:String,
        require:true
      }
    }
  ]
})

UserSchema.methods.toJSON=function (){
  var user=this
  var userObejct=user.toObject()
  return _.pick(userObejct,['_id','email'])
}
UserSchema.methods.generatAuthToken=function (){
  var user=this
  var access='auth'
  var token=jwt.sign({_id:user._id.toHexString(),access},"abc123").toString()

  user.tokens=user.tokens.concat([{access,token}])
  return user.save().then(()=>{
    return token
  })
}

UserSchema.statics.findByToken= function (token){
  var User=this
  var decode;

  try{
    decode=jwt.verify(token,"abc123")
  }catch(e){
    return Promise.reject()
  }

  return User.findOne({
    _id:decode._id,
    'tokens.token':token,
    'tokens.access':'auth'
  })
}

UserSchema.pre('save',function (next){
  var user=this
  if (user.isModified('password')) {
    bcrypt.genSalt(10,(err,salt)=>{
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password,salt,(err,hash)=>{
        if (err) {
          return next(err)
        }
        user.password=hash
        next()
      })
    })
  }else {
    next()
  }
})

var User = mongoose.model('User',UserSchema)

module.exports={User}
