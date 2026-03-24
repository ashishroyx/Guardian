import { throttle } from "lodash";

export const renderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  
  const peopleDetected = predictions.filter(p => p.class === "person");
  


  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];
    const isPerson = prediction.class === "person";
    const confidence = Math.round(prediction.score * 100);

    
    ctx.strokeStyle = isPerson ? "#333330" : "#A1A09A"; 
    ctx.lineWidth = isPerson ? 3 : 1;

    
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, 4);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.stroke();

    
    ctx.fillStyle = isPerson ? "#333330" : "#A1A09A";
    const label = `${prediction.class.toUpperCase()} ${confidence}%`;
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(x, y - 20 < 0 ? y : y - 20, textWidth + 10, 20);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(label, x + 5, (y - 20 < 0 ? y : y - 20) + 4);

    
    if (isPerson && confidence > 75) {
      playAlert();
    }
  });
};

let audioCache = null;
const playAlert = throttle(() => {
  if (!audioCache) audioCache = new Audio("/pols-aagyi-pols.mp3");
  audioCache.currentTime = 0;
  audioCache.play().catch(() => {});
}, 4000);