import { LanguageProvider } from "../../shared/hooks/useLanguage.js";
import { AuthProvider } from "../../features/auth/context/AuthContext.jsx";

export function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}

export default Providers;

