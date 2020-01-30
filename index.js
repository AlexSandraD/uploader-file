// import * as gcs from '@google-cloud/storage';

const express = require("express");
const path = require("path");
const multer = require("multer");
const upload = multer().array("imgCollection");
const cors = require("cors");
const logger = require("morgan");

const { Storage } = require("@google-cloud/storage");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = new Storage({
  projectId: "test-upload-file-266613",
  keyFilename: path.join(__dirname, "./config/keys.json")
});

app.post("/create", function(req, res, next) {
  try {
    async function uploadFile(file, folder) {
      let bucketName = "storage-folder";
      let bucket = storage.bucket(bucketName);

      let newFileName = file.originalname;

      let fileUpload = bucket.file(newFileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });

      blobStream.on("error", error => {
        console.log(
          "Something is wrong! Unable to upload at the moment." + error
        );
      });

      blobStream.on("finish", () => {
        const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`; //image url from firebase server
      });

      blobStream.end(file.buffer);
    }

    upload(req, res, function(err) {
      let files = req.files;
      for (let file in files) {
        uploadFile(files[file], req.body.folder);
      }
      if (err) {
        return res.end("Error uploading file." + err);
      }
      res.end("File is uploaded");
    });
  } catch (err) {
    res.send(err);
  }
});

//start your server on port 3001
app.listen(3001, () => {
  console.log("Server Listening on port 3001");
});
