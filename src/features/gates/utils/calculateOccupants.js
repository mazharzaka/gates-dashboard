/**
 * Calculates the people currently inside a gate based on the access log events.
 * For each person, find their latest event. If the latest event is "in", they are inside.
 *
 * @param {Array<object>} logs Access log records
 * @param {string} gateId Gate identifier
 * @returns {Array<{ id: string, person: string, entryTime: string, recordedBy: string }>}
 */
export function calculateOccupants(logs, gateId) {
  if (!logs || !gateId) return [];

  // Filter logs for this specific gate
  const gateLogs = logs.filter((log) => log.gateId === gateId);

  // Group latest event by person
  const latestByPerson = new Map();

  for (const log of gateLogs) {
    const personKey = (log.person || "").trim();
    if (!personKey) continue;

    const existing = latestByPerson.get(personKey);
    const logTime = new Date(log.timestamp).getTime();

    if (!existing || logTime > existing.time) {
      latestByPerson.set(personKey, {
        time: logTime,
        log,
      });
    }
  }

  // Filter those whose latest event is "in"
  const occupants = [];
  for (const { log } of latestByPerson.values()) {
    if (log.type === "in") {
      occupants.push({
        id: log.id,
        person: log.person,
        entryTime: log.timestamp,
        recordedBy: log.recordedBy,
      });
    }
  }

  // Sort descending by entryTime (most recent first)
  occupants.sort(
    (a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
  );

  return occupants;
}

