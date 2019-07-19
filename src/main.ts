import { Door } from "./door";
import { Light } from "./light";
import { Curtain } from "./curtain";
import { Clima } from "./clima";
// import { MyComponent } from "./mycomponent";

function showPanel() {
  const curtainsEl = document.getElementById("curtains");
  const doorsEl = document.getElementById("doors");
  const lightsEl = document.getElementById("lights");
  const climaEl = document.getElementById("clima");

  doorsEl.appendChild(
    new Door("door1", "Main Door", "Entrance door, allarmed")
  );
  doorsEl.appendChild(
    new Door("door2", "Back Door", "Must be alwasy closed, allarmed")
  );
  doorsEl.appendChild(
    new Door("door3", "Garden Door", "Garden door, this is not allarmed")
  );

  lightsEl.appendChild(new Light("ligth1", "Kitchen light", ""));
  lightsEl.appendChild(new Light("ligth2", "Bedroom", ""));
  lightsEl.appendChild(new Light("ligth3", "Living room", ""));
  lightsEl.appendChild(new Light("ligth5", "Children room", ""));
  lightsEl.appendChild(new Light("ligth6", "Outdoor", ""));

  curtainsEl.appendChild(new Curtain("curtain1", "Entrance", "Home entrance"));
  curtainsEl.appendChild(
    new Curtain("curtain3", "Living room", "living room curtain")
  );
  curtainsEl.appendChild(new Curtain("curtain2", "Outdoor", "Front garden"));

  climaEl.appendChild(new Clima("clima0", "Kitchen", "Automatic temperature"));
  climaEl.appendChild(new Clima("clima1", "Room", "Automatic temperature"));
  climaEl.appendChild(new Clima("clima2", "Bath", "Automatic temperature"));

  // climaEl.appendChild(new MyComponent("comp", "name", "Automatic temperature"));
}

showPanel();
