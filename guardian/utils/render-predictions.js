import { throttle } from "lodash";

export const renderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Filter to find how many people are in frame
  const peopleDetected = predictions.filter(p => p.class === "person");
  
  // Optional: You can display this count on your dashboard
  // drawSystemStatus(peopleDetected.length); 

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];
    const isPerson = prediction.class === "person";
    const confidence = Math.round(prediction.score * 100);

    // Styling: High priority (Person) vs Low priority (Object)
    ctx.strokeStyle = isPerson ? "#333330" : "#A1A09A"; 
    ctx.lineWidth = isPerson ? 3 : 1;

    // Draw Rounded Box
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, 4);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.stroke();

    // Label with Confidence
    ctx.fillStyle = isPerson ? "#333330" : "#A1A09A";
    const label = `${prediction.class.toUpperCase()} ${confidence}%`;
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(x, y - 20 < 0 ? y : y - 20, textWidth + 10, 20);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(label, x + 5, (y - 20 < 0 ? y : y - 20) + 4);

    // Alert Logic: Trigger only if at least one confident person is found
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