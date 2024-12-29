import React, { useEffect } from "react";
import Phaser from "phaser";

function Game({ spritePath }) {
  useEffect(() => {
    console.log("Sprite Path:", spritePath);

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "phaser-container",
      backgroundColor: "#ffffff", // White background to ensure sprite visibility
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
      scene: {
        preload: function () {
          console.log("Preloading sprite from:", spritePath);
          this.load.image("sprite", spritePath);
        },
        create: function () {
          console.log("Creating sprite...");
          const sprite = this.add.image(400, 300, "sprite");
          console.log("Sprite position:", sprite.x, sprite.y);
        },
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, [spritePath]);

  return <div id="phaser-container"></div>;
}

export default Game;
