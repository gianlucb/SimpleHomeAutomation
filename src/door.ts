import { Component } from "./component";

export class Door extends Component {
  statusButton: HTMLButtonElement;
  opened: boolean;
  statusEl: HTMLSpanElement;

  constructor(id: string, name: string, description: string) {
    super(id, name, description);
    this.opened = false;
  }

  // custom state control for a door
  getStatusControlElement(): HTMLElement {
    return this.statusButton;
  }

  /* draw the following HTML:
   <span class="spectrum-Label spectrum-Label--large spectrum-Label--blue">Blue Label</span>
  */
  getStatusElement(): HTMLElement {
    this.refreshStatus();
    return this.statusEl;
  }

  changeState() {
    this.opened = !this.opened;

    this.refreshStatus();

    // redraw the UI just replacing the elements that changed
    let currentStateButton = document.getElementById(this.statusButton.id);
    currentStateButton.replaceWith(this.statusButton);

    let currentStatusEl = document.getElementById(this.statusEl.id);
    currentStatusEl.replaceWith(this.statusEl);
  }

  /** Compute the status of this component */
  refreshStatus() {
    this.statusButton = <HTMLButtonElement>document.createElement("button");
    this.statusButton.className = "spectrum-Button spectrum-Button--cta";
    this.statusButton.onclick = evt => this.changeState(); //arrow function keep the instance state
    this.statusButton.id = "ctrl_" + this.id;

    this.statusEl = <HTMLSpanElement>document.createElement("span");
    this.statusEl.id = "status_" + this.id;
    this.statusEl.className = "spectrum-Label spectrum-Label--large";
    if (this.opened) {
      this.statusEl.innerText = "OPENED";
      this.statusEl.className += " spectrum-Label--blue";
      this.statusButton.textContent = "OPEN";
    } else {
      this.statusEl.innerText = "CLOSED";
      this.statusEl.className += " spectrum-Label--grey";
      this.statusButton.textContent = "CLOSE";
    }
  }
}

window.customElements.define("automation-door", Door);
