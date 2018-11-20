const {mongoose}=require('./../server/db/mongoose')
const {Todo}=require('./../server/models/todo')

var id="5be6100bf8ee150700704279"
Todo.find({
  _id:id
}).then((result)=>{
  console.log('Todos',JSON.stringify(result,undefined,2));
}).catch((err)=>{
  console.log('unable to find todos',err);
})


Todo.findOne({
  _id:id
}).then((result)=>{
  console.log('Todo',JSON.stringify(result,undefined,2));
}).catch((err)=>{
  console.log('unable to find todos',err);
})


Todo.findById(id).then((result)=>{
  console.log('Todo by Id',JSON.stringify(result,undefined,2));
}).catch((err)=>{
  console.log('unable to find todos',err);
})
