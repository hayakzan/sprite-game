import React, { useState } from "react";
import Game from "./Game";

function App() {
  const [sprite, setSprite] = useState(null);
  const [gameReady, setGameReady] = useState(false);
  const [processedSprite, setProcessedSprite] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    setSprite(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!sprite) {
      alert("Please upload a sprite first!");
      return;
    }

    alert("Starting fetch request...");

    const formData = new FormData();
    formData.append("sprite", document.querySelector("input[type='file']").files[0]);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error response:", error);
        alert(`Error: ${error.error}`);
        return;
      }

      const data = await response.json();
      alert(`Sprite processed successfully! Path: ${data.sprite_path}`);
      console.log(data);

      setProcessedSprite(`http://localhost:8000/${data.sprite_path}`);
      setGameReady(true);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to communicate with the server. Check the console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!gameReady ? (
        <>
          <h1>Upload Your Sprite</h1>
          <input type="file" accept="image/*" onChange={handleUpload} />
          <br />
          {sprite && (
            <div>
              <h3>Preview:</h3>
              <img
                src={sprite}
                alt="Sprite Preview"
                style={{ width: "200px", marginTop: "10px" }}
              />
            </div>
          )}
          <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
            Generate Game
          </button>
        </>
      ) : (
        <Game spritePath={processedSprite} />
      )}
    </div>
  );
}

export default App;
