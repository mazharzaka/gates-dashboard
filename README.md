# Gate Security Dashboard (نظام أمن البوابات)

A bilingual (Arabic/English) frontend dashboard for a gate security management system built with React, Vite, CSS variables, Context API, and Lucide React.

## Features
- **Bilingual & RTL-First**: Defaults to Arabic (RTL) with seamless toggle to English (LTR). Uses logical CSS properties throughout (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`).
- **Brand Theming**: Single token repository in `src/shared/theme/tokens.css` with Etisalat red palette, status colors, and fluid typography (`Tajawal` for Arabic, `Inter` for English).
- **Authentication**:
  - Mock login with 600ms artificial latency.
  - Role-based authorization (`guard` and `admin`).
  - Account lockout after 3 consecutive failed attempts with a 30-second live countdown timer.
  - Persistent sessions stored in `sessionStorage`.
  - Protected routes with intended path redirect return.
- **Gates Tab (`/dashboard/gates`)**:
  - Live occupancy summary (total inside, total entries today, open gates count).
  - Gate cards showing inside counts, daily entries, and live status badges.
  - Gate open/close toggle actions with guard/admin permission validation.
  - Live background auto-refresh every 10 seconds.
- **Access Log Tab (`/dashboard/log`)**:
  - Filter by person name, gate ID, movement type (In / Out), and date range.
  - Data table with status badges and timestamps.
  - Client-side pagination (10 rows per page).
  - CSV export with UTF-8 BOM encoding for proper Arabic text rendering in Microsoft Excel.

---

## Demo Credentials

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Security Guard** | `guard` | `1234` | View gates & logs, toggle gate open/close |
| **System Admin** | `admin` | `1234` | Full access to gates, logs, and administrative controls |

---

## How to Swap Mock Services for Real API Calls

All data fetching and business logic are cleanly isolated in dedicated feature services and custom hooks. The UI components depend strictly on service contracts rather than internal mock implementations.

To connect a real backend API:

### 1. Configure the API Client
Create an HTTP client in `src/shared/services/apiClient.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_URL || "https://api.security.example.com/v1";

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const token = sessionStorage.getItem("gate_auth_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: { ...headers, ...customConfig.headers },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
}
```

### 2. Replace Auth Service (`src/features/auth/services/authService.js`)
Replace the mock promise with the endpoint call:

```javascript
import { apiClient } from "../../../shared/services/apiClient.js";

export const authService = {
  async login(username, password) {
    const data = await apiClient("/auth/login", {
      body: { username, password },
    });
    sessionStorage.setItem("gate_auth_session", JSON.stringify(data));
    sessionStorage.setItem("gate_auth_token", data.token);
    return data;
  },

  async logout() {
    await apiClient("/auth/logout", { method: "POST" });
    sessionStorage.removeItem("gate_auth_session");
    sessionStorage.removeItem("gate_auth_token");
  },

  getSession() {
    const data = sessionStorage.getItem("gate_auth_session");
    return data ? JSON.parse(data) : null;
  },
};
```

### 3. Replace Gates Service (`src/features/gates/services/gatesService.js`)
```javascript
import { apiClient } from "../../../shared/services/apiClient.js";

export const gatesService = {
  async getGates() {
    return apiClient("/gates");
  },

  async toggleGate(gateId) {
    return apiClient(`/gates/${gateId}/toggle`, { method: "POST" });
  },

  async simulateLiveUpdate() {
    return apiClient("/gates/live-status");
  },
};
```

### 4. Replace Access Log Service (`src/features/access-log/services/accessLogService.js`)
```javascript
import { apiClient } from "../../../shared/services/apiClient.js";

export const accessLogService = {
  async getLogs(filters = {}) {
    const query = new URLSearchParams();
    if (filters.search) query.set("search", filters.search);
    if (filters.gateId && filters.gateId !== "all") query.set("gateId", filters.gateId);
    if (filters.type && filters.type !== "all") query.set("type", filters.type);
    if (filters.dateFrom) query.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) query.set("dateTo", filters.dateTo);

    return apiClient(`/access-logs?${query.toString()}`);
  },
};
```

Because components only interact through `useGates()`, `useAuth()`, and `accessLogService.getLogs()`, **zero modifications to React components or JSX are required** when connecting the real API.
