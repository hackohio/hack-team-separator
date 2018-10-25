const express = require('express');
const PImage = require('pureimage');
const fs = require("fs");
const uuidv1 = require('uuid/v1');
const UnionBallroomMap = require('./UnionBallroomMap.json');
const UnionGreathallMap = require('./UnionGreathallMap.json');
const UnionSenateMap = require('./UnionSenateMap.json');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/ballroom', (req, res) => {
    PImage.decodePNGFromStream(fs.createReadStream("./img/UnionBallroomLayout.png")).then((img) => {
        let editedImg = PImage.make(img.width, img.height);
        let context = editedImg.getContext('2d');
        context.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, img.width, img.height,
        );
        let queries = req.query.locs;
        let colors = req.query.colors;
        for(let i=0; i<queries.length; i++){
            let query = queries[i];
            let circleContext = editedImg.getContext('2d');
            circleContext.fillStyle = colors[i];
            circleContext.beginPath();
            let x = parseInt(UnionBallroomMap[query].x);
            let y = parseInt(UnionBallroomMap[query].y);
            circleContext.arc(x, y, 15, 0, Math.PI*2, true);
            circleContext.closePath(); circleContext.fill();
        }
        var outpath = "./tmp/" + uuidv1() + ".png";
        var options = {
            root: __dirname
        }
        PImage.encodePNGToStream(editedImg, fs.createWriteStream(outpath)).then(() => {
            res.sendFile(outpath, options);
        });
    });
});

app.get('/api/greathall', (req, res) => {
    PImage.decodePNGFromStream(fs.createReadStream("./img/UnionGreathallLayout.png")).then((img) => {
        let editedImg = PImage.make(img.width, img.height);
        let context = editedImg.getContext('2d');
        context.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, img.width, img.height,
        );
        let queries = req.query.locs;
        let colors = req.query.colors;
        for(let i=0; i<queries.length; i++){
            let query = queries[i];
            let circleContext = editedImg.getContext('2d');
            circleContext.fillStyle = colors[i];
            circleContext.beginPath();
            let x = parseInt(UnionGreathallMap[query].x);
            let y = parseInt(UnionGreathallMap[query].y);
            circleContext.arc(x, y, 15, 0, Math.PI*2, true);
            circleContext.closePath();
            circleContext.fill();
        }
        var outpath = "./tmp/" + uuidv1() + ".png";
        var options = {
            root: __dirname
        }
        PImage.encodePNGToStream(editedImg, fs.createWriteStream(outpath)).then(() => {
            res.sendFile(outpath, options);
        });
    });
});

app.get('/api/senate', (req, res) => {
    PImage.decodePNGFromStream(fs.createReadStream("./img/UnionSenateLayout.png")).then((img) => {
        let editedImg = PImage.make(img.width, img.height);
        let context = editedImg.getContext('2d');
        context.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, img.width, img.height,
        );
        let queries = req.query.locs;
        let colors = req.query.colors;
        for(let i=0; i<queries.length; i++){
            let query = queries[i];
            let circleContext = editedImg.getContext('2d');
            circleContext.fillStyle = colors[i];
            circleContext.beginPath();
            let x = parseInt(UnionSenateMap[query].X);
            let y = parseInt(UnionSenateMap[query].Y);
            circleContext.arc(x, y, 15, 0, Math.PI*2, true);
            circleContext.closePath();
            circleContext.fill();
        }
        var outpath = "./tmp/" + uuidv1() + ".png";
        var options = {
            root: __dirname
        }
        PImage.encodePNGToStream(editedImg, fs.createWriteStream(outpath)).then(() => {
            res.sendFile(outpath, options);
        });
    });
});

app.listen(port, () => console.log('Listening on port: ' + port));
