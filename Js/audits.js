export async function renderAuditRatio() {
  try {
    let token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No JWT token found");
      return;
    }

    // Clean token
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    // Fetch audit data
    const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            transaction(
              where: { type: { _in: ["up", "down"] } }
              order_by: { createdAt: desc }
            ) {
              type
              amount
            }
          }
        `
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);

    const audits = result.data.transaction;
    if (!audits?.length) {
      document.getElementById('audit-graph').innerHTML = '<p>No audit data available</p>';
      return;
    }

    // Filter and sum amounts
    const doneBytes = audits
      .filter(t => t.type === 'up')
      .reduce((sum, t) => sum + t.amount, 0);

    const receivedBytes = audits
      .filter(t => t.type === 'down')
      .reduce((sum, t) => sum + t.amount, 0);

    // Convert to MB (1 MB = 1048576 bytes)
    const doneMB = doneBytes / 1000000;
    const receivedMB = receivedBytes / 1000000;
    const ratio = receivedMB > 0 ? (doneMB / receivedMB).toFixed(2) : "0.00";

    // Chart dimensions - now with horizontal bars
    const svgWidth = 400;
    const svgHeight = 150;
    const barHeight = 20;
    const maxBarWidth = 250;
    const barSpacing = 40;

    const maxValue = Math.max(doneMB, receivedMB);
    const doneWidth = maxValue > 0 ? (doneMB / maxValue) * maxBarWidth : 0;
    const receivedWidth = maxValue > 0 ? (receivedMB / maxValue) * maxBarWidth : 0;

    // Render SVG and info
    document.getElementById('audit-graph').innerHTML = `
      <div class="audit-container">
        <div class="audit-stats" style="margin-bottom: 20px;">
          <div class="audit-stat" style="margin-bottom: 10px;">
            <span class="audit-label">Done:</span>
            <span class="audit-value">${doneMB.toFixed(2)} MB</span>
          </div>
          <div class="audit-stat">
            <span class="audit-label">Received:</span>
            <span class="audit-value">${receivedMB.toFixed(2)} MB</span>
          </div>
        </div>
        
        <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
          <!-- Done (up) bar -->
          <rect x="0" y="15" 
                width="${doneWidth}" height="${barHeight}" fill="#4CAF50" rx="3" ry="3"/>
          <text x="${doneWidth + 5}" y="${barHeight / 2 + 14}" 
                font-size="24" fill="white" dominant-baseline="middle">
            ${doneMB.toFixed(2)} MB
          </text>

          <!-- Received (down) bar -->
          <rect x="0" y="${barHeight + barSpacing}" 
                width="${receivedWidth}" height="${barHeight}" fill="#F44336" rx="3" ry="3"/>
          <text x="${receivedWidth + 5}" y="${barHeight + barSpacing + barHeight / 2 + 5}" 
                font-size="24" fill="white" dominant-baseline="middle">
            ${receivedMB.toFixed(2)} MB
          </text>

          <!-- Ratio display -->
          <text x="50%" y="100%" text-anchor="middle" font-size="34" font-weight="bold" 
            fill="white"> Audit Ratio: ${ratio}
          </text>
        </svg>
      </div>
    `;

  } catch (error) {
    console.error("Error rendering audit ratio:", error);
    document.getElementById('audit-graph').innerHTML = `
      <div class="error-message">
        Error loading audit data: ${error.message}
      </div>
    `;
  }
}