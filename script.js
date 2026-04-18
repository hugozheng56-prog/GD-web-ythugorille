let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

let B = 30;
let endDis = 120;
let endWidth = 30;

let cube = {
  size: B,
  x: canvas.width / 4,
  y: canvas.height / 4 * 3,
  color: "rgb(245, 223, 24)",
  velocityY: 0,
  initialJumpVelocity: -9,
};

let speed = 4.5;
let gravity = -0.62;
let floorHeight = canvas.height / 4 * 3 + B;

let objPos = (x = 0, y = 0) => {return {x: cube.x + B * x, y: floorHeight - B - B * y}};
let endArr = (arr) => {return arr.length - 1};

let spikespos = [
  objPos(17),
  objPos(18),
  objPos(19),
]; let spikes = spikespos;

let blockspos = [
  objPos(10),
  objPos(14, 1),
  objPos(18, 2),
  objPos(22, 3),
  objPos(26, 4),
  objPos(30, 5),
  objPos(33),
  objPos(34),
  objPos(35),
  objPos(36)
]; let blocks = blockspos;

let collision = false;
let mouseHold = false;
let jumped = false;

let sto = false;

c.lineWidth = 2;

update();
window.addEventListener("mousedown", () => {mouseHold = true});
window.addEventListener("mouseup", () => {mouseHold = false});

function update() {
  window.requestAnimationFrame(update);
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (!sto) {c.clearRect(0, 0, canvas.width, canvas.height);}

  spikes.forEach(spike => {
    let spikeColGrad = c.createLinearGradient(spike.x, spike.y, spike.x + B, spike.y + B);
    spikeColGrad.addColorStop(0, "black");
    spikeColGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    c.beginPath();
    c.moveTo(spike.x, spike.y + B);
    c.lineTo(spike.x + B / 2, spike.y);
    c.lineTo(spike.x + B, spike.y + B);
    c.closePath();
    c.fillStyle = spikeColGrad;
    c.fill();
    c.strokeStyle = "white";
    c.stroke();
  });
  
  blocks.forEach(block => {
    c.save();
    let blockColGrad = c.createLinearGradient(block.x, block.y, block.x + B, block.y + B);
    blockColGrad.addColorStop(0, "black");
    blockColGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    c.rect(block.x, block.y, B, B);
    c.fillStyle = blockColGrad;
    c.fill();
    c.strokeStyle = "white";
    c.stroke();
    c.restore();
  });

  c.save();
  c.translate(cube.x + B / 2, cube.y + B / 2);
  c.rotate(cube.velocityY * 0.16);
  c.fillStyle = cube.color;
  c.fillRect(-B / 2, -B / 2, B, B);
  c.restore();

  c.fillStyle = "darkblue";
  c.fillRect(0, floorHeight, canvas.width, canvas.height);

  if (!sto) {
    cube.y += cube.velocityY;
    cube.velocityY -= gravity;
    spikes.forEach(spike => {spike.x -= speed});
    blocks.forEach(block => {block.x -= speed});
  } console.log(sto)

  if (cube.y + B >= floorHeight) {
    cube.y = floorHeight - B;
    cube.velocityY = 0;
    collision = true;
  }
  if (spikes.some(spike => cube.x < spike.x + B / 1.5 && cube.x + B > spike.x + B / 3 && cube.y < spike.y + B / 1.5 && cube.y + B > spike.y + B / 3)  ) {
    sto = true;
    setTimeout(gameOver, 500);
  }
  if (blocks.some(block => cube.x < block.x + B / 1.5 && cube.x + B > block.x + B / 3 && cube.y < block.y + B / 1.5 && cube.y + B > block.y + B / 2)) {
    sto = true;
    setTimeout(gameOver, 500);
  } else if (blocks.some(block => cube.x < block.x + B / 1.5 && cube.x + B > block.x + B / 3 && cube.y < block.y + B / 1.5 && cube.y + B > block.y)) {
    cube.y = blocks.find(block => cube.x < block.x + B / 1.5 && cube.x + B > block.x + B / 3 && cube.y < block.y + B / 1.5 && cube.y + B > block.y).y - B;
    cube.velocityY = 0;
    collision = true;
    
  }
  if (blocks[endArr(blocks)].x > spikes[endArr(spikes)].x) {
    c.fillStyle = "rgb(255, 252, 170)";
    c.fillRect(blocks[endArr(blocks)].x + endDis, 999, endWidth, 999);
    if (cube.x > blocks[endArr(blocks)].x + endDis) {
      sto = true;
      setTimeout(gameOver, 1000);
    }
  } else {
    if (cube.x > spikes[endArr(spikes)].x + endDis) {
      sto = true;
      setTimeout(gameOver, 1000);
    }
  }
  if (mouseHold) {
    if ((cube.velocityY === 0 || cube.velocityY === -gravity || cube.velocityY === gravity) && collision) {
      cube.velocityY = cube.initialJumpVelocity;
      collision = false;
      jumped = true;
    }
  }
  if (cube.y < canvas.height / 3) {
    spikes.forEach(spike => {spike.y += speed});
    blocks.forEach(block => {block.y += speed});
    cube.y += speed;
    floorHeight +=speed;
  }
  if (cube.y > canvas.height / 4 * 3 && jumped) {
    spikes.forEach(spike => {spike.y -= speed});
    blocks.forEach(block => {block.y -= speed});
    cube.y -= speed;
    floorHeight -= speed;
  }
  console.log();
}
function jump() {
  if (cube.velocityY === 0 || cube.velocityY === -gravity || cube.velocityY === gravity) {
    cube.velocityY = cube.initialJumpVelocity;
  }
}
function gameOver() {
  cube = {
    size: 30,
    x: canvas.width / 4,
    y: canvas.height,
    color: "rgb(245, 223, 24)",
    velocityY: 0,
    initialJumpVelocity: -9,
  };
  floorHeight = canvas.height / 4 * 3 + B;
  spikes = spikespos.map(pos => ({x: pos.x + cube.x + 300, y: pos.y}));
  blocks = blockspos.map(pos => ({x: pos.x + cube.x + 300, y: pos.y}));

  mouseHold = false;
  jumped = false;
  sto = false;
}