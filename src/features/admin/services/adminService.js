import { initialMockGates } from "../../gates/data/mockGates.js";

const mockGuards = [
  {
    id: "guard-1",
    name: "guard",
    status: "active",
  },
  {
    id: "guard-2",
    name: "guard2",
    status: "active",
  },
  {
    id: "guard-3",
    name: "guard3",
    status: "inactive",
  },
];

export const adminService = {
  /**
   * Fetches list of guards with their assigned gates
   * @returns {Promise<Array>}
   */
  async getGuards() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const enriched = mockGuards.map((guard) => {
          const assigned = initialMockGates
            .filter((gate) => gate.assignedTo?.includes(guard.name))
            .map((gate) => gate.id);
          return {
            ...guard,
            assignedGates: assigned,
          };
        });
        resolve(enriched);
      }, 500);
    });
  },
};

