import { throttle } from "lodash";

export const renderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // 1. Unified Styling Constants
  const font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];
    const isPerson = prediction.class === "person";
    const confidence = Math.round(prediction.score * 100);

    // 2. High-End Color Palette
    // Person detected: Deep Ink (#333330) | Other: Soft Grey (#A1A09A)
    const primaryColor = isPerson ? "#333330" : "#A1A09A";
    const fillColor = isPerson ? "rgba(51, 51, 48, 0.05)" : "transparent";

    // 3. Draw Bounding Box (Cleaner, thinner lines)
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // 4. Draw Inner Fill
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);

    // 5. Draw Label Tag
    ctx.fillStyle = primaryColor;
    const labelText = `${prediction.class.toUpperCase()} ${confidence}%`;
    const textWidth = ctx.measureText(labelText).width;
    
    // Draw background for text (A bit of padding for elegance)
    ctx.fillRect(x, y, textWidth + 10, 18);

    // 6. Draw Text
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(labelText, x + 5, y + 3);

    // 7. Trigger Alert Logic
    if (isPerson && confidence > 75) {
      playAlert();
    }
  });
};

// 8. Optimized Audio Handling (Pre-loaded)
let audioCache = null;

const playAlert = throttle(() => {
  if (!audioCache) {
    audioCache = new Audio("/pols-aagyi-pols.mp3");
  }
  
  // .play() returns a promise, it's good practice to catch errors 
  // (like if the user hasn't interacted with the page yet)
  audioCache.play().catch((e) => console.log("Audio waiting for user interaction..."));
}, 3000); // 3-second throttle is better for the length of that specific clip