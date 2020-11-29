/* eslint-disable no-undef, no-unused-vars */

// coded by mattqg 11.7.2020
// Investigating the motivation of push notifications, who they really
// serve and how they relate to connectedness in a broader sense

function preload() {
  facebook = loadImage("assets/facebook.png");
  instagram = loadImage("assets/instagram.png");
  linkedin = loadImage("assets/linkedin.png");
  reddit = loadImage("assets/reddit.png");
  snapchat = loadImage("assets/snapchat.png");
  tiktok = loadImage("assets/tiktok.png");
  twitter = loadImage("assets/twitter.png");
  youtube = loadImage("assets/youtube.png");
  sf_pro = loadFont("/assets/SF-Pro-Text-Regular.otf");
  csv_data = loadTable("/assets/txts.csv", "csv", "header");
}

var nfcs = [];
var timer = 0;
var txts = [[], [], [], [], [], [], [], []];
var skip_index = [];
var taken_from_txts = [[], [], [], [], [], [], [], []];

// initalize setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let r = 0; r < csv_data.getRowCount(); r++) {
    txts_value = csv_data.getString(r, 2);
    txts_index = int(csv_data.getString(r, 1));
    txts[txts_index].push(txts_value);
  }
  taken_from_txts = JSON.parse(JSON.stringify(txts));
}

function draw() {

  background(255);

  if (millis() < 10 * 1000) {
    offset = 1.7 * 1000;
  } else if (millis() > 10 * 1000) {
    offset = 1.3 * 1000;
  } else if (millis() > 20 * 1000) {
    offset = 1 * 1000;
  } else if (millis() > 30 * 1000) {
    offset = 0.3 * 1000;
  }


  if (millis() >= timer + offset) {
    drawNFC();
    timer = millis();
  }

  for (var i = 0; i < nfcs.length; i++) {
    if (nfcs[i].y >= height + nfcs[i].size * 189 && nfcs.length > 1) {
      nfcs.splice(i, 1);
    }

    imageMode(CORNER);
    image(
      nfcs[i].img,
      nfcs[i].x,
      nfcs[i].y,
      nfcs[i].size * 612,
      nfcs[i].size * 189
    );
    textAlign(LEFT, TOP);
    textSize(22);
    text(
      nfcs[i].txt,
      nfcs[i].x + 0.05 * nfcs[i].size * 612,
      nfcs[i].y + 0.4 * nfcs[i].size * 189,
      0.9 * nfcs[i].size * 612,
      0.5 * nfcs[i].size * 189
    );
    nfcs[i].y += nfcs[i].v;
  }
}

windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};


function drawNFC() {
  var size = 0.8;
  var icons = [
    facebook,
    instagram,
    linkedin,
    reddit,
    snapchat,
    tiktok,
    twitter,
    youtube
  ];

  rand_index = floor(random(0, 8));
  while (skip_index.includes(rand_index)) {
    rand_index = floor(random(0, 8));
  }

  skip_index.unshift(rand_index);
  if (skip_index.length > 6) {
    skip_index = skip_index.slice(0, 4);
  }

  rand_txt_index = floor(random(0, taken_from_txts[rand_index].length));
  random_txt = taken_from_txts[rand_index][rand_txt_index];
  taken_from_txts[rand_index].splice(rand_txt_index, 1);

  for (var i = 0; i <= 7; i++) {
    if (taken_from_txts[i].length === 0) {
      for (var j = 0; j <= 7; j++) {
        taken_from_txts[i].push(txts[i][j]);
      }
    }
  }

  random_icon = icons[rand_index];

  nfcs.push({
    size: size,
    x: random(0, width - 612 * size),
    y: random(94.5 * size, 94.5 * size),
    v: random(size * 2.8, size * 3.2),
    img: random_icon,
    txt: random_txt
  });
}
