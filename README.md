# SIMPLE HOME AUTOMATION PANEL

PoC made with _Typescript_ and _Adobe Spectrum CSS_

## BUILD & RUN

```bash
nmp install
gulp
```

## ARCHITECTURE

The _main.ts_ file is the entry point of this simple application.
It defines the components to display, adding them to the DOM.
Each component defines its own status and _redraw_ itself if it changes.

## EXTENSIONS

The base class _Component_ contains the main logic to draw the component and update the DOM (UI) when the component's status change.
The class draws a CSS _Card_ that shows the current **status** and a **status control** element to manage the component.

In order to create a new Component you need to create a new class that inherits from _Component_.
Each component must define its own status logic and the elements to manage it.
The base class will draw only the following elements:

- **statusCtrlEl**: HTML element to display the controls for the component (_optional_)
- **statusEl**: HTML element to display the component status (_optional_)

For "_more complex scenarios_" the best way is to add child elements to thse basic elements.

The minimum skeleton of a component is the following:

```typescript
import { Component } from "./component";

export class MyComponent extends Component {
  constructor(id: string, name: string, description: string) {
    super(id, name, description);
  }

  computeStatus() {
    // define the statusEl and the statusCtrlEl
    // set the ids for these documents
  }
}

window.customElements.define("automation-mycomponent", MyComponent);
```

When a component change the status or just want to redraw itself it must call _this.updateDOM()_

Example of a minimal custom component:

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
