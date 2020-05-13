var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require("path")
// let model = require("../utils/model")

function error(msg) {
  return { status: "error", message: msg, code: 10001 }
}

function success(body,message="请求成功") {
  return { status: "success", message, code: 10000, body }
}

const cityDB= path.join(__dirname, '../db/city.json')
const myDB= path.join(__dirname, '../db/my.json')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/webapi/city', function (req, res, next) {
  fs.readFile(cityDB, 'utf8', function (err, data) {
    if (err) {
      console.log(err)
    } else {
      res.json(success(JSON.parse(data)))
    }
  })
});

router.post('/webapi/addCity', function (req, res, next) {
  const { des } = req.body
  if (typeof (des) == 'string') {
    fs.readFile(cityDB, 'utf8', function (err, data) {
      if (err) {
        console.log(err)
      } else {
        let obj = JSON.parse(data)
        obj.des = des
        fs.writeFileSync(cityDB,JSON.stringify(obj))
        res.json(success({},"操作成功"))
      }
    })
  } else {
    res.json(error("des数据类型错误"))
  }
  
});

router.get('/webapi/my', function (req, res, next) {
  fs.readFile(myDB, 'utf8', function (err, data) {
    if (err) {
      console.log(err)
    } else {
      res.json(success(JSON.parse(data)))
    }
  })
});

module.exports = router;
