import { Component } from "./component";

export class Door extends Component {
  opened: boolean;

  constructor(id: string, name: string, description: string) {
    super(id, name, description);
    this.opened = false;
  }

  // called by the button to change the state
  toogleDoor() {
    this.opened = !this.opened;
    this.updateDOM();
  }

  // override with the specific behavior of a Door
  computeStatus() {
    this.statusCtrlEl = <HTMLButtonElement>document.createElement("button");
    this.statusCtrlEl.className = "spectrum-Button spectrum-Button--cta";
    this.statusCtrlEl.onclick = evt => this.toogleDoor(); //arrow function keep the instance state
    this.statusCtrlEl.id = "door_ctrl_" + this.id; //to be able to retrieve them from the document

    this.statusEl = <HTMLSpanElement>document.createElement("span");
    this.statusEl.id = "door_status_" + this.id; //to be able to retrieve them from the document

    this.statusEl.className = "spectrum-Label spectrum-Label--large";
    if (this.opened) {
      this.statusEl.innerText = "OPENED";
      this.statusEl.className += " spectrum-Label--blue";
      this.statusCtrlEl.textContent = "CLOSE";
    } else {
      this.statusEl.innerText = "CLOSED";
      this.statusEl.className += " spectrum-Label--grey";
      this.statusCtrlEl.textContent = "OPEN";
    }
  }
}

window.customElements.define("automation-door", Door);
