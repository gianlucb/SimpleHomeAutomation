# SIMPLE HOME AUTOMATION PANEL

PoC made with _Typescript_ and _Adobe Spectrum CSS_

## BUILD & RUN

```bash
nmp install
gulp
```

## ARCHITECTURE

The _main.ts_ file is the entry point of this simple application.
It defines the components to display and adds them to the DOM.
Each component defines its own status and _redraw_ itself if it changes.

## EXTENSIONS

The base class _Component_ contains the main logic to draw a component and update the DOM (UI) when the component's status change.

The class draws a _CSS Spectrum Card_ that shows the current **status** and a **status control** element to manage the component. This is a generic class meant to be used as base class.
Each derived component is then responsible to define its specify logic.

In order to create a new _Automation Component_ you need to create a new class that inherits from **Component** and override _computeStatus()_.
Each component can define its own status logic and the elements to manage it.
In any case the base class will draw only the following two elements:

- **statusCtrlEl**: HTML element to display the controls for the component (_optional_)
- **statusEl**: HTML element to display the component status (_optional_)

For "_more complex scenarios_" the best way is to add child elements to these basic elements.
It is mandatory that the derived class set the **id** property of these two elements with a unique value (otherwise the controls will not be updated)

The minimum skeleton of a component is the following:

```typescript
import { Component } from "./component";

export class MyComponent extends Component {
  constructor(id: string, name: string, description: string) {
    super(id, name, description);
  }

  computeStatus() {
    // define the statusEl and the statusCtrlEl elements
    // set the id property for these elements
  }
}

window.customElements.define("automation-mycomponent", MyComponent);
```

The base class will call _computeStatus()_ every time it needs to draw the component. At the first load the method _connectedCallback()_ is called as soon as the HTML element is added to the DOM, this method internally calls _getTemplate()_ to load the base HTML to use.
It is _getTemplate()_ that calls the _computeStatus()_ on the derived class.

When the component changes the status or when just want to redraw itself it must call _this.updateDOM()_.

### Example of a custom component

```typescript
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
```
