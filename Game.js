import React, { useEffect } from "react";
import Phaser from "phaser";

function Game({ spritePath }) {
  useEffect(() => {
    // Create a Phaser game instance
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "phaser-container", // Attach to this DOM element
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
      scene: {
        preload: function () {
          this.load.image("sprite", spritePath); // Dynamically load the sprite
        },
        create: function () {
          this.add.image(400, 300, "sprite"); // Display the sprite
        },
      },
    };

    const game = new Phaser.Game(config);

    // Clean up the game instance when the component unmounts
    return () => {
      game.destroy(true);
    };
  }, [spritePath]);

  return <div id="phaser-container"></div>; // This is where the Phaser game will render
}

export default Game;
