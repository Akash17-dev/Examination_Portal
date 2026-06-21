import { useEffect, useState } from "react";
import { readJsonResponse } from "../utils/api";

export function useDatabaseStatus() {
  const [dbStatus, setDbStatus] = useState({ state: "checking", text: "Checking database" });

  useEffect(() => {
    let isActive = true;

    fetch("/api/health")
      .then(readJsonResponse)
      .then((data) => {
        if (!isActive) return;

        setDbStatus({
          state: data.ok ? "connected" : "error",
          text: data.ok ? `MongoDB connected: ${data.database}` : data.message,
        });
      })
      .catch((error) => {
        if (!isActive) return;
        setDbStatus({ state: "error", text: error.message });
      });

    return () => {
      isActive = false;
    };
  }, []);

  return dbStatus;
}
