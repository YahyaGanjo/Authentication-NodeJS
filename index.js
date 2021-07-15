const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});
app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const loginUser = users.find((user) => user.name === req.body.name);
  if (loginUser == null) {
    return res.status(500).send("cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, loginUser.password)) {
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(5000);
