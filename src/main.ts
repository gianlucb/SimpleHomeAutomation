import { Door } from "./door";
import { Component } from "./component";

function showPanel() {
  const elt = document.getElementById("main");

  for (let i = 0; i < 20; i++) {
    let door = new Door("" + i, "Main Door", "Entrance door, allarmed");
    elt.appendChild(door);
  }
}

showPanel();
