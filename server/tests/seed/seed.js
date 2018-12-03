const {ObjectID}=require('mongodb')
const {Todo}=require('./../../models/todo')
const {User}=require('./../../models/user')
const jwt = require('jsonwebtoken')

const todos=[
  {
    _id:new ObjectID(),
    text:'First test todo'
  },
  {
    _id:new ObjectID(),
    text:'Second test todo'
  }
]


const userOneID=new ObjectID()
const userTwoID=new ObjectID()

const users=[{
  _id:userOneID,
  email:"fhdalotaibi@hotmail.com",
  password:"userOnePassword",
  tokens:[
    {
    access:"auth",
    token:jwt.sign({_id:userOneID.toHexString(),access:"auth"},"abc123").toString()
    }
  ]
},{
  _id:userTwoID,
  email:"fhd.alotaibi@hotmail.com",
  password:"userTwoPassword",
}]


const populateTodo=(done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos)
  }).then(()=>done())
}

const populateUsers=(done)=>{
  User.remove({}).then(()=>{
    var userOne=new User(users[0]).save()
    var userTwo=new User(users[1]).save()
    return Promise.all([userOne,userTwo])
  }).then(()=>done()).catch((e)=>done(e))
}


module.exports={todos,populateTodo,users,populateUsers}
