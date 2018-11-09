// const mongoClient=require('mongodb').MongoClient
const {MongoClient,ObjectID}=require('mongodb')
var obj=New ObjectID();

mongoClient.connect('mongodb://localhost:27017/TodoApp',(error,client)=>{

  if (error) {
    return console.log("Unable to connect to MongonDB Server")
  }
  console.log("Connected to MongoDB server")

  const db=client.db("TodoApp")
  // db.collection('Todos').insertOne({
  //   test:"Somthing to do",
  //   completed:false
  // },(error,result)=>{
  //   if (error) {
  //     return console.log("Unable to insert todo",error);
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // })

  db.collection('Todos').deleteMany({text:'Walk the dog'},(error,result)=>{
    if(error){
      return console.log("unable to create collection users",error);
    }
    console.log(JSON.stringify(result,undefined,2));
  })

  client.close()
})
