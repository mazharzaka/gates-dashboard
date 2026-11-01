import { formatDateTime } from "../../../shared/utils/formatTime.js";

/**
 * Escapes a cell value for standard CSV format
 */
function escapeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  const stringValue = String(value);
  // If the cell contains quotes, commas, or newlines, enclose in quotes and escape quotes
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

/**
 * Exports logs to CSV with UTF-8 BOM for proper Arabic rendering in Microsoft Excel
 *
 * @param {Array} logs
 * @param {string} language
 * @param {object} translations
 */
export function exportLogsToCsv(logs, language = "ar", translations = {}) {
  if (!logs || logs.length === 0) return;

  const headers = [
    translations.colPerson || "Person Name",
    translations.colGate || "Gate",
    translations.colType || "Type",
    translations.colTime || "Date & Time",
    translations.colRecordedBy || "Recorded By",
    "Log ID",
  ];

  const rows = logs.map((log) => {
    const typeLabel =
      log.type === "in"
        ? translations.filterTypeIn || "In"
        : translations.filterTypeOut || "Out";

    const formattedTime = formatDateTime(log.timestamp, language);

    return [
      escapeCsvCell(log.person),
      escapeCsvCell(log.gateId),
      escapeCsvCell(typeLabel),
      escapeCsvCell(formattedTime),
      escapeCsvCell(log.recordedBy),
      escapeCsvCell(log.id),
    ].join(",");
  });

  const headerLine = headers.map(escapeCsvCell).join(",");
  const csvContent = "\uFEFF" + [headerLine, ...rows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];

  link.setAttribute("href", url);
  link.setAttribute("download", `gate_access_log_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

