const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER

router.post("/register", async (req, res) => {
  console.log("register success 3");
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    console.log("register success 4");
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
    console.log("register success 5");
  } catch (err) {
    console.log("register success 6");
    res.status(500).json(err);
  }
});

//LOGIN


router.post("/login", async (req, res) => {
  try {
    console.log("object1");
    const user = await User.findOne({ username: req.body.username });
    if (user == null){
      res.status(401).json("Wrong credentials");
      return
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    
    if (OriginalPassword !== req.body.password) {
      res.status(401).json("Wrong credentialss !");
      return
    }
    // OriginalPassword !== req.body.password &&
    
    console.log("2object");
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );
    console.log(accessToken);

    const { password, ...others } = user._doc;

    res.status(200).json({...others, accessToken});
    return
  } catch (err) {
    res.status(500).json(err);
    return
  }
  
});

module.exports = router;


//{"user":"{\"currentUser\":{\"_id\":\"63f8ef93c7c4b29519d8f913\",\"username\":\"raj89\",\"email\":\"raj@gmail.com\",\"isAdmin\":false,\"createdAt\":\"2023-02-24T17:10:43.736Z\",\"updatedAt\":\"2023-02-24T17:10:43.736Z\",\"__v\":0,\"accessToken\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjhlZjkzYzdjNGIyOTUxOWQ4ZjkxMyIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NzcyNTkyMTIsImV4cCI6MTY3NzUxODQxMn0.C1QInkqAHXToycfOjz7t7rLaObLkztKhHZI5VNHgqgQ\"},\"isFetching\":false,\"error\":false}",
// "cart":"{\"products\":[{\"_id\":\"63e12f049361aa86f55f81ea\",\"title\":\"param shirt\",\"desc\":\"shirt for sale\",\"img\":\"https://firebasestorage.googleapis.com/v0/b/shop-dc654.appspot.com/o/1675877688633shirt1.jpg?alt=media&token=84cd8579-e766-45a0-b994-b7fda45f99ba\",\"categories\":[\"shirts\"],\"size\":\"\",\"color\":\"\",\"price\":1000,\"inStock\":true,\"createdAt\":\"2023-02-06T16:47:00.304Z\",\"updatedAt\":\"2023-02-08T17:34:51.758Z\",\"__v\":0,\"quantity\":1}],\"quantity\":1,\"total\":1000}",
// "_persist":"{\"version\":1,\"rehydrated\":true}"}
