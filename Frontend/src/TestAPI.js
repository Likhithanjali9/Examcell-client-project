import React, { useEffect, useState } from "react";
import axios from "axios";

function TestAPI() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/test/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div>
      <h2>Backend says:</h2>
      <p>{message}</p>
    </div>
  );
}

export default TestAPI;
