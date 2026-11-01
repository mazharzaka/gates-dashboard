export function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const trimmedUser = (username || "").trim().toLowerCase();
      if (trimmedUser === "guard" && password === "1234") {
        resolve({
          name: "guard",
          nameAr: "حارس أمن (guard)",
          role: "guard",
          token: "mock-token-guard",
        });
      } else if (trimmedUser === "guard2" && password === "1234") {
        resolve({
          name: "guard2",
          nameAr: "حارس أمن 2 (guard2)",
          role: "guard",
          token: "mock-token-guard2",
        });
      } else if (trimmedUser === "admin" && password === "1234") {
        resolve({
          name: "admin",
          nameAr: "مدير النظام (admin)",
          role: "admin",
          token: "mock-token-admin",
        });
      } else {
        reject(new Error("invalid_credentials"));
      }
    }, 600);
  });
}

export const authService = {
  login: mockLogin,
};
