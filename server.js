const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// import express from "express";    to use this , add  ` "type":"module" ` above the scripts..
const connect = require("./database/conn");
const router = require("./routes/route");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// morgan is used to log all the http request ...
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hacker know about our stack

const port = 8080;

app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

// api routes
app.use("/api", router);

// start server when we are connected to database..
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`running at port ${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log(`Invalid database connection ${error}`);
  });
