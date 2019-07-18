import { Component } from "./component";

export class MyComponent extends Component {
  status: number;

  constructor(id: string, name: string, description: string) {
    super(id, name, description);
    this.status = 0;
  }

  clicked() {
    this.status++;
    this.updateDOM();
  }

  computeStatus() {
    this.statusEl = <HTMLSpanElement>document.createElement("span");
    this.statusEl.innerHTML = "<h1>" + this.status + "</h1>";
    this.statusEl.id = "status_" + this.id;

    this.statusCtrlEl = <HTMLButtonElement>document.createElement("button");
    this.statusCtrlEl.onclick = evt => this.clicked();
    this.statusCtrlEl.textContent = "CLICK";
    this.statusCtrlEl.id = "ctrl_" + this.id;
  }
}

window.customElements.define("automation-mycomponent", MyComponent);
