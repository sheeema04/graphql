export async function renderSkills() {
  try {
    const token = localStorage.getItem("jwt")?.replace(/^"|"$/g, '');
    if (!token) throw new Error("No JWT token found");

    const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
          go: transaction_aggregate(where: {type: {_eq: "skill_go"}}) {
            aggregate { max { amount } }
          }
          backend: transaction_aggregate(where: {type: {_eq: "skill_back-end"}}) {
            aggregate { max { amount } }
          }
          frontend: transaction_aggregate(where: {type: {_eq: "skill_front-end"}}) {
            aggregate { max { amount } }
          }
          html: transaction_aggregate(where: {type: {_eq: "skill_html"}}) {
            aggregate { max { amount } }
          }
          js: transaction_aggregate(where: {type: {_eq: "skill_js"}}) {
            aggregate { max { amount } }
          }
          programming: transaction_aggregate(where: {type: {_eq: "skill_prog"}}) {
            aggregate { max { amount } }
          }
        }`
      }),
    });

    const result = await response.json();
    const data = result.data;

    const skills = [
      data.go.aggregate.max.amount || 0,
      data.programming.aggregate.max.amount || 0,
      data.backend.aggregate.max.amount || 0,
      data.frontend.aggregate.max.amount || 0,
      data.js.aggregate.max.amount || 0,
      data.html.aggregate.max.amount || 0
    ];

    const labels = ["Go", "Prog", "Back-End", "Front-End", "Js", "Html"];
    const centerX = 150, centerY = 150, radius = 150;

    // Adjust each skill percentage to match the corresponding circle (10% per ring)
    const points = skills.map((value, i) => {
      const angle = (Math.PI * 2 / skills.length) * i - Math.PI / 2;
      const clampedValue = Math.max(0, Math.min(100, value));
      const r = (clampedValue / 100) * radius;
      return [
        centerX + r * Math.cos(angle),
        centerY + r * Math.sin(angle)
      ];
    });

    const labelPoints = labels.map((_, i) => {
      const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
      const labelRadius = radius + 20;
      return [
        centerX + labelRadius * Math.cos(angle),
        centerY + labelRadius * Math.sin(angle)
      ];
    });

    const polygon = points.map(p => p.join(",")).join(" ");

    const svg = `
      <svg width="500" height="350" viewBox="-20 -30 310 365">
        <!-- Background grid circles (10 rings = 10% each) -->
        ${Array.from({ length: 10 }, (_, i) => {
          const r = radius * (i + 1) / 10;
          return `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="#0ff" stroke-dasharray="4,2" />`;
        }).join('')}

        <!-- Radial lines -->
        ${points.map(([x, y]) => `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#444" stroke-dasharray="2,2" />`).join('')}

        <!-- Outer ring -->
        <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#555" stroke-width="1.5" />

        <!-- Skill polygon -->
        <polygon points="${polygon}" fill="rgba(0, 255, 255, 0.2)" stroke="#00ffff" stroke-width="2" />

        <!-- Skill labels with values -->
        ${labelPoints.map(([x, y], i) => {
          return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#00e6e6" font-size="13" font-weight="bold">${labels[i]} (${skills[i]}%)</text>`;
        }).join('')}
      </svg>
    `;

    document.getElementById("skills-graph").innerHTML = svg;

  } catch (error) {
    console.error("Error fetching skills:", error);
  }
}
