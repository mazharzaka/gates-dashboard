import { initialMockGates } from "../data/mockGates.js";
import { mockLogs } from "../../access-log/data/mockLogs.js";
import { can } from "../../auth/permissions.js";
import { calculateOccupants } from "../utils/calculateOccupants.js";

// In-memory gate repository simulating backend database
let gatesState = JSON.parse(JSON.stringify(initialMockGates));

export const gatesService = {
  /**
   * Fetches gates based on user permissions and assignment
   * @param {object} [user]
   * @returns {Promise<Array>}
   */
  async getGates(user) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = JSON.parse(JSON.stringify(gatesState));
        if (!user) {
          resolve(list);
          return;
        }

        if (can(user.role, "viewAllGates")) {
          resolve(list);
          return;
        }

        // For guard, filter only gates where assignedTo includes user.name
        const filtered = list.filter((gate) =>
          gate.assignedTo?.includes(user.name)
        );
        resolve(filtered);
      }, 500);
    });
  },

  /**
   * Toggles gate status between 'open' and 'closed'
   * @param {string} gateId
   * @param {object} user
   * @returns {Promise<object>} updated gate
   */
  async toggleGate(gateId, user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = gatesState.findIndex((g) => g.id === gateId);
        if (index === -1) {
          reject(new Error(`Gate with ID ${gateId} not found`));
          return;
        }

        const current = gatesState[index];

        // Check toggle permission
        if (!user || !can(user.role, "toggleGate")) {
          reject(new Error("forbidden"));
          return;
        }

        // If not viewAllGates (i.e. guard), must be assigned to this gate
        if (!can(user.role, "viewAllGates")) {
          if (!current.assignedTo?.includes(user.name)) {
            reject(new Error("forbidden"));
            return;
          }
        }

        const nextStatus = current.status === "open" ? "closed" : "open";
        gatesState[index] = {
          ...current,
          status: nextStatus,
        };

        resolve(JSON.parse(JSON.stringify(gatesState[index])));
      }, 550);
    });
  },

  /**
   * Fetches people currently inside a specific gate
   * @param {string} gateId
   * @param {object} [user]
   * @returns {Promise<Array>}
   */
  async getGateOccupants(gateId, user) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const gate = gatesState.find((g) => g.id === gateId);
        if (!gate) {
          reject(new Error(`Gate with ID ${gateId} not found`));
          return;
        }

        // Role check: guards only get occupants for gates assigned to them. Admins get all.
        if (user && !can(user.role, "viewAllGates")) {
          if (!gate.assignedTo?.includes(user.name)) {
            resolve([]);
            return;
          }
        }

        const occupants = calculateOccupants(mockLogs, gateId);
        resolve(occupants);
      }, 500);
    });
  },

  /**
   * Simulates minor live traffic shifts
   */
  async simulateLiveUpdate(user) {
    gatesState = gatesState.map((gate) => {
      if (gate.status === "open") {
        // slight fluctuation
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const nextInside = Math.max(0, gate.inside + change);
        const nextEntries = change > 0 ? gate.entriesToday + 1 : gate.entriesToday;
        return {
          ...gate,
          inside: nextInside,
          entriesToday: nextEntries,
        };
      }
      return gate;
    });

    if (!user || can(user.role, "viewAllGates")) {
      return JSON.parse(JSON.stringify(gatesState));
    }

    return JSON.parse(
      JSON.stringify(gatesState.filter((g) => g.assignedTo?.includes(user.name)))
    );
  },
};
