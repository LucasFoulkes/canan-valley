import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./App.css";

function App() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/tables")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }
        setTables(data);
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Button>hello world</Button>
    </div>
  );
}

export default App;
