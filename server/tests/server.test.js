const expect=require('expect')
const request=require('supertest')
const {ObjectID}=require('mongodb')

const {app}=require('./../server')
const {Todo}=require('./../models/todo')
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

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos)
  }).then(()=>done())
})

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo text'

    request(app).post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text)
    }).end((error,res)=>{
      if (error) {
        done(error)
      }

      Todo.find({text:text}).then((result)=>{
        expect(result.length).toBe(1)
        expect(result[0].text).toBe(text)
        done()
      }).catch ((e)=>done(e))

    })

  })

  it('should not create todo with invalid body data',(done)=>{
    request(app).post('/todos').send({}).expect(400).end((err,res)=>{
      if(err)
        done(err)

        Todo.find().then((result)=>{
          expect(result.length).toBe(2)
          done()
        }).catch((e)=>done(e))
    })
  })
})

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app).get('/todos')
    .expect(200)
    .expect((req)=>{
      expect(req.body.length).toBe(2)
    }).end(done)
  })
})


describe('GET /todos/:id',()=>{
  it('should return todo doc',(done)=>{
    request(app).get('/todos/'+todos[0]._id.toHexString())
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(todos[0].text)
    }).end(done)
  })

  it('should return 404',(done)=>{
    request(app).get('/todos/'+new ObjectID().toHexString())
    .expect(404)
    .end(done)
  })

  it('should return 404 for non-object ids',(done)=>{
    request(app).get('/todos/123')
    .expect(404)
    .end(done)
  })

  })

describe('DELETE /todos/:id ',()=>{

  it('should remove todo',(done)=>{
    var hexID=todos[0]._id.toHexString()
    request(app).delete('/todos/'+hexID)
    .expect(200)
    .expect((res)=>{
      console.log(JSON.stringify(res.body,undefined,2));
      expect(res.body._id).toBe(hexID)
    }).end((err,res)=>{
      if(err){
        return done(err)
      }

      Todo.findById({_id:hexID}).then((todo)=>{
        expect(todo).toBeFalsy()
        done()
      }).catch((err)=>done(err))

    })
  })

  it('should return 404 if todo not found',(done)=>{
    var hexID=new ObjectID().toHexString()
    request(app)
    .delete('/todos/'+hexID)
    .expect(400)
    .end(done)

  })

  it('should return 404 if object id is invalid',(done)=>{
    request(app)
    .delete('/todos/'+123)
    .expect(404)
    .end(done)
  })

})

describe('PATCH /todos/:id',()=>{

  it('should update the todo',(done)=>{
    var id=todos[0]._id.toHexString()
    var newText="sorry"
    request(app)
    .patch('/todos/'+id)
    .send({text:newText, completed:true})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(newText);
      expect(typeof res.body.completedAt).toBe('number');
      expect(res.body.completed).toBe(true);
    })
    .end(done)

  })

  it('should clear completedAt when todo is not completed',(done)=>{
    var id=todos[0]._id.toHexString()
    var newText="sorry"
    request(app)
    .patch('/todos/'+id)
    .send({text:newText,completed:false})
    .expect(200)
    .expect((res)=>{
      expect(res.body.completedAt).toBeFalsy()
    }).end(done)

  })


})
