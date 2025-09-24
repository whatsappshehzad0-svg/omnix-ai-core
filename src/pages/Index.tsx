import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { AuthForm } from "@/components/AuthForm";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard />;
};

export default Index;
