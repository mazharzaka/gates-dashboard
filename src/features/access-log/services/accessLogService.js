import { mockLogs } from "../data/mockLogs.js";
import { initialMockGates } from "../../gates/data/mockGates.js";
import { can } from "../../auth/permissions.js";

export const accessLogService = {
  /**
   * Fetches filtered access logs
   * @param {object} filters
   * @param {object} [user]
   * @returns {Promise<Array>}
   */
  async getLogs(filters = {}, user) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...mockLogs];

        // If guard, only return logs for their assigned gates. Admin gets all logs.
        if (user && !can(user.role, "viewAllLogs")) {
          const assignedGateIds = initialMockGates
            .filter((g) => g.assignedTo?.includes(user.name))
            .map((g) => g.id);
          results = results.filter((item) =>
            assignedGateIds.includes(item.gateId)
          );
        }

        // Filter by person name
        if (filters.search && filters.search.trim()) {
          const q = filters.search.trim().toLowerCase();
          results = results.filter((item) =>
            item.person.toLowerCase().includes(q)
          );
        }

        // Filter by gate
        if (filters.gateId && filters.gateId !== "all") {
          results = results.filter((item) => item.gateId === filters.gateId);
        }

        // Filter by movement type
        if (filters.type && filters.type !== "all") {
          results = results.filter((item) => item.type === filters.type);
        }

        // Filter by Date From
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          results = results.filter((item) => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= fromDate;
          });
        }

        // Filter by Date To
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          results = results.filter((item) => {
            const itemDate = new Date(item.timestamp);
            return itemDate <= toDate;
          });
        }

        // Sort descending by timestamp
        results.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        resolve(results);
      }, 500);
    });
  },
};
