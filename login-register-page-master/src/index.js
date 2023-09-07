require("dotenv").config();
const express = require("express");
var cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const path = require("path");
const bcrypt = require("bcrypt");
let ejs = require("ejs");
const auth = require("./middleware/auth");

const port = process.env.PORT || 3000;

require("./db/conn");
const Register = require("./models/modelschema");
const static_path = path.join(__dirname, "../public");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "ejs");

//special for deploy
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.get("/", function (req, res) {
  res.render("registration");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/secret", auth, function (req, res) {
  res.render("secret");
});
app.get("/logout", auth, async function (req, res) {
  try {
    res.clearCookie("jwt");
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;
    if (password === cpassword) {
      const regemployee = new Register({
        name: req.body.firstname,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmPassword,
      });

      const token = await regemployee.generateAuthToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });

      const registered = await regemployee.save();

      res.status(201).render("login");
    } else {
      console.log("password are not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({ email: email });
    const isMatch = bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });

    if (isMatch) {
      res.render("secret");
    } else {
      res.send("Incorrect Password");
    }
  } catch (error) {
    res.status(400).send("Invalid Email");
  }
});

app.listen(port, function (req, res) {
  console.log("The server is started on port 3000");
});
