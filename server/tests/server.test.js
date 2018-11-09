const expect=require('expect')
const request=require('supertest')

const {app}=require('./../server')
const {Todo}=require('./../models/todo')

const todos=[
  {text:'First test todo'},
  {text:'Second test todo'}
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
