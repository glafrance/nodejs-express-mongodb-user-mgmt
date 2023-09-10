const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");

mongoose.Promise = global.Promise;

const constants = require("./constants/constants");
const usersRouter = require("./routes/users");

const app = express();

const corsSettings = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsSettings));
app.use(express.json());

// This makes it possible to server static user profile image files,
// from a directory named public at the root of this server.
app.use(express.static('public'));

// These options are a key and certificate to enable https.
// https://web.dev/how-to-use-local-https
//
// You use mkcert to create a https certificate for development work.
// See the above link for warnings regarding mkcert certificates.
//
// TODO: implement environment system allowing for 
// development (localhost), production, staging, etc. environments
// for these .pem files.
const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem")
};

const PORT = 4002;

mongoose.connect(`mongodb://localhost:27017/${config.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);


app.use(`/${constants.USER}`, usersRouter);

https.createServer(options, app).listen(PORT, () => {
  console.log(`User management server listening on port ${PORT}`);
});;
