import { Component } from "./component";

export class Light extends Component {
  on: boolean;

  constructor(id: string, name: string, description: string) {
    super(id, name, description);
    this.on = false;
  }

  // called by the button to change the state
  toogleLight() {
    this.on = !this.on;
    this.updateDOM();
  }

  // override with the specific behavior of a Light
  computeStatus() {
    this.statusCtrlEl = <HTMLButtonElement>document.createElement("button");
    this.statusCtrlEl.className = "spectrum-Button spectrum-Button--cta";
    this.statusCtrlEl.onclick = evt => this.toogleLight(); //arrow function keep the instance state
    this.statusCtrlEl.id = "light_ctrl_" + this.id; //to be able to retrieve them from the document

    this.statusEl = <HTMLDivElement>document.createElement("div");
    this.statusEl.id = "light_status_" + this.id; //to be able to retrieve them from the document

    this.statusEl.className = "spectrum-Label spectrum-Label--large";
    this.statusEl.style.width = "100%";
    this.statusEl.style.height = "100%";
    if (this.on) {
      this.statusEl.style.backgroundColor = "#ffe62b";
      this.statusEl.innerHTML =
        "<label class='spectrum-Label spectrum-Label--large'>ON</label>";
      this.statusCtrlEl.textContent = "TURN OFF";
    } else {
      this.statusEl.style.backgroundColor = "grey";
      this.statusEl.innerHTML =
        "<label class='spectrum-Label spectrum-Label--large'>OFF</label>";
      this.statusCtrlEl.textContent = "TURN ON";
    }
  }
}

window.customElements.define("automation-light", Light);
