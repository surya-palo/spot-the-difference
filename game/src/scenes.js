// Mira's Cottage — Spot the Difference: the three scenes.
// Every scene is drawn twice from the same painter: once as the original (left panel)
// and once with its differences applied (right panel). All art is original, drawn here
// with canvas primitives — no images, no copied art. Panel space is 600 x 520.
export const PANEL_WIDTH = 600;
export const PANEL_HEIGHT = 520;

/** Filled circle. */
function circle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** Filled ellipse. */
function ellipse(ctx, x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Filled rounded rectangle. */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fill();
}

/** A four-point sparkle star. */
function sparkle(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x, y, x + size, y);
  ctx.quadraticCurveTo(x, y, x, y + size);
  ctx.quadraticCurveTo(x, y, x - size, y);
  ctx.quadraticCurveTo(x, y, x, y - size);
  ctx.fill();
}

/** A straight line with round caps. */
function strokeLine(ctx, x1, y1, x2, y2, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/** A filled triangle. */
function triangle(ctx, x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

/** Clock hands for a given hour and minute (12-hour face, centre x, y, radius). */
function clockHands(ctx, x, y, radius, hour, minute) {
  const hourAngle = ((hour % 12) + minute / 60) * (Math.PI * 2 / 12) - Math.PI / 2;
  const minuteAngle = minute * (Math.PI * 2 / 60) - Math.PI / 2;
  strokeLine(ctx, x, y, x + Math.cos(hourAngle) * radius * 0.5, y + Math.sin(hourAngle) * radius * 0.5, 5, '#3a2a16');
  strokeLine(ctx, x, y, x + Math.cos(minuteAngle) * radius * 0.78, y + Math.sin(minuteAngle) * radius * 0.78, 3, '#3a2a16');
  ctx.fillStyle = '#3a2a16';
  circle(ctx, x, y, 4);
}

// ---------------------------------------------------------------------------
// Level 1 — The Cozy Cottage (8 differences, 3:00)
// ---------------------------------------------------------------------------
function paintCottage(ctx, variant) {
  // Wall and floor.
  ctx.fillStyle = '#f6dfae';
  ctx.fillRect(0, 0, PANEL_WIDTH, 360);
  ctx.fillStyle = '#a9713f';
  ctx.fillRect(0, 360, PANEL_WIDTH, 160);
  ctx.strokeStyle = 'rgba(90, 50, 20, 0.35)';
  ctx.lineWidth = 2;
  for (let x = 0; x < PANEL_WIDTH; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 360);
    ctx.lineTo(x - 30, 520);
    ctx.stroke();
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(0, 350, PANEL_WIDTH, 10);

  // Window with night sky, moon and stars.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(40, 40, 150, 170);
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(48, 48, 134, 154);
  ctx.fillStyle = '#f5e9a8';
  circle(ctx, 152, 82, 18);
  ctx.fillStyle = '#d9c27a';
  circle(ctx, 146, 78, 4);
  circle(ctx, 158, 88, 3);
  sparkle(ctx, 75, 72, 6, '#ffe9a8');
  sparkle(ctx, 105, 62, 5, '#ffe9a8');
  if (!variant) sparkle(ctx, 140, 92, 6, '#ffe9a8'); // difference: a third star
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(30, 34, 24, 182);
  ctx.fillRect(176, 34, 24, 182);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(38, 34, 6, 182);
  ctx.fillRect(184, 34, 6, 182);
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(34, 210, 162, 10);

  // Wall clock: 3:00 on the left, 4:30 on the right.
  ctx.fillStyle = '#8a5a12';
  circle(ctx, 310, 90, 42);
  ctx.fillStyle = '#fff8e6';
  circle(ctx, 310, 90, 36);
  ctx.fillStyle = '#3a2a16';
  for (let i = 0; i < 12; i += 1) {
    const a = i * (Math.PI * 2 / 12);
    circle(ctx, 310 + Math.cos(a) * 30, 90 + Math.sin(a) * 30, i % 3 === 0 ? 2.5 : 1.5);
  }
  if (variant) clockHands(ctx, 310, 90, 36, 4, 30);
  else clockHands(ctx, 310, 90, 36, 3, 0);

  // Framed picture: mountains on the left, a big sun on the right.
  ctx.fillStyle = '#8a5a12';
  ctx.fillRect(428, 48, 124, 84);
  if (!variant) {
    ctx.fillStyle = '#a8d8ea';
    ctx.fillRect(436, 56, 108, 68);
    ctx.fillStyle = '#5a7a4a';
    triangle(ctx, 436, 124, 480, 78, 520, 124);
    ctx.fillStyle = '#7a9a5a';
    triangle(ctx, 470, 124, 510, 88, 544, 124);
    ctx.fillStyle = '#fff8e6';
    circle(ctx, 520, 70, 9);
  } else {
    ctx.fillStyle = '#ffe9a8';
    ctx.fillRect(436, 56, 108, 68);
    ctx.fillStyle = '#f5a623';
    circle(ctx, 490, 88, 22);
    ctx.fillStyle = '#e8862e';
    circle(ctx, 490, 88, 13);
    ctx.fillStyle = '#7a9a5a';
    ellipse(ctx, 490, 124, 54, 12);
  }

  // Bookshelf with three shelves of books.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(420, 168, 160, 192);
  ctx.fillStyle = '#5a3418';
  ctx.fillRect(426, 174, 148, 180);
  const shelfRows = [
    { y: 186, books: ['#c0392b', '#2a7a9d', '#e8b64c', '#4a7a4a', '#8a5a9d'] },
    { y: 240, books: ['#2a7a9d', '#e8862e', '#c0392b', '#4a7a4a'] },
    { y: 294, books: ['#e8b64c', '#8a5a9d', '#c0392b', '#2a7a9d', '#4a7a4a'] },
  ];
  shelfRows.forEach((row, rowIndex) => {
    let x = 432;
    row.books.forEach((color, bookIndex) => {
      // difference: the red book on the middle shelf is missing on the right
      if (variant && rowIndex === 1 && bookIndex === 2) { x += 16; return; }
      ctx.fillStyle = color;
      ctx.fillRect(x, row.y, 14, 42);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x + 3, row.y + 4, 2, 34);
      x += 16;
    });
    ctx.fillStyle = '#7a4a21';
    ctx.fillRect(426, row.y + 44, 148, 6);
  });

  // Fireplace with a fire that burns high on the left, low on the right.
  ctx.fillStyle = '#9c6b4f';
  ctx.fillRect(40, 292, 170, 138);
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(32, 282, 186, 14);
  ctx.fillStyle = '#2b1a10';
  ctx.fillRect(66, 318, 118, 92);
  ctx.fillStyle = '#4a2c17';
  ctx.fillRect(66, 318, 118, 10);
  if (!variant) {
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(125, 330);
    ctx.quadraticCurveTo(150, 355, 142, 385);
    ctx.quadraticCurveTo(135, 405, 125, 408);
    ctx.quadraticCurveTo(115, 405, 108, 385);
    ctx.quadraticCurveTo(100, 355, 125, 330);
    ctx.fill();
    ctx.fillStyle = '#e2574c';
    ctx.beginPath();
    ctx.moveTo(125, 352);
    ctx.quadraticCurveTo(140, 372, 136, 392);
    ctx.quadraticCurveTo(132, 406, 125, 408);
    ctx.quadraticCurveTo(118, 406, 114, 392);
    ctx.quadraticCurveTo(110, 372, 125, 352);
    ctx.fill();
  } else {
    ctx.fillStyle = '#f5a623';
    ctx.beginPath();
    ctx.moveTo(125, 382);
    ctx.quadraticCurveTo(138, 394, 134, 406);
    ctx.quadraticCurveTo(130, 410, 125, 410);
    ctx.quadraticCurveTo(120, 410, 116, 406);
    ctx.quadraticCurveTo(112, 394, 125, 382);
    ctx.fill();
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(60, 410, 130, 8);

  // Standing lamp between the fireplace and the chair.
  ctx.fillStyle = '#3a2a16';
  ctx.fillRect(238, 250, 5, 180);
  ctx.fillStyle = '#f5d76e';
  ctx.beginPath();
  ctx.moveTo(222, 250);
  ctx.lineTo(260, 250);
  ctx.lineTo(252, 222);
  ctx.lineTo(230, 222);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(245, 215, 110, 0.25)';
  circle(ctx, 241, 236, 34);

  // Green armchair.
  ctx.fillStyle = '#4a7a4a';
  roundRect(ctx, 272, 330, 112, 86, 14);
  ctx.fillStyle = '#5d915d';
  roundRect(ctx, 262, 396, 132, 52, 12);
  ctx.fillStyle = '#3d6b3d';
  roundRect(ctx, 282, 344, 92, 56, 10);
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(272, 448, 10, 22);
  ctx.fillRect(384, 448, 10, 22);

  // Rug and the sleeping cat.
  ctx.fillStyle = '#c0392b';
  ellipse(ctx, 300, 486, 218, 30);
  ctx.fillStyle = '#e8b64c';
  ellipse(ctx, 300, 486, 178, 22);
  ctx.fillStyle = '#c0392b';
  ellipse(ctx, 300, 486, 128, 14);
  ctx.fillStyle = '#e8862e';
  ellipse(ctx, 178, 466, 44, 17);
  circle(ctx, 214, 458, 16);
  triangle(ctx, 204, 446, 210, 434, 216, 446);
  triangle(ctx, 220, 446, 226, 434, 232, 446);
  ctx.fillStyle = '#3a2a16';
  circle(ctx, 220, 456, 1.8);
  ctx.fillStyle = '#c96a1e';
  if (!variant) {
    // difference: the cat's tail lies flat along the rug
    ctx.beginPath();
    ctx.ellipse(140, 474, 26, 7, -0.25, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // difference: the cat's tail curls up in the air
    ctx.beginPath();
    ctx.ellipse(146, 446, 7, 24, 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  // Coffee table with the teapot: red on the left, teal on the right.
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(428, 400, 154, 12);
  ctx.fillRect(438, 412, 10, 46);
  ctx.fillRect(562, 412, 10, 46);
  ctx.fillStyle = variant ? '#2a9d8f' : '#c0392b';
  circle(ctx, 505, 382, 21);
  ctx.beginPath();
  ctx.moveTo(488, 372);
  ctx.lineTo(470, 362);
  ctx.lineTo(474, 376);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = variant ? '#2a9d8f' : '#c0392b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(526, 380, 10, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = variant ? '#2a9d8f' : '#c0392b';
  circle(ctx, 505, 360, 7);
  ctx.fillStyle = '#fff8e6';
  circle(ctx, 498, 376, 4);

  // Potted plant in the corner: a pink flower blooms on the right.
  ctx.fillStyle = '#b5651d';
  ctx.beginPath();
  ctx.moveTo(540, 430);
  ctx.lineTo(572, 430);
  ctx.lineTo(566, 462);
  ctx.lineTo(546, 462);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4a7a4a';
  ellipse(ctx, 548, 408, 10, 26);
  ellipse(ctx, 566, 404, 10, 28);
  ellipse(ctx, 556, 396, 9, 30);
  if (variant) {
    ctx.fillStyle = '#e87aa8';
    circle(ctx, 556, 372, 9);
    ctx.fillStyle = '#ffd94d';
    circle(ctx, 556, 372, 4);
  }
}

export const SCENE_COTTAGE = {
  id: 'cottage',
  name: 'The Cozy Cottage',
  timeLimit: 180,
  blurb: 'Mira’s cat is asleep by the fire and the kettle is on — but the two pictures are not quite the same.',
  differences: [
    { id: 'clock', name: 'the clock hands', x: 310, y: 90, r: 34 },
    { id: 'stars', name: 'a star in the window', x: 140, y: 92, r: 16 },
    { id: 'picture', name: 'the framed picture', x: 490, y: 90, r: 40 },
    { id: 'book', name: 'a red book on the shelf', x: 459, y: 261, r: 18 },
    { id: 'flame', name: 'the fireplace flame', x: 125, y: 370, r: 30 },
    { id: 'cat-tail', name: 'the cat’s tail', x: 145, y: 452, r: 24 },
    { id: 'teapot', name: 'the teapot’s colour', x: 505, y: 380, r: 26 },
    { id: 'flower', name: 'a flower on the plant', x: 556, y: 372, r: 20 },
  ],
  paint: paintCottage,
};

// ---------------------------------------------------------------------------
// Level 2 — The Moonlit Garden (9 differences, 2:30)
// ---------------------------------------------------------------------------
function paintGarden(ctx, variant) {
  // Night sky and ground.
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#16224e');
  sky.addColorStop(1, '#3a5a8c');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_WIDTH, 300);
  ctx.fillStyle = '#3f7a3a';
  ctx.fillRect(0, 300, PANEL_WIDTH, 220);
  ctx.fillStyle = '#356b31';
  ellipse(ctx, 120, 380, 90, 22);
  ellipse(ctx, 480, 330, 80, 18);
  const starSpots = [[40, 40], [90, 90], [180, 50], [240, 80], [300, 40], [360, 100], [540, 40], [560, 140], [30, 160], [200, 130]];
  starSpots.forEach(([x, y]) => sparkle(ctx, x, y, 4, '#ffe9a8'));

  // The moon: full on the left, a crescent on the right.
  ctx.fillStyle = '#f5e9a8';
  circle(ctx, 480, 80, 42);
  ctx.fillStyle = '#d9c27a';
  circle(ctx, 466, 70, 6);
  circle(ctx, 492, 92, 5);
  circle(ctx, 470, 96, 3);
  if (variant) {
    ctx.fillStyle = '#2a3f6e';
    circle(ctx, 500, 66, 38);
  }

  // Old oak tree with apples.
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(74, 200, 28, 140);
  strokeLine(ctx, 88, 230, 60, 190, 10, '#6b4226');
  strokeLine(ctx, 88, 220, 122, 185, 10, '#6b4226');
  ctx.fillStyle = '#2e6b34';
  circle(ctx, 60, 150, 46);
  circle(ctx, 112, 118, 56);
  circle(ctx, 152, 160, 46);
  circle(ctx, 88, 182, 42);
  ctx.fillStyle = '#c0392b';
  circle(ctx, 95, 140, 7);
  circle(ctx, 70, 180, 7);
  if (!variant) circle(ctx, 135, 155, 7); // difference: a third apple

  // Birdhouse on the trunk: a little blue bird perches on the right.
  ctx.fillStyle = '#b5651d';
  ctx.fillRect(118, 186, 34, 30);
  triangle(ctx, 112, 188, 135, 168, 158, 188);
  ctx.fillStyle = '#2b1a10';
  circle(ctx, 135, 201, 6);
  if (variant) {
    ctx.fillStyle = '#4a90c2';
    circle(ctx, 152, 180, 8);
    ctx.fillStyle = '#f5a623';
    triangle(ctx, 159, 180, 166, 182, 159, 184);
    ctx.fillStyle = '#2b1a10';
    circle(ctx, 154, 177, 1.5);
  }

  // White picket fence.
  ctx.fillStyle = '#f5ead6';
  for (let x = 8; x < PANEL_WIDTH; x += 28) {
    ctx.fillRect(x, 306, 14, 40);
    triangle(ctx, x, 308, x + 7, 296, x + 14, 308);
  }
  ctx.fillRect(0, 318, PANEL_WIDTH, 6);
  ctx.fillRect(0, 336, PANEL_WIDTH, 6);

  // Stepping stones up the lawn: four on the left, three on the right.
  ctx.fillStyle = '#cbb89a';
  ellipse(ctx, 300, 495, 26, 10);
  if (!variant) ellipse(ctx, 308, 450, 26, 10); // difference: a missing stone
  ellipse(ctx, 296, 405, 26, 10);
  ellipse(ctx, 304, 360, 26, 10);

  // Pond with lily pads — and a frog that only sits on the right.
  ctx.fillStyle = '#4a90c2';
  ellipse(ctx, 430, 432, 122, 42);
  ctx.fillStyle = '#6fb0d8';
  ellipse(ctx, 430, 428, 100, 32);
  ctx.fillStyle = '#2e6b34';
  circle(ctx, 398, 424, 14);
  circle(ctx, 462, 442, 12);
  if (variant) {
    ctx.fillStyle = '#4a9a3a';
    circle(ctx, 430, 418, 12);
    circle(ctx, 424, 406, 5);
    circle(ctx, 436, 406, 5);
    ctx.fillStyle = '#2b1a10';
    circle(ctx, 424, 405, 1.8);
    circle(ctx, 436, 405, 1.8);
  }

  // Lantern on its post: lit on the left, dark on the right.
  ctx.fillStyle = '#3a2a16';
  ctx.fillRect(347, 252, 6, 96);
  ctx.fillStyle = '#2b2118';
  ctx.fillRect(338, 228, 24, 28);
  if (!variant) {
    ctx.fillStyle = 'rgba(255, 217, 77, 0.3)';
    circle(ctx, 350, 242, 30);
    ctx.fillStyle = '#ffd94d';
  } else {
    ctx.fillStyle = '#5a5a5a';
  }
  ctx.fillRect(343, 233, 14, 18);

  // Mushrooms by the fence: three spots on the left, five on the right.
  ctx.fillStyle = '#f5ead6';
  ctx.fillRect(522, 330, 8, 18);
  ctx.fillRect(542, 334, 7, 14);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(526, 332, 16, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(545, 336, 12, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#fff8e6';
  circle(ctx, 518, 324, 3);
  circle(ctx, 528, 320, 3);
  circle(ctx, 538, 326, 3);
  if (variant) {
    circle(ctx, 540, 330, 2.5);
    circle(ctx, 550, 332, 2.5);
  }

  // Tulips along the bottom: five on the left, four on the right.
  const tulipXs = [60, 110, 160, 210, 260];
  tulipXs.forEach((x, index) => {
    if (variant && index === 3) return; // difference: a missing tulip
    ctx.strokeStyle = '#2e6b34';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, 505);
    ctx.lineTo(x, 472);
    ctx.stroke();
    ctx.fillStyle = index % 2 === 0 ? '#e2574c' : '#ffd94d';
    circle(ctx, x, 464, 10);
    triangle(ctx, x - 10, 466, x, 448, x + 10, 466);
  });

  // Butterfly over the lawn: orange on the left, blue on the right.
  ctx.fillStyle = variant ? '#4a90c2' : '#f5871f';
  ellipse(ctx, 240, 150, 12, 16);
  ellipse(ctx, 262, 150, 12, 16);
  ctx.fillStyle = '#2b2118';
  circle(ctx, 251, 150, 4);
  strokeLine(ctx, 251, 146, 246, 136, 2, '#2b2118');
  strokeLine(ctx, 251, 146, 256, 136, 2, '#2b2118');

  // Watering can resting by the flowers.
  ctx.fillStyle = '#7a8a99';
  roundRect(ctx, 84, 470, 44, 30, 6);
  strokeLine(ctx, 84, 478, 62, 462, 6, '#7a8a99');
  ctx.strokeStyle = '#7a8a99';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(128, 484, 10, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
}

export const SCENE_GARDEN = {
  id: 'garden',
  name: 'The Moonlit Garden',
  timeLimit: 150,
  blurb: 'Fireflies, a frog and a sleepy oak — the garden hides nine small changes under the moon.',
  differences: [
    { id: 'moon', name: 'the shape of the moon', x: 480, y: 80, r: 40 },
    { id: 'apple', name: 'an apple on the oak', x: 135, y: 155, r: 14 },
    { id: 'bird', name: 'a bird on the birdhouse', x: 152, y: 180, r: 16 },
    { id: 'lantern', name: 'the lantern’s light', x: 350, y: 242, r: 22 },
    { id: 'spots', name: 'spots on the mushrooms', x: 534, y: 328, r: 22 },
    { id: 'stone', name: 'a stepping stone', x: 308, y: 450, r: 18 },
    { id: 'frog', name: 'the frog on the pond', x: 430, y: 414, r: 18 },
    { id: 'tulip', name: 'a tulip in the row', x: 210, y: 464, r: 18 },
    { id: 'butterfly', name: 'the butterfly’s colour', x: 251, y: 150, r: 20 },
  ],
  paint: paintGarden,
};

// ---------------------------------------------------------------------------
// Level 3 — The Toy Workshop (10 differences, 2:00)
// ---------------------------------------------------------------------------
function paintWorkshop(ctx, variant) {
  // Wall and floor.
  ctx.fillStyle = '#f2d38a';
  ctx.fillRect(0, 0, PANEL_WIDTH, 360);
  ctx.fillStyle = '#a9713f';
  ctx.fillRect(0, 360, PANEL_WIDTH, 160);
  ctx.strokeStyle = 'rgba(90, 50, 20, 0.3)';
  ctx.lineWidth = 2;
  for (let x = 0; x < PANEL_WIDTH; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 360);
    ctx.lineTo(x - 30, 520);
    ctx.stroke();
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(0, 350, PANEL_WIDTH, 10);

  // Pegboard with tools on the left wall.
  ctx.fillStyle = '#c9a06a';
  ctx.fillRect(36, 60, 130, 220);
  ctx.fillStyle = 'rgba(90, 50, 20, 0.4)';
  for (let y = 76; y < 270; y += 18) {
    for (let x = 52; x < 156; x += 18) circle(ctx, x, y, 1.5);
  }
  // Saw.
  ctx.fillStyle = '#8a8a8a';
  ctx.beginPath();
  ctx.moveTo(52, 120);
  ctx.lineTo(120, 100);
  ctx.lineTo(120, 118);
  ctx.lineTo(52, 136);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(118, 96, 18, 26);
  // Wrench.
  ctx.strokeStyle = '#8a8a8a';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(70, 180);
  ctx.lineTo(110, 220);
  ctx.stroke();
  ctx.fillStyle = '#8a8a8a';
  circle(ctx, 68, 176, 10);
  circle(ctx, 112, 224, 8);
  // Hammer: present on the left, gone on the right.
  if (!variant) {
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(96, 236, 8, 34);
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(78, 228, 44, 12);
  }

  // Window with daytime sky: a bird flies past on the right.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(236, 48, 150, 120);
  ctx.fillStyle = '#a8d8ea';
  ctx.fillRect(244, 56, 134, 104);
  ctx.fillStyle = '#fff8e6';
  circle(ctx, 352, 76, 14);
  ctx.fillStyle = '#a8d8ea';
  ellipse(ctx, 280, 92, 26, 8);
  ellipse(ctx, 330, 118, 30, 9);
  if (variant) {
    ctx.strokeStyle = '#2b2118';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(300, 84, 8, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(312, 84, 8, Math.PI, 0);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(230, 168, 162, 10);

  // Kite hanging on the wall: red on the left, green on the right.
  ctx.fillStyle = variant ? '#4a9a3a' : '#c0392b';
  ctx.beginPath();
  ctx.moveTo(190, 200);
  ctx.lineTo(214, 232);
  ctx.lineTo(190, 268);
  ctx.lineTo(166, 232);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8a5a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(190, 200);
  ctx.lineTo(190, 268);
  ctx.moveTo(166, 232);
  ctx.lineTo(214, 232);
  ctx.stroke();
  strokeLine(ctx, 190, 268, 196, 300, 2, '#8a5a12');
  ctx.fillStyle = '#ffd94d';
  triangle(ctx, 190, 282, 196, 290, 184, 290);

  // Wall clock: 10:10 on the left, 2:20 on the right.
  ctx.fillStyle = '#8a5a12';
  circle(ctx, 452, 92, 34);
  ctx.fillStyle = '#fff8e6';
  circle(ctx, 452, 92, 29);
  ctx.fillStyle = '#3a2a16';
  for (let i = 0; i < 12; i += 1) {
    const a = i * (Math.PI * 2 / 12);
    circle(ctx, 452 + Math.cos(a) * 24, 92 + Math.sin(a) * 24, i % 3 === 0 ? 2 : 1.2);
  }
  if (variant) clockHands(ctx, 452, 92, 29, 2, 20);
  else clockHands(ctx, 452, 92, 29, 10, 10);

  // Shelves with jars on the right wall: three on the left, two on the right.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(420, 168, 160, 190);
  ctx.fillStyle = '#5a3418';
  ctx.fillRect(426, 174, 148, 180);
  const jarColors = ['#e8b64c', '#4a90c2', '#e87aa8'];
  jarColors.forEach((color, index) => {
    if (variant && index === 2) return; // difference: a missing jar
    const x = 436 + index * 48;
    ctx.fillStyle = color;
    roundRect(ctx, x, 196, 34, 44, 8);
    ctx.fillStyle = '#6b4226';
    ctx.fillRect(x + 6, 188, 22, 8);
  });
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(426, 244, 148, 6);
  // Second shelf: spools of thread.
  ctx.fillStyle = '#c0392b';
  circle(ctx, 452, 292, 14);
  ctx.fillStyle = '#2a7a9d';
  circle(ctx, 496, 292, 14);
  ctx.fillStyle = '#e8b64c';
  circle(ctx, 540, 292, 14);
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(426, 310, 148, 6);

  // Workbench.
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(180, 372, 300, 14);
  ctx.fillRect(192, 386, 12, 74);
  ctx.fillRect(456, 386, 12, 74);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(180, 372, 300, 4);

  // Teddy bear on the bench: a red bow on the left, blue on the right.
  ctx.fillStyle = '#a9713f';
  circle(ctx, 300, 330, 22);
  circle(ctx, 284, 312, 9);
  circle(ctx, 316, 312, 9);
  ellipse(ctx, 300, 356, 26, 18);
  ctx.fillStyle = '#c98a4f';
  circle(ctx, 300, 332, 10);
  ctx.fillStyle = '#2b1a10';
  circle(ctx, 292, 326, 2.5);
  circle(ctx, 308, 326, 2.5);
  ctx.fillStyle = variant ? '#2a7a9d' : '#c0392b';
  triangle(ctx, 300, 348, 288, 342, 288, 354);
  triangle(ctx, 300, 348, 312, 342, 312, 354);

  // Robot toy on the bench: its antenna is missing on the right.
  ctx.fillStyle = '#8a8a8a';
  roundRect(ctx, 408, 330, 44, 42, 8);
  ctx.fillStyle = '#4a90c2';
  roundRect(ctx, 416, 306, 28, 24, 6);
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 424, 315, 3.5);
  circle(ctx, 436, 315, 3.5);
  if (!variant) {
    strokeLine(ctx, 430, 306, 430, 288, 3, '#8a8a8a');
    ctx.fillStyle = '#e2574c';
    circle(ctx, 430, 284, 5);
  }
  ctx.strokeStyle = '#8a8a8a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(408, 344);
  ctx.lineTo(394, 358);
  ctx.moveTo(452, 344);
  ctx.lineTo(466, 358);
  ctx.stroke();

  // Bench lamp: yellow shade on the left, purple on the right.
  ctx.fillStyle = '#3a2a16';
  ctx.fillRect(516, 330, 5, 42);
  ctx.fillStyle = variant ? '#8a5a9d' : '#f5d76e';
  ctx.beginPath();
  ctx.moveTo(504, 330);
  ctx.lineTo(534, 330);
  ctx.lineTo(528, 306);
  ctx.lineTo(510, 306);
  ctx.closePath();
  ctx.fill();

  // Rug and the toy train on the floor.
  ctx.fillStyle = '#2a7a9d';
  ellipse(ctx, 300, 492, 210, 26);
  ctx.fillStyle = '#e8b64c';
  ellipse(ctx, 300, 492, 170, 19);
  // Engine.
  ctx.fillStyle = '#c0392b';
  roundRect(ctx, 196, 462, 54, 30, 6);
  ctx.fillStyle = '#2b2118';
  circle(ctx, 210, 496, 8);
  circle(ctx, 236, 496, 8);
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 246, 472, 5);
  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(236, 448, 10, 16);
  // Cars: three on the left, two on the right.
  const carColors = ['#2a7a9d', '#4a9a3a', '#e8b64c'];
  carColors.forEach((color, index) => {
    if (variant && index === 2) return; // difference: a missing train car
    const x = 258 + index * 52;
    ctx.fillStyle = color;
    roundRect(ctx, x, 468, 44, 24, 5);
    ctx.fillStyle = '#2b2118';
    circle(ctx, x + 10, 496, 7);
    circle(ctx, x + 34, 496, 7);
  });

  // Alphabet blocks on the floor: the third block says C on the left, D on the right.
  const blockLetters = ['A', 'B', variant ? 'D' : 'C'];
  blockLetters.forEach((letter, index) => {
    const x = 66 + index * 44;
    ctx.fillStyle = ['#c0392b', '#2a7a9d', '#e8b64c'][index];
    roundRect(ctx, x, 452, 36, 36, 6);
    ctx.fillStyle = '#fff8e6';
    ctx.font = 'bold 24px "Trebuchet MS", Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x + 18, 471);
  });
}

export const SCENE_WORKSHOP = {
  id: 'workshop',
  name: 'The Toy Workshop',
  timeLimit: 120,
  blurb: 'Trains, teddies and a very busy bench — ten tiny changes hide among the toys.',
  differences: [
    { id: 'hammer', name: 'the hammer on the pegboard', x: 100, y: 250, r: 22 },
    { id: 'bird-window', name: 'a bird outside the window', x: 306, y: 84, r: 16 },
    { id: 'kite', name: 'the kite’s colour', x: 190, y: 234, r: 26 },
    { id: 'clock', name: 'the clock hands', x: 452, y: 92, r: 28 },
    { id: 'jar', name: 'a jar on the shelf', x: 548, y: 218, r: 22 },
    { id: 'bow', name: 'the teddy’s bow tie', x: 300, y: 348, r: 18 },
    { id: 'antenna', name: 'the robot’s antenna', x: 430, y: 292, r: 14 },
    { id: 'lamp', name: 'the bench lamp’s shade', x: 519, y: 318, r: 18 },
    { id: 'train-car', name: 'a car of the toy train', x: 386, y: 480, r: 20 },
    { id: 'block', name: 'the letter on a block', x: 172, y: 470, r: 18 },
  ],
  paint: paintWorkshop,
};

/** The three levels in order: each harder than the last. */
export const SCENES = [SCENE_COTTAGE, SCENE_GARDEN, SCENE_WORKSHOP];
