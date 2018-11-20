const config=require('./config/config.js')
const express=require('express')
const bodyParser=require('body-parser')
const {ObjectID}=require('mongodb')
const _=require('lodash')

var {mongoose}=require('./db/mongoose.js')
var {Todo}=require('./models/todo')
var {User}=require('./models/user')

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

app.listen(port,()=>{
  console.log('Started on port '+port);
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

module.exports={app}
