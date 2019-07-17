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
  //field
  name: string;
  description: string;
  enabled: boolean;
  id: string;

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
    //todo: check input validation
    this.name = name;
    this.description = description;
    this.id = id;
    this.enabled = true;
  }

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
    coverDiv.appendChild(this.getStatusElement());

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
    return null;
  }

  /**
   * Define the UI to display the status of the component status (image/label/...)
   * Must be defined in the derived component
   */
  getStatusElement(): HTMLElement {
    return null;
  }
}

window.customElements.define("automation-component", Component);
