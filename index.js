///////////////////////////////////////////////////////////////////
///// FILES

// const fs = require("fs");

// //Blocking version of reading and writing into a file i.e. async

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textIn);
// const date = new Date();
// const textOut = `This is what we know about avocados: ${textIn}. \n Created on ${date}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File is written...");

// //Non blocking version of wriitng and reading from a file.

// fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
//     console.log(data2);

//     fs.writeFile("./txt/final.txt", `${data1}\n${data2}`, "utf-8", (err) => {
//       console.log("Your file has been written in.");
//     });
//   });
// });
////////////////////////////////////////////////////////////////
////////////////// SERVER

const http = require("http");
const url = require("url");
const fs = require("fs");

//module exports

const replaceTemplate = require('./modules/replaceTemplate')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
//   const pathname = req.url;

    const {query, pathname} = url.parse(req.url,true);


  //   OVERVIEW
  if (pathname === "/overview" || pathname === "/") {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(""); //to make array into string

    res.writeHead(200, {
        'Content-type':'text/html'
    })
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    res.end(output);

    // PRODUCT
  } else if (pathname === "/product") {
    const product = dataObj[query.id]; //query is an object containing query parameters

    const output = replaceTemplate(tempProduct, product)
    res.writeHead(200, {
        'Content-type': 'text/html',
    });
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });

    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello-world",
    });
    res.end("<h1>Page Not found! </h1>");
  }

  console.log("A request was made..");

  //   res.end("Your request was received");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000...");
});
