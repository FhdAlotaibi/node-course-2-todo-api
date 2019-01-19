const expect=require('expect')
const request=require('supertest')
const {ObjectID}=require('mongodb')

const {app}=require('./../server')
const {Todo}=require('./../models/todo')
const {User}=require('./../models/user')
const{todos,populateTodo,users,populateUsers}=require('./seed/seed.js')

beforeEach(populateTodo)
beforeEach(populateUsers)

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

describe('GET/users/me',()=>{

  it('should return user if authenticated',(done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString())
      expect(res.body.email).toBe(users[0].email)
    }).end(done)
  })

  it('should return 401 if user is not found',(done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    }).end(done)
  })

  it('should create a user',(done)=>{
    var email="fhd.alotaibi@gmail.com"
    var password="Asdf123@"
    request(app)
    .post("/users")
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy()
      expect(res.body._id).toBeTruthy()
      expect(res.body.email).toBe(email)
    }).end((err)=>{
      if(err){
        return done(err)
      }
      User.findOne({email}).then((user)=>{
        expect(user).toBeTruthy()
        expect(user.password).not.toBe(password)
        done()
      }).catch((err)=>done(err))
  })
  })

  it('should return validation error if request invalid',(done)=>{
    var email="dd"
    var password="A"
    request(app)
    .post("/users")
    .send({email,password})
    .expect(400)
    .end((err,res)=>{
      if (err) {
        return done(err)
      }else{
        console.log(res.body);
        return done()
      }
    })

  })
  it('should not create use if email is in use',(done)=>{
    var email="fhdalotaibi@hotmail.com"
    var password="A1234567#$%"
    request(app)
    .post("/users")
    .send({email,password})
    .expect(400)
    .end((err,res)=>{
      if (err) {
        return done(err)
      }else{
        console.log(res.body);
        return done()
      }

    })
  })
})

describe('POST /users/login',()=>{

  it('should login user and return auth token',(done)=>{
    request(app)
   .post('/users/login')
    .send({
      email:users[1].email,
      password:users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeTruthy()
      expect(res.body.email).toEqual(users[1].email)

    }).end((err,res)=>{
      if(err){
        return done(err)
      }
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[0]).toMatchObject({
          access:"auth",
          token:res.headers['x-auth']
        })
        done()
      }).catch((e)=>done(e))
    })
  })

  it('should reject invalid user',(done)=>{
    request(app)
    .post('/users/login')
    .send({email:users[1].email,password:users[1].password+"1"})
    .expect(400)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeFalsy()
    })
    .end((err,res)=>{
      if(err){
        return done(err)
      }
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(0)
        done()
      }).catch((err)=>done(err))
    })
  })
})
describe('DELETE /useres/me/token',()=>{

  it('should delete token on logout',(done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err)
        done(err)

      User.findById(users[0]._id).then((user)=>{
        console.log(JSON.stringify(user.tokens));
        expect(user.tokens.length).toEqual(0)
        done()
      }).catch((err)=>done(err))
    })

  })
})
