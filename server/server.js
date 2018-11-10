var express=require('express')
var bodyParser=require('body-parser')
var {ObjectID}=require('mongodb')

var {mongoose}=require('./db/mongoose.js')
var {Todo}=require('./models/todo')
var {User}=require('./models/user')

var app=express()
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

app.listen(3000,()=>{
  console.log('Started on port 3000');
})

module.exports={app}
