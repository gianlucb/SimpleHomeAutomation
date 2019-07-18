import { Component } from "./component";

export class Curtain extends Component {
  grades: number;

  constructor(id: string, name: string, description: string) {
    super(id, name, description);
    this.grades = 0;
  }

  changeGrades(data) {
    console.debug("input", data);
    this.grades = data.target.value;
    this.updateDOM();
  }

  // override with the specific behavior of a Curtain
  computeStatus() {
    // the status control is a slider
    this.statusCtrlEl = <HTMLDivElement>document.createElement("div");

    let sliderInputEl = <HTMLInputElement>document.createElement("input");
    sliderInputEl.type = "range";
    sliderInputEl.step = "10";
    sliderInputEl.min = "0";
    sliderInputEl.max = "100";
    sliderInputEl.value = "" + this.grades;
    sliderInputEl.onchange = v => this.changeGrades(v);

    this.statusCtrlEl.id = "curtain_ctrl_" + this.id;
    this.statusCtrlEl.appendChild(sliderInputEl);

    this.statusEl = <HTMLDivElement>document.createElement("div");
    this.statusEl.id = "curtain_status_" + this.id;

    // this.statusEl.style.marginTop = "0px";
    this.statusEl.style.width = "100%";
    this.statusEl.style.height = this.grades + "%";
    this.statusEl.style.backgroundColor = "#c5c5c5";
    this.statusEl.style.alignSelf = "start";
  }
}

window.customElements.define("automation-curtain", Curtain);
