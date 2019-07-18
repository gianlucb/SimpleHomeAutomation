import { Component } from "./component";

export class Clima extends Component {
  temp: number;

  constructor(id: string, name: string, description: string) {
    super(id, name, description);
    this.temp = Math.floor(Math.random() * (35 - 10) + 10);
  }

  // override with the specific behavior of a Clima
  computeStatus() {
    this.statusEl = <HTMLSpanElement>document.createElement("span");
    this.statusEl.id = "door_status_" + this.id; //to be able to retrieve them from the document
    this.statusEl.style.fontSize = "2.8em";
    this.statusEl.style.color = "#666666";

    this.statusEl.innerHTML = "<h1>" + this.temp + "°</h1>";
  }
}

window.customElements.define("automation-clima", Clima);
