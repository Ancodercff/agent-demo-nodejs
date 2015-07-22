"use strict";
var oneapm = require('oneapm');

var express = require('express');
var app = express();

var noop = function (req, res) {
  res.end(req.url);
};

app.get("/", noop);
app.get("/users", noop);
app.get("/user/:id", noop);
app.get("/admin/", noop);
app.get("/admin/home", noop);

var ooo = express.Router();

ooo.get("/ooo", function (req, res) {
  res.end("ok");
})

app.use("/xxx", ooo);

app.listen(8080);
