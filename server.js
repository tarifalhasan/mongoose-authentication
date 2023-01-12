import bcrypt from "bcrypt";
import express from "express";
import mongoose from "mongoose";
import User from "./models/User.js";
const app = express();
const port = 4000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2>Server is runnnig......</h2>");
});
app.post("/signup", async (req, res, next) => {
  const { fullName, email, password, accountStatus } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "invalid data" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    user = new User({ fullName, email, password, accountStatus });

    // hash password bcrypt

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    await user.save();

    return res.status(201).json({ message: "user created" });
  } catch (error) {
    next(error);
  }
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.set("strictQuery", true);
  await mongoose
    .connect("mongodb://127.0.0.1:27017/test")
    .then(() => {
      console.log("mongodb connected successfully");
    })
    .catch((err) => console.log(err));
}

// login 
  
app.post('/login', async (req, res,next) => {
    const {email,password} = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "user not found" });	
        }
        //match password
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            return res.status(400).json({ message: "password does not match" });
        }
        delete user._doc.password;
        return  res.status(200).json(   {message: "user logged in successfully",user})
    } catch (error) {
        next(error);
    }
})

app.listen(port, async () => {
  console.log(`server is running at http://localhost:${port}`);
});
