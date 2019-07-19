(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class Clima extends component_1.Component {
    constructor(id, name, description) {
        super(id, name, description);
        this.temp = Math.floor(Math.random() * (35 - 10) + 10);
    }
    // override with the specific behavior of a Clima
    computeStatus() {
        this.statusEl = document.createElement("span");
        this.statusEl.id = "door_status_" + this.id; //to be able to retrieve them from the document
        this.statusEl.style.fontSize = "2.8em";
        this.statusEl.style.color = "#666666";
        this.statusEl.innerHTML = "<h1>" + this.temp + "°</h1>";
    }
}
exports.Clima = Clima;
window.customElements.define("automation-clima", Clima);
},{"./component":2}],2:[function(require,module,exports){
"use strict";
/**
 * Basic Automation Component. Draw itself as a Spectrum card
 * Defines some extension points where to hook to manage the component status
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 HTML created by this element:

 <div class="spectrum-Card" style="width: 208px;">
    <div class="spectrum-Card-coverPhoto">
      STATUS
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
        STATUS CONTROL
    </div>
</div>
 */
class Component extends HTMLElement {
    /**
     * Base component, generic class to use as parent.
     * Each derived component should define its status representation and status control elements
     *
     * @param name display name
     * @param description description of the component
     * @param id must be unique in the DOM
     */
    constructor(id, name, description) {
        super();
        if (id == null || id.length == 0)
            throw "invalid id";
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
        let cardDiv = document.createElement("div");
        cardDiv.style.width = "208px";
        cardDiv.style.margin = "25px 25px";
        cardDiv.className = "spectrum-Card";
        let coverDiv = document.createElement("div");
        coverDiv.className = "spectrum-Card-coverPhoto";
        coverDiv.style.alignItems = "center";
        let statusElement = this.getStatusElement();
        if (statusElement != null)
            coverDiv.appendChild(statusElement);
        let bodyDiv = document.createElement("div");
        bodyDiv.className = "spectrum-Card-body";
        let headerDiv = document.createElement("div");
        headerDiv.className = "spectrum-Card-header";
        let titleDiv = document.createElement("div");
        titleDiv.className = "spectrum-Card-title";
        titleDiv.innerText = this.name;
        let contentDiv = document.createElement("div");
        contentDiv.className = "spectrum-Card-content";
        let subtitleDiv = document.createElement("div");
        subtitleDiv.className = "spectrum-Card-subtitle";
        subtitleDiv.innerText = this.description;
        let footerDiv = document.createElement("div");
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
    getStatusControlElement() {
        this.computeStatus();
        return this.statusCtrlEl;
    }
    /**
     * Define the UI to display the status of the component status (image/label/...)
     * Must be defined in the derived component
     */
    getStatusElement() {
        this.computeStatus();
        return this.statusEl;
    }
    /** Compute the status of this component
     * This must be overridden in a derived class
     * This should just change the HTMLElements for display and control
     * This must also set an ID to the HTMLElements that need to be updated
     */
    computeStatus() { }
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
            if (currentStatusEl != null)
                currentStatusEl.replaceWith(this.statusEl);
        }
    }
}
exports.Component = Component;
window.customElements.define("automation-component", Component);
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class Curtain extends component_1.Component {
    constructor(id, name, description) {
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
        this.statusCtrlEl = document.createElement("div");
        let sliderInputEl = document.createElement("input");
        sliderInputEl.type = "range";
        sliderInputEl.step = "10";
        sliderInputEl.min = "0";
        sliderInputEl.max = "100";
        sliderInputEl.value = "" + this.grades;
        sliderInputEl.onchange = v => this.changeGrades(v);
        this.statusCtrlEl.id = "curtain_ctrl_" + this.id;
        this.statusCtrlEl.appendChild(sliderInputEl);
        this.statusEl = document.createElement("div");
        this.statusEl.id = "curtain_status_" + this.id;
        // this.statusEl.style.marginTop = "0px";
        this.statusEl.style.width = "100%";
        this.statusEl.style.height = this.grades + "%";
        this.statusEl.style.backgroundColor = "#c5c5c5";
        this.statusEl.style.alignSelf = "start";
    }
}
exports.Curtain = Curtain;
window.customElements.define("automation-curtain", Curtain);
},{"./component":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class Door extends component_1.Component {
    constructor(id, name, description) {
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
        this.statusCtrlEl = document.createElement("button");
        this.statusCtrlEl.className = "spectrum-Button spectrum-Button--cta";
        this.statusCtrlEl.onclick = evt => this.toogleDoor(); //arrow function keep the instance state
        this.statusCtrlEl.id = "door_ctrl_" + this.id; //to be able to retrieve them from the document
        this.statusEl = document.createElement("span");
        this.statusEl.id = "door_status_" + this.id; //to be able to retrieve them from the document
        this.statusEl.className = "spectrum-Label spectrum-Label--large";
        if (this.opened) {
            this.statusEl.innerText = "OPENED";
            this.statusEl.className += " spectrum-Label--blue";
            this.statusCtrlEl.textContent = "CLOSE";
        }
        else {
            this.statusEl.innerText = "CLOSED";
            this.statusEl.className += " spectrum-Label--grey";
            this.statusCtrlEl.textContent = "OPEN";
        }
    }
}
exports.Door = Door;
window.customElements.define("automation-door", Door);
},{"./component":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class Light extends component_1.Component {
    constructor(id, name, description) {
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
        this.statusCtrlEl = document.createElement("button");
        this.statusCtrlEl.className = "spectrum-Button spectrum-Button--cta";
        this.statusCtrlEl.onclick = evt => this.toogleLight(); //arrow function keep the instance state
        this.statusCtrlEl.id = "light_ctrl_" + this.id; //to be able to retrieve them from the document
        this.statusEl = document.createElement("div");
        this.statusEl.id = "light_status_" + this.id; //to be able to retrieve them from the document
        this.statusEl.className = "spectrum-Label spectrum-Label--large";
        this.statusEl.style.width = "100%";
        this.statusEl.style.height = "100%";
        if (this.on) {
            this.statusEl.style.backgroundColor = "#ffe62b";
            this.statusEl.innerHTML =
                "<label class='spectrum-Label spectrum-Label--large'>ON</label>";
            this.statusCtrlEl.textContent = "TURN OFF";
        }
        else {
            this.statusEl.style.backgroundColor = "grey";
            this.statusEl.innerHTML =
                "<label class='spectrum-Label spectrum-Label--large'>OFF</label>";
            this.statusCtrlEl.textContent = "TURN ON";
        }
    }
}
exports.Light = Light;
window.customElements.define("automation-light", Light);
},{"./component":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const door_1 = require("./door");
const light_1 = require("./light");
const curtain_1 = require("./curtain");
const clima_1 = require("./clima");
const mycomponent_1 = require("./mycomponent");
function showPanel() {
    const curtainsEl = document.getElementById("curtains");
    const doorsEl = document.getElementById("doors");
    const lightsEl = document.getElementById("lights");
    const climaEl = document.getElementById("clima");
    doorsEl.appendChild(new door_1.Door("door1", "Main Door", "Entrance door, allarmed"));
    doorsEl.appendChild(new door_1.Door("door2", "Back Door", "Must be alwasy closed, allarmed"));
    doorsEl.appendChild(new door_1.Door("door3", "Garden Door", "Garden door, this is not allarmed"));
    lightsEl.appendChild(new light_1.Light("ligth1", "Kitchen light", ""));
    lightsEl.appendChild(new light_1.Light("ligth2", "Bedroom", ""));
    lightsEl.appendChild(new light_1.Light("ligth3", "Living room", ""));
    lightsEl.appendChild(new light_1.Light("ligth5", "Children room", ""));
    lightsEl.appendChild(new light_1.Light("ligth6", "Outdoor", ""));
    curtainsEl.appendChild(new curtain_1.Curtain("curtain1", "Entrance", "Home entrance"));
    curtainsEl.appendChild(new curtain_1.Curtain("curtain3", "Living room", "living room curtain"));
    curtainsEl.appendChild(new curtain_1.Curtain("curtain2", "Outdoor", "Front garden"));
    climaEl.appendChild(new clima_1.Clima("clima0", "Kitchen", "Automatic temperature"));
    climaEl.appendChild(new clima_1.Clima("clima1", "Room", "Automatic temperature"));
    climaEl.appendChild(new clima_1.Clima("clima2", "Bath", "Automatic temperature"));
    climaEl.appendChild(new mycomponent_1.MyComponent("comp", "name", "Automatic temperature"));
}
showPanel();
},{"./clima":1,"./curtain":3,"./door":4,"./light":5,"./mycomponent":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class MyComponent extends component_1.Component {
    constructor(id, name, description) {
        super(id, name, description);
        this.status = 0;
    }
    clicked() {
        this.status++;
        this.updateDOM();
    }
    computeStatus() {
        this.statusEl = document.createElement("span");
        this.statusEl.innerHTML = "<h1>" + this.status + "</h1>";
        this.statusEl.id = "status_" + this.id;
        this.statusCtrlEl = document.createElement("button");
        this.statusCtrlEl.onclick = evt => this.clicked();
        this.statusCtrlEl.textContent = "CLICK";
        this.statusCtrlEl.id = "ctrl_" + this.id;
    }
}
exports.MyComponent = MyComponent;
window.customElements.define("automation-mycomponent", MyComponent);
},{"./component":2}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2xpbWEudHMiLCJzcmMvY29tcG9uZW50LnRzIiwic3JjL2N1cnRhaW4udHMiLCJzcmMvZG9vci50cyIsInNyYy9saWdodC50cyIsInNyYy9tYWluLnRzIiwic3JjL215Y29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSwyQ0FBd0M7QUFFeEMsTUFBYSxLQUFNLFNBQVEscUJBQVM7SUFHbEMsWUFBWSxFQUFVLEVBQUUsSUFBWSxFQUFFLFdBQW1CO1FBQ3ZELEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtDQUErQztRQUM1RixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQzFELENBQUM7Q0FDRjtBQWpCRCxzQkFpQkM7QUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMs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QUFFLENBQUM7SUFDM0MsQ0FBQztDQUNGO0FBdkJELGtDQXVCQztBQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLFdBQVcsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2xpbWEgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIHRlbXA6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xyXG4gICAgdGhpcy50ZW1wID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDM1IC0gMTApICsgMTApO1xyXG4gIH1cclxuXHJcbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBDbGltYVxyXG4gIGNvbXB1dGVTdGF0dXMoKSB7XHJcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxTcGFuRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImRvb3Jfc3RhdHVzX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuZm9udFNpemUgPSBcIjIuOGVtXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmNvbG9yID0gXCIjNjY2NjY2XCI7XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbC5pbm5lckhUTUwgPSBcIjxoMT5cIiArIHRoaXMudGVtcCArIFwiwrA8L2gxPlwiO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tY2xpbWFcIiwgQ2xpbWEpO1xyXG4iLCIvKipcclxuICogQmFzaWMgQXV0b21hdGlvbiBDb21wb25lbnQuIERyYXcgaXRzZWxmIGFzIGEgU3BlY3RydW0gY2FyZFxyXG4gKiBEZWZpbmVzIHNvbWUgZXh0ZW5zaW9uIHBvaW50cyB3aGVyZSB0byBob29rIHRvIG1hbmFnZSB0aGUgY29tcG9uZW50IHN0YXR1c1xyXG4gKi9cclxuXHJcbi8qXHJcbiBIVE1MIGNyZWF0ZWQgYnkgdGhpcyBlbGVtZW50OlxyXG5cclxuIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkXCIgc3R5bGU9XCJ3aWR0aDogMjA4cHg7XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1jb3ZlclBob3RvXCI+XHJcbiAgICAgIFNUQVRVU1xyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1ib2R5XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLXRpdGxlXCI+Q29tcG9uZW50TmFtZTwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtc3VidGl0bGVcIj5kZXNjcmlwdGlvbjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1mb290ZXJcIj5cclxuICAgICAgICBTVEFUVVMgQ09OVFJPTFxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgaWQ6IHN0cmluZztcclxuXHJcbiAgc3RhdHVzQ3RybEVsOiBIVE1MRWxlbWVudDtcclxuICBzdGF0dXNFbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhc2UgY29tcG9uZW50LCBnZW5lcmljIGNsYXNzIHRvIHVzZSBhcyBwYXJlbnQuXHJcbiAgICogRWFjaCBkZXJpdmVkIGNvbXBvbmVudCBzaG91bGQgZGVmaW5lIGl0cyBzdGF0dXMgcmVwcmVzZW50YXRpb24gYW5kIHN0YXR1cyBjb250cm9sIGVsZW1lbnRzXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmFtZSBkaXNwbGF5IG5hbWVcclxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gZGVzY3JpcHRpb24gb2YgdGhlIGNvbXBvbmVudFxyXG4gICAqIEBwYXJhbSBpZCBtdXN0IGJlIHVuaXF1ZSBpbiB0aGUgRE9NXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgaWYgKGlkID09IG51bGwgfHwgaWQubGVuZ3RoID09IDApIHRocm93IFwiaW52YWxpZCBpZFwiO1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICB9XHJcblxyXG4gIC8vIGNhbGxlZCB3aGVuIGFkZGVkIHRvIHRoZSBET00gLSB0aGUgZmlyc3QgdGltZVxyXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmdldFRlbXBsYXRlKCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVtcGxhdGUoKSB7XHJcbiAgICAvLyBkcmF3IGEgYmFzaWMgU3BlY3RydW0gQ2FyZFxyXG5cclxuICAgIGxldCBjYXJkRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjYXJkRGl2LnN0eWxlLndpZHRoID0gXCIyMDhweFwiO1xyXG4gICAgY2FyZERpdi5zdHlsZS5tYXJnaW4gPSBcIjI1cHggMjVweFwiO1xyXG4gICAgY2FyZERpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmRcIjtcclxuXHJcbiAgICBsZXQgY292ZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvdmVyRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1jb3ZlclBob3RvXCI7XHJcbiAgICBjb3ZlckRpdi5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcclxuICAgIGxldCBzdGF0dXNFbGVtZW50ID0gdGhpcy5nZXRTdGF0dXNFbGVtZW50KCk7XHJcbiAgICBpZiAoc3RhdHVzRWxlbWVudCAhPSBudWxsKSBjb3ZlckRpdi5hcHBlbmRDaGlsZChzdGF0dXNFbGVtZW50KTtcclxuXHJcbiAgICBsZXQgYm9keURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYm9keURpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtYm9keVwiO1xyXG5cclxuICAgIGxldCBoZWFkZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGhlYWRlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtaGVhZGVyXCI7XHJcblxyXG4gICAgbGV0IHRpdGxlRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aXRsZURpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtdGl0bGVcIjtcclxuICAgIHRpdGxlRGl2LmlubmVyVGV4dCA9IHRoaXMubmFtZTtcclxuXHJcbiAgICBsZXQgY29udGVudERpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29udGVudERpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtY29udGVudFwiO1xyXG5cclxuICAgIGxldCBzdWJ0aXRsZURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3VidGl0bGVEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLXN1YnRpdGxlXCI7XHJcbiAgICBzdWJ0aXRsZURpdi5pbm5lclRleHQgPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgIGxldCBmb290ZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGZvb3RlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtZm9vdGVyXCI7XHJcblxyXG4gICAgbGV0IHN0YXR1c0NvbnRyb2xFbGVtZW50ID0gdGhpcy5nZXRTdGF0dXNDb250cm9sRWxlbWVudCgpO1xyXG4gICAgaWYgKHN0YXR1c0NvbnRyb2xFbGVtZW50ICE9IG51bGwpXHJcbiAgICAgIGZvb3RlckRpdi5hcHBlbmRDaGlsZChzdGF0dXNDb250cm9sRWxlbWVudCk7XHJcblxyXG4gICAgY29udGVudERpdi5hcHBlbmRDaGlsZChzdWJ0aXRsZURpdik7XHJcbiAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xyXG4gICAgYm9keURpdi5hcHBlbmRDaGlsZChoZWFkZXJEaXYpO1xyXG4gICAgYm9keURpdi5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcclxuXHJcbiAgICBjYXJkRGl2LmFwcGVuZENoaWxkKGNvdmVyRGl2KTtcclxuICAgIGNhcmREaXYuYXBwZW5kQ2hpbGQoYm9keURpdik7XHJcbiAgICBjYXJkRGl2LmFwcGVuZENoaWxkKGZvb3RlckRpdik7XHJcblxyXG4gICAgcmV0dXJuIGNhcmREaXY7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmUgdGhlIGNvbnRyb2wgdG8gdXNlIHRvIGNoYW5nZSB0aGUgY29tcG9uZW50IHN0YXR1cyAoYnV0dG9uL3NsaWRlci9jaGVja2JveC4uLilcclxuICAgKiBNdXN0IGJlIGRlZmluZWQgaW4gdGhlIGRlcml2ZWQgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U3RhdHVzQ29udHJvbEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgdGhpcy5jb21wdXRlU3RhdHVzKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzQ3RybEVsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIHRoZSBVSSB0byBkaXNwbGF5IHRoZSBzdGF0dXMgb2YgdGhlIGNvbXBvbmVudCBzdGF0dXMgKGltYWdlL2xhYmVsLy4uLilcclxuICAgKiBNdXN0IGJlIGRlZmluZWQgaW4gdGhlIGRlcml2ZWQgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U3RhdHVzRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XHJcbiAgICB0aGlzLmNvbXB1dGVTdGF0dXMoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdGF0dXNFbDtcclxuICB9XHJcblxyXG4gIC8qKiBDb21wdXRlIHRoZSBzdGF0dXMgb2YgdGhpcyBjb21wb25lbnRcclxuICAgKiBUaGlzIG11c3QgYmUgb3ZlcnJpZGRlbiBpbiBhIGRlcml2ZWQgY2xhc3NcclxuICAgKiBUaGlzIHNob3VsZCBqdXN0IGNoYW5nZSB0aGUgSFRNTEVsZW1lbnRzIGZvciBkaXNwbGF5IGFuZCBjb250cm9sXHJcbiAgICogVGhpcyBtdXN0IGFsc28gc2V0IGFuIElEIHRvIHRoZSBIVE1MRWxlbWVudHMgdGhhdCBuZWVkIHRvIGJlIHVwZGF0ZWRcclxuICAgKi9cclxuICBjb21wdXRlU3RhdHVzKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBET00gb2YgdGhlIGRvY3VtZW50IHJlcGxhY2luZyB0aGUgb2xkIHZhbHVlcyB3aXRoIHRoZSBjdXJyZW50IG9uZXNcclxuICAgKiBNdXN0IGJlIGNhbGxlZCBldmVyeXRpbWUgdGhlIGNvbXBvbmVudCB3YW50cyB0byB1cGRhdGUgdGhlIHBhZ2UuXHJcbiAgICogSW50ZXJuYWxseSBjYWxscyBjb21wdXRlU3RhdHVzKCkgYXMgZmlyc3Qgc3RlcFxyXG4gICAqIEl0IGlzIG1hbmRhdG9yeSB0aGF0IHRoZSB0d28gZWxlbWVudHMgaGF2ZSBhbiBJRCBkZWZpbmVkLiBPdGhlcndpc2UgdGhleSB3aWxsIG5vdCBiZSB1cGRhdGVkXHJcbiAgICovXHJcbiAgdXBkYXRlRE9NKCkge1xyXG4gICAgdGhpcy5jb21wdXRlU3RhdHVzKCk7XHJcblxyXG4gICAgLy8gcmVkcmF3IHRoZSBVSSBqdXN0IHJlcGxhY2luZyB0aGUgZWxlbWVudHMgdGhhdCBoYXMgY2hhbmdlZFxyXG4gICAgaWYgKHRoaXMuc3RhdHVzQ3RybEVsICE9IG51bGwpIHtcclxuICAgICAgbGV0IGN1cnJlbnRTdGF0ZUN0cmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN0YXR1c0N0cmxFbC5pZCk7XHJcbiAgICAgIGlmIChjdXJyZW50U3RhdGVDdHJsICE9IG51bGwpXHJcbiAgICAgICAgY3VycmVudFN0YXRlQ3RybC5yZXBsYWNlV2l0aCh0aGlzLnN0YXR1c0N0cmxFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdHVzRWwgIT0gbnVsbCkge1xyXG4gICAgICBsZXQgY3VycmVudFN0YXR1c0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zdGF0dXNFbC5pZCk7XHJcbiAgICAgIGlmIChjdXJyZW50U3RhdHVzRWwgIT0gbnVsbCkgY3VycmVudFN0YXR1c0VsLnJlcGxhY2VXaXRoKHRoaXMuc3RhdHVzRWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tY29tcG9uZW50XCIsIENvbXBvbmVudCk7XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEN1cnRhaW4gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIGdyYWRlczogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLmdyYWRlcyA9IDA7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VHcmFkZXMoZGF0YSkge1xyXG4gICAgY29uc29sZS5kZWJ1ZyhcImlucHV0XCIsIGRhdGEpO1xyXG4gICAgdGhpcy5ncmFkZXMgPSBkYXRhLnRhcmdldC52YWx1ZTtcclxuICAgIHRoaXMudXBkYXRlRE9NKCk7XHJcbiAgfVxyXG5cclxuICAvLyBvdmVycmlkZSB3aXRoIHRoZSBzcGVjaWZpYyBiZWhhdmlvciBvZiBhIEN1cnRhaW5cclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgLy8gdGhlIHN0YXR1cyBjb250cm9sIGlzIGEgc2xpZGVyXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIGxldCBzbGlkZXJJbnB1dEVsID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgc2xpZGVySW5wdXRFbC50eXBlID0gXCJyYW5nZVwiO1xyXG4gICAgc2xpZGVySW5wdXRFbC5zdGVwID0gXCIxMFwiO1xyXG4gICAgc2xpZGVySW5wdXRFbC5taW4gPSBcIjBcIjtcclxuICAgIHNsaWRlcklucHV0RWwubWF4ID0gXCIxMDBcIjtcclxuICAgIHNsaWRlcklucHV0RWwudmFsdWUgPSBcIlwiICsgdGhpcy5ncmFkZXM7XHJcbiAgICBzbGlkZXJJbnB1dEVsLm9uY2hhbmdlID0gdiA9PiB0aGlzLmNoYW5nZUdyYWRlcyh2KTtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwiY3VydGFpbl9jdHJsX1wiICsgdGhpcy5pZDtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmFwcGVuZENoaWxkKHNsaWRlcklucHV0RWwpO1xyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImN1cnRhaW5fc3RhdHVzX1wiICsgdGhpcy5pZDtcclxuXHJcbiAgICAvLyB0aGlzLnN0YXR1c0VsLnN0eWxlLm1hcmdpblRvcCA9IFwiMHB4XCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmhlaWdodCA9IHRoaXMuZ3JhZGVzICsgXCIlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2M1YzVjNVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5hbGlnblNlbGYgPSBcInN0YXJ0XCI7XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1jdXJ0YWluXCIsIEN1cnRhaW4pO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEb29yIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBvcGVuZWQ6IGJvb2xlYW47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoaWQsIG5hbWUsIGRlc2NyaXB0aW9uKTtcclxuICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBjYWxsZWQgYnkgdGhlIGJ1dHRvbiB0byBjaGFuZ2UgdGhlIHN0YXRlXHJcbiAgdG9vZ2xlRG9vcigpIHtcclxuICAgIHRoaXMub3BlbmVkID0gIXRoaXMub3BlbmVkO1xyXG4gICAgdGhpcy51cGRhdGVET00oKTtcclxuICB9XHJcblxyXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgRG9vclxyXG4gIGNvbXB1dGVTdGF0dXMoKSB7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1CdXR0b24gc3BlY3RydW0tQnV0dG9uLS1jdGFcIjtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLm9uY2xpY2sgPSBldnQgPT4gdGhpcy50b29nbGVEb29yKCk7IC8vYXJyb3cgZnVuY3Rpb24ga2VlcCB0aGUgaW5zdGFuY2Ugc3RhdGVcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmlkID0gXCJkb29yX2N0cmxfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTFNwYW5FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwiZG9vcl9zdGF0dXNfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2VcIjtcclxuICAgIGlmICh0aGlzLm9wZW5lZCkge1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVyVGV4dCA9IFwiT1BFTkVEXCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lICs9IFwiIHNwZWN0cnVtLUxhYmVsLS1ibHVlXCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzQ3RybEVsLnRleHRDb250ZW50ID0gXCJDTE9TRVwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lclRleHQgPSBcIkNMT1NFRFwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSArPSBcIiBzcGVjdHJ1bS1MYWJlbC0tZ3JleVwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiT1BFTlwiO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tZG9vclwiLCBEb29yKTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlnaHQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIG9uOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLm9uID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBjYWxsZWQgYnkgdGhlIGJ1dHRvbiB0byBjaGFuZ2UgdGhlIHN0YXRlXHJcbiAgdG9vZ2xlTGlnaHQoKSB7XHJcbiAgICB0aGlzLm9uID0gIXRoaXMub247XHJcbiAgICB0aGlzLnVwZGF0ZURPTSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBMaWdodFxyXG4gIGNvbXB1dGVTdGF0dXMoKSB7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1CdXR0b24gc3BlY3RydW0tQnV0dG9uLS1jdGFcIjtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLm9uY2xpY2sgPSBldnQgPT4gdGhpcy50b29nbGVMaWdodCgpOyAvL2Fycm93IGZ1bmN0aW9uIGtlZXAgdGhlIGluc3RhbmNlIHN0YXRlXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwibGlnaHRfY3RybF9cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwibGlnaHRfc3RhdHVzX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgaWYgKHRoaXMub24pIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNmZmU2MmJcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lckhUTUwgPVxyXG4gICAgICAgIFwiPGxhYmVsIGNsYXNzPSdzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2UnPk9OPC9sYWJlbD5cIjtcclxuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIlRVUk4gT0ZGXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JleVwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVySFRNTCA9XHJcbiAgICAgICAgXCI8bGFiZWwgY2xhc3M9J3NwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZSc+T0ZGPC9sYWJlbD5cIjtcclxuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIlRVUk4gT05cIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWxpZ2h0XCIsIExpZ2h0KTtcclxuIiwiaW1wb3J0IHsgRG9vciB9IGZyb20gXCIuL2Rvb3JcIjtcclxuaW1wb3J0IHsgTGlnaHQgfSBmcm9tIFwiLi9saWdodFwiO1xyXG5pbXBvcnQgeyBDdXJ0YWluIH0gZnJvbSBcIi4vY3VydGFpblwiO1xyXG5pbXBvcnQgeyBDbGltYSB9IGZyb20gXCIuL2NsaW1hXCI7XHJcbmltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSBcIi4vbXljb21wb25lbnRcIjtcclxuXHJcbmZ1bmN0aW9uIHNob3dQYW5lbCgpIHtcclxuICBjb25zdCBjdXJ0YWluc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJ0YWluc1wiKTtcclxuICBjb25zdCBkb29yc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb29yc1wiKTtcclxuICBjb25zdCBsaWdodHNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlnaHRzXCIpO1xyXG4gIGNvbnN0IGNsaW1hRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsaW1hXCIpO1xyXG5cclxuICBkb29yc0VsLmFwcGVuZENoaWxkKFxyXG4gICAgbmV3IERvb3IoXCJkb29yMVwiLCBcIk1haW4gRG9vclwiLCBcIkVudHJhbmNlIGRvb3IsIGFsbGFybWVkXCIpXHJcbiAgKTtcclxuICBkb29yc0VsLmFwcGVuZENoaWxkKFxyXG4gICAgbmV3IERvb3IoXCJkb29yMlwiLCBcIkJhY2sgRG9vclwiLCBcIk11c3QgYmUgYWx3YXN5IGNsb3NlZCwgYWxsYXJtZWRcIilcclxuICApO1xyXG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXHJcbiAgICBuZXcgRG9vcihcImRvb3IzXCIsIFwiR2FyZGVuIERvb3JcIiwgXCJHYXJkZW4gZG9vciwgdGhpcyBpcyBub3QgYWxsYXJtZWRcIilcclxuICApO1xyXG5cclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDFcIiwgXCJLaXRjaGVuIGxpZ2h0XCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDJcIiwgXCJCZWRyb29tXCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDNcIiwgXCJMaXZpbmcgcm9vbVwiLCBcIlwiKSk7XHJcbiAgbGlnaHRzRWwuYXBwZW5kQ2hpbGQobmV3IExpZ2h0KFwibGlndGg1XCIsIFwiQ2hpbGRyZW4gcm9vbVwiLCBcIlwiKSk7XHJcbiAgbGlnaHRzRWwuYXBwZW5kQ2hpbGQobmV3IExpZ2h0KFwibGlndGg2XCIsIFwiT3V0ZG9vclwiLCBcIlwiKSk7XHJcblxyXG4gIGN1cnRhaW5zRWwuYXBwZW5kQ2hpbGQobmV3IEN1cnRhaW4oXCJjdXJ0YWluMVwiLCBcIkVudHJhbmNlXCIsIFwiSG9tZSBlbnRyYW5jZVwiKSk7XHJcbiAgY3VydGFpbnNFbC5hcHBlbmRDaGlsZChcclxuICAgIG5ldyBDdXJ0YWluKFwiY3VydGFpbjNcIiwgXCJMaXZpbmcgcm9vbVwiLCBcImxpdmluZyByb29tIGN1cnRhaW5cIilcclxuICApO1xyXG4gIGN1cnRhaW5zRWwuYXBwZW5kQ2hpbGQobmV3IEN1cnRhaW4oXCJjdXJ0YWluMlwiLCBcIk91dGRvb3JcIiwgXCJGcm9udCBnYXJkZW5cIikpO1xyXG5cclxuICBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBDbGltYShcImNsaW1hMFwiLCBcIktpdGNoZW5cIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xyXG4gIGNsaW1hRWwuYXBwZW5kQ2hpbGQobmV3IENsaW1hKFwiY2xpbWExXCIsIFwiUm9vbVwiLCBcIkF1dG9tYXRpYyB0ZW1wZXJhdHVyZVwiKSk7XHJcbiAgY2xpbWFFbC5hcHBlbmRDaGlsZChuZXcgQ2xpbWEoXCJjbGltYTJcIiwgXCJCYXRoXCIsIFwiQXV0b21hdGljIHRlbXBlcmF0dXJlXCIpKTtcclxuXHJcbiAgY2xpbWFFbC5hcHBlbmRDaGlsZChuZXcgTXlDb21wb25lbnQoXCJjb21wXCIsIFwibmFtZVwiLCBcIkF1dG9tYXRpYyB0ZW1wZXJhdHVyZVwiKSk7XHJcbn1cclxuXHJcbnNob3dQYW5lbCgpO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgc3RhdHVzOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoaWQsIG5hbWUsIGRlc2NyaXB0aW9uKTtcclxuICAgIHRoaXMuc3RhdHVzID0gMDtcclxuICB9XHJcblxyXG4gIGNsaWNrZWQoKSB7XHJcbiAgICB0aGlzLnN0YXR1cysrO1xyXG4gICAgdGhpcy51cGRhdGVET00oKTtcclxuICB9XHJcblxyXG4gIGNvbXB1dGVTdGF0dXMoKSB7XHJcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxTcGFuRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID0gXCI8aDE+XCIgKyB0aGlzLnN0YXR1cyArIFwiPC9oMT5cIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcInN0YXR1c19cIiArIHRoaXMuaWQ7XHJcblxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLm9uY2xpY2sgPSBldnQgPT4gdGhpcy5jbGlja2VkKCk7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiQ0xJQ0tcIjtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmlkID0gXCJjdHJsX1wiICsgdGhpcy5pZDtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLW15Y29tcG9uZW50XCIsIE15Q29tcG9uZW50KTtcclxuIl19
