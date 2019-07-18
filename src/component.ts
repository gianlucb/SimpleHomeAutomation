export enum ComponentState {
  On = 0,
  Off = 1,
  None = 2 //means does not apply
}

/**
 * Basic Automation Component. Draw itself as a Spectrum card
 * Defines some extension points where to hook to manage the component status
 */

/*
 HTML created by this element
 <div class="spectrum-Card" style="width: 208px;">
    <div class="spectrum-Card-coverPhoto">
      COVER
    </div>
    <div class="spectrum-Card-body">
        <div class="spectrum-Card-header">
            <div class="spectrum-Card-title">ComponentName</div>
        </div>
        <div class="spectrum-Card-content">
            <div class="spectrum-Card-subtitle">description</div>
        </div>
    </div>
    <div class="spectrum-Card-footer">
        FOOTER
    </div>
</div>
 */

export class Component extends HTMLElement {
  name: string;
  description: string;
  id: string;

  statusCtrlEl: HTMLElement;
  statusEl: HTMLElement;

  /**
   * Base component, generic class to use as parent.
   * Each derived component should define its status representation and status control elements
   *
   * @param name display name
   * @param description description of the component
   * @param id must be unique in the DOM
   */
  constructor(id: string, name: string, description: string) {
    super();
    if (id == null || id.length == 0) throw "invalid id";
    this.name = name;
    this.description = description;
    this.id = id;
  }

  // called when added to the DOM - the first time
  connectedCallback() {
    this.appendChild(this.getTemplate());
  }

  getTemplate() {
    // draw a basic Spectrum Card

    let cardDiv = <HTMLDivElement>document.createElement("div");
    cardDiv.style.width = "208px";
    cardDiv.style.margin = "25px 25px";
    cardDiv.className = "spectrum-Card";

    let coverDiv = <HTMLDivElement>document.createElement("div");
    coverDiv.className = "spectrum-Card-coverPhoto";
    coverDiv.style.alignItems = "center";
    let statusElement = this.getStatusElement();
    if (statusElement != null) coverDiv.appendChild(statusElement);

    let bodyDiv = <HTMLDivElement>document.createElement("div");
    bodyDiv.className = "spectrum-Card-body";

    let headerDiv = <HTMLDivElement>document.createElement("div");
    headerDiv.className = "spectrum-Card-header";

    let titleDiv = <HTMLDivElement>document.createElement("div");
    titleDiv.className = "spectrum-Card-title";
    titleDiv.innerText = this.name;

    let contentDiv = <HTMLDivElement>document.createElement("div");
    contentDiv.className = "spectrum-Card-content";

    let subtitleDiv = <HTMLDivElement>document.createElement("div");
    subtitleDiv.className = "spectrum-Card-subtitle";
    subtitleDiv.innerText = this.description;

    let footerDiv = <HTMLDivElement>document.createElement("div");
    footerDiv.className = "spectrum-Card-footer";

    let statusControlElement = this.getStatusControlElement();
    if (statusControlElement != null)
      footerDiv.appendChild(statusControlElement);

    contentDiv.appendChild(subtitleDiv);
    headerDiv.appendChild(titleDiv);
    bodyDiv.appendChild(headerDiv);
    bodyDiv.appendChild(contentDiv);

    cardDiv.appendChild(coverDiv);
    cardDiv.appendChild(bodyDiv);
    cardDiv.appendChild(footerDiv);

    return cardDiv;
  }

  /**
   * Define the control to use to change the component status (button/slider/checkbox...)
   * Must be defined in the derived component
   */
  getStatusControlElement(): HTMLElement {
    return this.statusCtrlEl;
  }

  /**
   * Define the UI to display the status of the component status (image/label/...)
   * Must be defined in the derived component
   */
  getStatusElement(): HTMLElement {
    this.computeStatus();
    return this.statusEl;
  }

  /** Compute the status of this component
   * This must be overridden in a derived class
   * This should just change the HTMLElements for display and control
   * This must also set an ID to the HTMLElements that needs to be updated
   */
  computeStatus() {}

  /**
   * Update the DOM of the document replacing the old values with the current ones
   * Must be called everytime the component wants to update the page.
   * Internally calls computeStatus() as first step
   * It is mandatory that the two elements have an ID defined. Otherwise they will not be updated
   */
  updateDOM() {
    this.computeStatus();

    // redraw the UI just replacing the elements that has changed
    if (this.statusCtrlEl != null) {
      let currentStateCtrl = document.getElementById(this.statusCtrlEl.id);
      if (currentStateCtrl != null)
        currentStateCtrl.replaceWith(this.statusCtrlEl);
    }

    if (this.statusEl != null) {
      let currentStatusEl = document.getElementById(this.statusEl.id);
      if (currentStatusEl != null) currentStatusEl.replaceWith(this.statusEl);
    }
  }
}

window.customElements.define("automation-component", Component);
