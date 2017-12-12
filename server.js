const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'studioamk-space-testdrive',
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log(file);
        cb(null, file.originalname);
      }
    })
}).array('upload', 1);

app.post('/upload', function (request, response, next) {
    upload(request, response, function (error) {
      if (error) {
        console.log(error);
        return response.redirect("/error");
      }
      console.log('File uploaded successfully.');
      response.redirect("/success");
    });
});

app.use(express.static('public'));
// Main, error and success views
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get("/success", function (request, response) {
  response.sendFile(__dirname + '/public/success.html');
});

app.get("/error", function (request, response) {
  response.sendFile(__dirname + '/public/error.html');
});

app.listen(3001, function () {
    console.log('Server listening on port 3001.');
});



