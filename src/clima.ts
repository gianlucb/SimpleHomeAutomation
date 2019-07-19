import { Component } from "./component";

export class Clima extends Component {
  temperature: number;

  constructor(id: string, name: string, description: string) {
    super(id, name, description);
    this.temperature = Math.floor(Math.random() * (30 - 10) + 10);
  }

  changeTemperature(diff: number) {
    this.temperature = this.temperature + diff;
    this.updateDOM();
  }

  // override with the specific behavior of a Clima
  computeStatus() {
    this.statusEl = <HTMLSpanElement>document.createElement("span");
    this.statusEl.id = "door_status_" + this.id; //to be able to retrieve them from the document
    this.statusEl.style.fontSize = "2.8em";
    this.statusEl.style.color = "#666666";

    this.statusEl.innerHTML = "<h1>" + this.temperature + "°</h1>";

    this.statusCtrlEl = <HTMLDivElement>document.createElement("div");
    this.statusCtrlEl.id = "clima_ctrl_" + this.id;

    let plusEl = <HTMLButtonElement>document.createElement("button");
    plusEl.className = "spectrum-Button spectrum-Button--cta";
    plusEl.onclick = evt => this.changeTemperature(1);
    plusEl.textContent = "+";

    let minusEl = <HTMLButtonElement>document.createElement("button");
    minusEl.className = "spectrum-Button spectrum-Button";
    minusEl.onclick = evt => this.changeTemperature(-1);
    minusEl.textContent = "-";

    this.statusCtrlEl.appendChild(plusEl);
    this.statusCtrlEl.appendChild(minusEl);
  }
}

window.customElements.define("automation-clima", Clima);
