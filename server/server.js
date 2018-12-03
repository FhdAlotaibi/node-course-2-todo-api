const config=require('./config/config.js')
const express=require('express')
const bodyParser=require('body-parser')
const {ObjectID}=require('mongodb')
const _=require('lodash')
const bcrypt=require('bcryptjs')

var {mongoose}=require('./db/mongoose.js')
var {Todo}=require('./models/todo')
var {User}=require('./models/user')
var {authenticate}=require('./middleware/authenticate')

var app=express()
const port=process.env.PORT

app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
  var todo=new Todo({
    text:req.body.text
  }) 

  todo.save().then((result)=>{
    res.send(result)
  },(error)=>{
    res.status(400).send(error)
  })
})

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send(todos)
  },(err)=>{
    res.status(400).send(err)
  })
})

app.get('/todos/:id',(req,res)=>{
  var id=req.params.id
  if (!ObjectID.isValid(id))
    return res.status(404).send("Todo not found")

    Todo.findById(id).then((todo)=>{
      if (!todo) {
      return res.status(404).send("Todo not found")
      }
      res.send(todo)
    }).catch((err)=>res.status(400).send(err))

})

app.delete('/todos/:id',(req,res)=>{
  var id=req.params.id
  if(!ObjectID.isValid(id))
    return res.status(404).send()

  Todo.findByIdAndRemove(id).then((result)=>{
    if(!result)
      return res.status(400).send("Todo not found")

    res.send(result)
  }).catch((err)=>{
    res.status(400).send(err)
  })
})


app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id
  var body=_.pick(req.body,['text','completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(400).send("Invalid Id")
  }

  if (_.isBoolean(body.completed) && _.isString(body.text)) {
    if (body.completed) {
      body.completedAt=new Date().getTime()
    }else{
      body.completedAt=null
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((result)=>{
      res.send(result)
    }).catch((error)=>{
      res.status(400).send()
    })
  }else {
    return res.status(400).send("invalid data format")
  }
})

app.post('/users',(req,res)=>{
  var body=_.pick(req.body,['email','password'])

  var newUser=new User(body)

  newUser.save().then(()=>{
    return newUser.generatAuthToken()
  }).then((token)=>{
    res.header('x-auth',token).send(newUser)
  }).catch((e)=>{
    res.status(400).send(e)
  })
})

app.get('/users/me',authenticate,(req,res)=>{
  res.send(req.user)
})

app.post('/users/login',(req,res)=>{
  var body=_.pick(req.body,['email','password'])
  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generatAuthToken().then((token)=>{
      res.header('x-auth',token).send(body)
    })
  }).catch((err)=>{
    console.log(err);
    res.status(400).send(err)
  })
})

app.listen(port,()=>{
  console.log('Started on port '+port);
})


module.exports={app}
