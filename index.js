const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const mongoDBConnect = require("./config/mongoDBConnect");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const authRouter =  require("./routes/auth");
const userRouter =  require("./routes/user");
const postRouter =  require("./routes/posts");

/**
* Express is a server framework for Node.
* Framework used from:
* https://www.npmjs.com/package/express
*/
const app = express();

//Middewares
app.use(express.json());

/**
* Helmet secures apps by setting response headers.
* Framework used from:
* https://www.npmjs.com/package/helmet
*/
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

/**
* Logger middleware.
* Framework used from:
* https://www.npmjs.com/package/morgan
*/
app.use(morgan("common"));

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/**
* Enable CORS.
* Framework used from:
* https://www.npmjs.com/package/cors
*/
app.use(cors());

//Router
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/posts", postRouter);

const SERVER_PORT = process.env.PORT_NUMBER || 4000;

//Database connect.
mongoDBConnect();

//Listening for incoming requests.
app.listen(SERVER_PORT, () => {
    console.log(`The server is running on the port number: ${SERVER_PORT}`);
  });