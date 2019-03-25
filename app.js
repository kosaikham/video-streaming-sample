const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/video", (req, res) => {
  const path = "assets/sample.mp4";
  const fileStat = fs.statSync(path);
  const fileSize = fileStat.size;
  const range = req.headers.range;
  console.log("res Header => ", res.header);
  console.log("res Headers => ", res.headers);
  console.log("req Header => ", req.header);
  console.log("req Headers => ", req.headers);

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 0) : fileSize - 1;

    const chunkSize = end - start + 1;
    const chunk = fs.createReadStream(path, { start, end });
    const header = {
      "Content-Range": `bytes ${start} - ${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(206, header);
    chunk.pipe(res);
  } else {
    const header = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead(200, header);
    fs.createReadStream(path).pipe(res);
  }
});

app.listen(3000, () => console.log(`App is listening on port 3000.`));
