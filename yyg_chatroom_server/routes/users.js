var express = require('express');
var router = express.Router();
const multiparty = require('multiparty');
const uuid = require("uuid");
const fs = require("fs");
const UserDB = require("../db/UserDB")

// 注册新用户
router.post("/addNewUser", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if(err) {
      res.send({ ok: "0", message: "出错啦" })
    } else {
      const userId = uuid.v4();
      const imgName = files.userImg[0].originalFilename;
      const imgData = fs.readFileSync(files.userImg[0].path);
      fs.writeFile(`./public/images/${imgName}`, imgData, (err) => {
        if(err) {
          res.send({ ok: "0", message: "出错啦" });
        } else {
          const newUser = new UserDB({
            userId,
            userName: fields.userName[0],
            password: fields.password[0],
            userImg: imgName
          });
          newUser.save();
          res.send({ ok: "1", message: "操作成功" });
        }
      });
    }
  });
})

// 登录
router.post("/login", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, function(err, fields) {
    if(err) {
      console.log(err);
      res.send({ ok: "0", message: "出错啦" })
    } else {
      UserDB.find({ userName: fields.userName[0], password: fields.password[0] }, (err, data) => {
        if(err) {
          res.send({ ok: "0", message: "出错啦" });
        } else {
          if(data.length) {
            res.send({ ok: "1", message: data[0].userId });
          } else {
            res.send({ ok: "0", message: "用户名或密码错误" });
          }
        }
      })
    }
  });
})

// 根据ID返回用户信息
router.get("/getUserInfoById", (req, res) => {
  UserDB.find({ userId: req.query.userId }, (err, data) => {
    if(err) {
      res.send({ ok: "0", message: "出错啦" });
    } else {
      let imgData = fs.readFileSync(`./public/images/${data[0].userImg}`);
      imgData = imgData.toString("base64");
      const dataUrl = 'data:image/png;base64,' + imgData;
      res.send({ ok: "1", message: dataUrl });
    }
  })
})

module.exports = router;