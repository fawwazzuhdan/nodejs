const express = require("express");
const db = require("./config/mongoose");
const port = 8000;

const app = express();
//fEYu6G7VZXEeElgi

app.use(express.json());
app.use(require("./routes"));
app.listen(port, (err) => {
  if (err) {
    console.log("err in connecting to server");
    return;
  }

  console.log("server connected successfully");
});
