const fs = require('fs')
const path = require("path")
var city;
// fs.readFile("../db.city.txt")
fs.readFile(path.join(__dirname,'../db/city.txt'),'utf8',function(err,data){
  if(err){
  console.log(err)
  }else{
    return data
  }
  })


module.exports ={
  city
} 

  
  