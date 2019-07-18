import { Door } from "./door";
import { Light } from "./light";
import { Curtain } from "./curtain";
import { Component } from "./component";

function showPanel() {
  const elt = document.getElementById("main");

  for (let i = 0; i < 5; i++) {
    let door = new Door("" + i, "Main Door", "Entrance door, allarmed");
    elt.appendChild(door);
  }

  for (let i = 0; i < 5; i++) {
    let light = new Light("" + i, "Main Light", "Entrance");
    elt.appendChild(light);
  }

  for (let i = 0; i < 3; i++) {
    let curtain = new Curtain("" + i, "Main curtain", "Entrance");
    elt.appendChild(curtain);
  }
}

showPanel();
