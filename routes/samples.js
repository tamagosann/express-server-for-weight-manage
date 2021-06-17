var express = require("express");
var router = express.Router();
const fs = require("fs");
const cors = require("cors");

router.use(
  cors({
    origin: "https://weight-manage-a1554.web.app", //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);

router.post("/create-user-info", (req, res) => {
  console.log(req.body.postData);
  const uid = req.body.postData.uid;
  const postedUserInfo = req.body.postData.userInfo;

  let parsedJsonObject = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );
  console.log(parsedJsonObject);
  const index = parsedJsonObject.users.findIndex((user) => {
    console.log(user.uid);
    console.log(uid);
    return user.uid === uid;
  });
  if (index >= 0) {
    console.log("0以上");
    parsedJsonObject.users[index].userInfo = postedUserInfo;
    console.log(parsedJsonObject);
    fs.writeFileSync(
      "./data/users.json",
      JSON.stringify(parsedJsonObject),
      "utf8"
    );
    console.log("終わり");
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(req.body.postData);
  } else {
    console.log("新規");
    const newUser = {
      uid: uid,
      userInfo: postedUserInfo,
      weights: [],
    };
    parsedJsonObject.users.push(newUser);
    console.log("更新直前");
    console.log(parsedJsonObject);
    fs.writeFileSync(
      "./data/users.json",
      JSON.stringify(parsedJsonObject),
      "utf8"
    );
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(req.body.postData);
  }
});

router.post("/add", function (req, res, next) {
  console.log(req.body.postData);
  console.log(req.body.uid);
  const uid = req.body.uid;
  const postData = req.body.postData;

  let parsedJsonObject = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );
  console.log(parsedJsonObject);
  const index = parsedJsonObject.users.findIndex((user) => {
    return user.uid === uid;
  });
  parsedJsonObject.users[index].weights.push(postData);
  console.log(parsedJsonObject);
  fs.writeFileSync(
    "./data/users.json",
    JSON.stringify(parsedJsonObject),
    "utf8"
  );
  res.header("Content-Type", "application/json; charset=utf-8");
  res.send({ message: "success" });
});

router.post("/delete-weight", function (req, res, next) {
  const uid = req.body.uid;
  const weightId = req.body.postData.weightId;
  let parsedJsonObject = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );
  const index = parsedJsonObject.users.findIndex((user) => {
    return user.uid === uid;
  });
  parsedJsonObject.users[index].weights = parsedJsonObject.users[
    index
  ].weights.filter((weight) => {
    return weight.weightId !== weightId;
  });
  fs.writeFileSync(
    "./data/users.json",
    JSON.stringify(parsedJsonObject),
    "utf8"
  );
  const weightsToReturn = parsedJsonObject.users[index].weights;
  console.log(weightsToReturn);
  res.header("Content-Type", "application/json; charset=utf-8");
  res.send(weightsToReturn);
});

router.post("/update-weight", function (req, res, next) {
  console.log(req.body.data);
  const uid = req.body.uid;
  const data = req.body.data;
  let parsedJsonObject = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );
  console.log(parsedJsonObject);
  const indexOfUser = parsedJsonObject.users.findIndex(user => {
    return user.uid === uid
  })
  const indexOfWeight = parsedJsonObject.users[indexOfUser].weights.findIndex(weight => {
    return weight.weightId === data.weightId
  })
  parsedJsonObject.users[indexOfUser].weights[indexOfWeight] = data;
  console.log(parsedJsonObject);
  fs.writeFileSync(
    "./data/users.json",
    JSON.stringify(parsedJsonObject),
    "utf8"
  );
  const weightsToReturn = parsedJsonObject.users[indexOfUser].weights
  console.log(weightsToReturn)
  res.header("Content-Type", "application/json; charset=utf-8");
  res.send(weightsToReturn);
});

router.post("/fetch-weights", function (req, res, next) {
  let parsedJsonObject = JSON.parse(
    fs.readFileSync("./data/weights.json", "utf8")
  );
  console.log(parsedJsonObject);
  res.header("Content-Type", "application/json; charset=utf-8");
  res.send(parsedJsonObject);
});

router.post("/fetch-user-info", function (req, res, next) {
  const uid = req.body.uid;
  let parsedJsonObject = JSON.parse(
    fs.readFileSync("./data/users.json", "utf8")
  );
  console.log(parsedJsonObject);
  const index = parsedJsonObject.users.findIndex((user) => {
    return user.uid === uid;
  });
  if(index >= 0 ) {
    const userInfoToReturn = parsedJsonObject.users[index];
    console.log(userInfoToReturn);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(userInfoToReturn);
  } else {
    const userInfoToReturn = {
      uid: uid,
      userInfo: {height: null, startWeight: 0, targetWeight: 0},
      weights: []
    }
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(userInfoToReturn);
  }
});

module.exports = router;

