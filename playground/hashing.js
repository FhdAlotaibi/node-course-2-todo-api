const bcrypt=require('bcryptjs')

var passowrd="123abc"
var hashedValue="$2a$10$/TobgHNQ.IyiZxzxYOh2ouTvkcHAg066RWxYCkIqdEYk1n41BWiJa"
//
// bcrypt.genSalt(10,(err,salt)=>{
//   bcrypt.hash(passowrd,salt,(err,hash)=>{
//     console.log(hash);
//   })
// })
bcrypt.compare(passowrd,hashedValue,(err,result)=>{
  console.log(result);
})
