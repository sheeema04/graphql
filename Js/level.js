// level.js
export function renderLevel(transactions) {
  // Get the current level from the transaction
  const currentLevel = transactions[0]?.amount || 0;
  const totalLevels = 128; // Total possible levels
  
  // Calculate progress percentage
  const progress = currentLevel / totalLevels;
  
  // Create SVG container
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "level-svg");
  svg.setAttribute("viewBox", "0 0 200 220");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Level ${currentLevel} of ${totalLevels}`);
  
  // Style variables
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  // Background circle (full 128 levels)
  const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bgCircle.setAttribute("class", "level-bg-circle");
  bgCircle.setAttribute("cx", centerX);
  bgCircle.setAttribute("cy", centerY);
  bgCircle.setAttribute("r", radius);
  svg.appendChild(bgCircle);

  // Progress circle (current level)
  const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  progressCircle.setAttribute("class", "level-progress-circle");
  progressCircle.setAttribute("cx", centerX);
  progressCircle.setAttribute("cy", centerY);
  progressCircle.setAttribute("r", radius);
  progressCircle.setAttribute("stroke-dasharray", circumference);
  progressCircle.setAttribute("stroke-dashoffset", offset);
  progressCircle.setAttribute("transform", `rotate(-90 ${centerX} ${centerY})`);
  svg.appendChild(progressCircle);

  // Current level text (big)
  const levelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  levelText.setAttribute("class", "level-main-text");
  levelText.setAttribute("x", centerX);
  levelText.setAttribute("y", centerY);
  levelText.textContent = currentLevel;
  svg.appendChild(levelText);

  // "of 128" text (small)
  const totalText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  totalText.setAttribute("class", "level-sub-text");
  totalText.setAttribute("x", centerX);
  totalText.setAttribute("y", centerY + 20);
  totalText.textContent = `of ${totalLevels}`;
  svg.appendChild(totalText);

  // Percentage text at bottom
  const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  percentText.setAttribute("class", "level-percent-text");
  percentText.setAttribute("x", centerX);
  percentText.setAttribute("y", "220");
  percentText.textContent = `${Math.round(progress * 100)}% complete`;
  svg.appendChild(percentText);

  // Create container
  const container = document.createElement("div");
  container.className = "level-container";

  const title = document.createElement("h3");
  title.className = "level-title";
  title.textContent = "Level Progress";

  container.appendChild(title);
  container.appendChild(svg);

  // Update DOM
  const levelGraph = document.getElementById("level-graph");
  levelGraph.innerHTML = "";
  levelGraph.appendChild(container);
}