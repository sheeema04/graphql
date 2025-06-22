export function renderXPBoard(transactions) {  
  // Filter transactions to count only projects and specific paths
  const projectTransactions = transactions.filter(tx => {
    const path = tx.path || '';
    const type = tx.object?.type || '';
    return type === 'project' ||
           type === 'piscine' ||
           path.includes('/project/') ||
           path.includes('/bahrain/bh-module/checkpoint');
  });

  // Group transactions by project for display
  const projects = {};
  projectTransactions.forEach(tx => {
    let projectName = tx.object?.name || tx.path.split('/').filter(Boolean).pop();

    projectName = projectName
      .replace('project—', '')
      .replace('piscine—', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(' In Progress', ' (in progress)')
      .replace('Js', 'JS')
      .replace('Go', 'Go');

    if (!projects[projectName]) {
      projects[projectName] = {
        size: 0, // This will be in bytes (we'll convert to kB later)
        date: tx.createdAt,
        type: tx.object?.type || (tx.path.includes('/bahrain/') ? 'checkpoint' : 'project'),
        originalNames: [],
        paths: []
      };
    }
    projects[projectName].size += tx.amount;
    projects[projectName].originalNames.push(tx.object?.name || tx.path);
    projects[projectName].paths.push(tx.path);
    if (new Date(tx.createdAt) > new Date(projects[projectName].date)) {
      projects[projectName].date = tx.createdAt;
    }
  });

  // Convert to array and sort by date (newest first)
  let projectList = Object.entries(projects).map(([name, data]) => ({
    name,
    size: data.size, 
    date: data.date,
    type: data.type,
    originalNames: data.originalNames,
    paths: data.paths
  }));

  projectList.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate total XP by summing all project sizes (converted to kB)
  const totalXP = projectList.reduce((sum, project) => {
    // Convert each project's size from bytes to kB
    return sum + (project.size / 1000);
  }, 0);

  // Format size to kB with two decimal places for display
  const formatSize = (amount) => {
    // amount is in bytes, convert to kB for display
    return (amount / 1000).toFixed(2) + " kB";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const xpGraph = document.getElementById("xp-graph");

  xpGraph.innerHTML = `
    <div class="xp-header">
      <h1>XP Summary</h1>
      <div class="xp-summary">
        <div class="box"><h4>Total XP</h4><p>${totalXP.toFixed(2)} kB</p></div>
        <div class="box"><h4>Projects</h4><p>${projectList.length}</p></div>
      </div>
    </div>

    <div class="xp-projects">
      <h3>All Activities</h3>
      <div class="project-list">
        ${projectList.slice(0, 3).map(project => `
          <div class="project-item">
            <span class="project-name">${project.name}</span>
            <span class="project-type">${project.type}</span>
            <span class="project-size">${formatSize(project.size)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}