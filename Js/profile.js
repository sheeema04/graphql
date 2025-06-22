import { renderLevel } from "./level.js";
import { renderAuditRatio } from "./audits.js";
import { renderSkills } from "./skills.js";
import { renderXPBoard } from "./xp.js";

window.addEventListener("DOMContentLoaded", async () => {
  let token = localStorage.getItem("jwt");
  const username = document.getElementById("username");
  const userID = document.getElementById("userId");
  const name = document.getElementById("fullName");
  const err = document.getElementById("error-message");

  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const query = {
      query: `
        {
          user {
            id
            login
            firstName
            lastName
          }

          levelTransaction: transaction(
            where: {
              type: { _eq: "level" }
            }
            order_by: { createdAt: desc }
            limit: 1
          ) {
            amount
            createdAt
          }
          
          xpTransactions: transaction(
            where: { type: { _eq: "xp" } },
            order_by: { createdAt: desc }
          ) {
            amount
            createdAt
            path
            object {
              name
              type
            }
          }
        }
      `
    };

    const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || "Failed to fetch user data");
    }

    const result = await response.json();
    console.log("GraphQL result:", result);

    if (result.errors) {
      console.error("GraphQL Error:", result.errors[0].message);
      throw new Error("GraphQL query failed");
    }

    const user = Array.isArray(result.data.user) ? result.data.user[0] : result.data.user;
    if (!user) throw new Error("User data not found");

    // username.textContent = user.login;
    // userID.textContent = user.id;
    name.textContent = `${user.firstName || ''} ${user.lastName || ''} !!!`.trim();

    // Get the latest level transaction
    const levelTransaction = result.data.levelTransaction[0];
    if (levelTransaction) {
      renderLevel([levelTransaction]);
    }

    const xpTransactions = result.data.xpTransactions;
    const level = result.data.levelTransaction[0]?.amount || 0;
    renderXPBoard(xpTransactions, level);

    setTimeout(() => {
      renderAuditRatio();
      renderSkills();
    }, 200);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwt');
        window.location.href = 'index.html';
      });
    }

  } catch (error) {
    err.textContent = "Unable to load profile data.";
    console.error(error);
  }
});