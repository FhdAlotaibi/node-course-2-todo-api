// const mongoClient=require('mongodb').MongoClient
const {MongoClient,ObjectID}=require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,client)=>{

  if (error) {
    return console.log("Unable to connect to MongonDB Server")
  }
  console.log("Connected to MongoDB server")

  const db=client.db("TodoApp")

  // db.collection('Todos').find({
  //   _id:new ObjectID("5bdaca4f1aa95d1189531fe5")
  // }).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(error)=>{
  //   console.log("Unable to fetch todos",error);
  // })

    db.collection('Todos').findOneAndUpdate(
      {_id:new ObjectID("5bdaca4f1aa95d1189531fe5")},
      {
        $set:{
        completed:false
        }
      }
    )
    .then((result)=>{
      console.log(JSON.stringify(result,undefined,2));
    },(error)=>{
      if(error)
      console.log("unable to update todos",error);
    })

  // client.close()
})
