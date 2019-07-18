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
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentState;
(function (ComponentState) {
    ComponentState[ComponentState["On"] = 0] = "On";
    ComponentState[ComponentState["Off"] = 1] = "Off";
    ComponentState[ComponentState["None"] = 2] = "None"; //means does not apply
})(ComponentState = exports.ComponentState || (exports.ComponentState = {}));
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
     * This must also set an ID to the HTMLElements that needs to be updated
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
//import { MyComponent } from "./mycomponent";
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
    //climaEl.appendChild(new MyComponent("comp", "name", "Automatic temperature"));
}
showPanel();
},{"./clima":1,"./curtain":3,"./door":4,"./light":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2xpbWEudHMiLCJzcmMvY29tcG9uZW50LnRzIiwic3JjL2N1cnRhaW4udHMiLCJzcmMvZG9vci50cyIsInNyYy9saWdodC50cyIsInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSwyQ0FBd0M7QUFFeEMsTUFBYSxLQUFNLFNBQVEscUJBQVM7SUFHbEMsWUFBWSxFQUFVLEVBQUUsSUFBWSxFQUFFLFdBQW1CO1FBQ3ZELEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtDQUErQztRQUM1RixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQzFELENBQUM7Q0FDRjtBQWpCRCxzQkFpQkM7QUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7OztBQ3JCeEQsSUFBWSxj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QUFDLFdBQVcsQ0FBQyxJQUFJLGFBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQztJQUMxRSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksYUFBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0lBRTFFLGdGQUFnRjtBQUNsRixDQUFDO0FBRUQsU0FBUyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGltYSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgdGVtcDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLnRlbXAgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMzUgLSAxMCkgKyAxMCk7XHJcbiAgfVxyXG5cclxuICAvLyBvdmVycmlkZSB3aXRoIHRoZSBzcGVjaWZpYyBiZWhhdmlvciBvZiBhIENsaW1hXHJcbiAgY29tcHV0ZVN0YXR1cygpIHtcclxuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTFNwYW5FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwiZG9vcl9zdGF0dXNfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5mb250U2l6ZSA9IFwiMi44ZW1cIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuY29sb3IgPSBcIiM2NjY2NjZcIjtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsLmlubmVySFRNTCA9IFwiPGgxPlwiICsgdGhpcy50ZW1wICsgXCLCsDwvaDE+XCI7XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1jbGltYVwiLCBDbGltYSk7XHJcbiIsImV4cG9ydCBlbnVtIENvbXBvbmVudFN0YXRlIHtcclxuICBPbiA9IDAsXHJcbiAgT2ZmID0gMSxcclxuICBOb25lID0gMiAvL21lYW5zIGRvZXMgbm90IGFwcGx5XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCYXNpYyBBdXRvbWF0aW9uIENvbXBvbmVudC4gRHJhdyBpdHNlbGYgYXMgYSBTcGVjdHJ1bSBjYXJkXHJcbiAqIERlZmluZXMgc29tZSBleHRlbnNpb24gcG9pbnRzIHdoZXJlIHRvIGhvb2sgdG8gbWFuYWdlIHRoZSBjb21wb25lbnQgc3RhdHVzXHJcbiAqL1xyXG5cclxuLypcclxuIEhUTUwgY3JlYXRlZCBieSB0aGlzIGVsZW1lbnRcclxuIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkXCIgc3R5bGU9XCJ3aWR0aDogMjA4cHg7XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1jb3ZlclBob3RvXCI+XHJcbiAgICAgIENPVkVSXHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWJvZHlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtdGl0bGVcIj5Db21wb25lbnROYW1lPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1zdWJ0aXRsZVwiPmRlc2NyaXB0aW9uPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWZvb3RlclwiPlxyXG4gICAgICAgIEZPT1RFUlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbiAgaWQ6IHN0cmluZztcclxuXHJcbiAgc3RhdHVzQ3RybEVsOiBIVE1MRWxlbWVudDtcclxuICBzdGF0dXNFbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhc2UgY29tcG9uZW50LCBnZW5lcmljIGNsYXNzIHRvIHVzZSBhcyBwYXJlbnQuXHJcbiAgICogRWFjaCBkZXJpdmVkIGNvbXBvbmVudCBzaG91bGQgZGVmaW5lIGl0cyBzdGF0dXMgcmVwcmVzZW50YXRpb24gYW5kIHN0YXR1cyBjb250cm9sIGVsZW1lbnRzXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmFtZSBkaXNwbGF5IG5hbWVcclxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gZGVzY3JpcHRpb24gb2YgdGhlIGNvbXBvbmVudFxyXG4gICAqIEBwYXJhbSBpZCBtdXN0IGJlIHVuaXF1ZSBpbiB0aGUgRE9NXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgaWYgKGlkID09IG51bGwgfHwgaWQubGVuZ3RoID09IDApIHRocm93IFwiaW52YWxpZCBpZFwiO1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICB9XHJcblxyXG4gIC8vIGNhbGxlZCB3aGVuIGFkZGVkIHRvIHRoZSBET00gLSB0aGUgZmlyc3QgdGltZVxyXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmdldFRlbXBsYXRlKCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVtcGxhdGUoKSB7XHJcbiAgICAvLyBkcmF3IGEgYmFzaWMgU3BlY3RydW0gQ2FyZFxyXG5cclxuICAgIGxldCBjYXJkRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjYXJkRGl2LnN0eWxlLndpZHRoID0gXCIyMDhweFwiO1xyXG4gICAgY2FyZERpdi5zdHlsZS5tYXJnaW4gPSBcIjI1cHggMjVweFwiO1xyXG4gICAgY2FyZERpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmRcIjtcclxuXHJcbiAgICBsZXQgY292ZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvdmVyRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1jb3ZlclBob3RvXCI7XHJcbiAgICBjb3ZlckRpdi5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcclxuICAgIGxldCBzdGF0dXNFbGVtZW50ID0gdGhpcy5nZXRTdGF0dXNFbGVtZW50KCk7XHJcbiAgICBpZiAoc3RhdHVzRWxlbWVudCAhPSBudWxsKSBjb3ZlckRpdi5hcHBlbmRDaGlsZChzdGF0dXNFbGVtZW50KTtcclxuXHJcbiAgICBsZXQgYm9keURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgYm9keURpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtYm9keVwiO1xyXG5cclxuICAgIGxldCBoZWFkZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGhlYWRlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtaGVhZGVyXCI7XHJcblxyXG4gICAgbGV0IHRpdGxlRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aXRsZURpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtdGl0bGVcIjtcclxuICAgIHRpdGxlRGl2LmlubmVyVGV4dCA9IHRoaXMubmFtZTtcclxuXHJcbiAgICBsZXQgY29udGVudERpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29udGVudERpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtY29udGVudFwiO1xyXG5cclxuICAgIGxldCBzdWJ0aXRsZURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgc3VidGl0bGVEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLXN1YnRpdGxlXCI7XHJcbiAgICBzdWJ0aXRsZURpdi5pbm5lclRleHQgPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgIGxldCBmb290ZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGZvb3RlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtZm9vdGVyXCI7XHJcblxyXG4gICAgbGV0IHN0YXR1c0NvbnRyb2xFbGVtZW50ID0gdGhpcy5nZXRTdGF0dXNDb250cm9sRWxlbWVudCgpO1xyXG4gICAgaWYgKHN0YXR1c0NvbnRyb2xFbGVtZW50ICE9IG51bGwpXHJcbiAgICAgIGZvb3RlckRpdi5hcHBlbmRDaGlsZChzdGF0dXNDb250cm9sRWxlbWVudCk7XHJcblxyXG4gICAgY29udGVudERpdi5hcHBlbmRDaGlsZChzdWJ0aXRsZURpdik7XHJcbiAgICBoZWFkZXJEaXYuYXBwZW5kQ2hpbGQodGl0bGVEaXYpO1xyXG4gICAgYm9keURpdi5hcHBlbmRDaGlsZChoZWFkZXJEaXYpO1xyXG4gICAgYm9keURpdi5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcclxuXHJcbiAgICBjYXJkRGl2LmFwcGVuZENoaWxkKGNvdmVyRGl2KTtcclxuICAgIGNhcmREaXYuYXBwZW5kQ2hpbGQoYm9keURpdik7XHJcbiAgICBjYXJkRGl2LmFwcGVuZENoaWxkKGZvb3RlckRpdik7XHJcblxyXG4gICAgcmV0dXJuIGNhcmREaXY7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmUgdGhlIGNvbnRyb2wgdG8gdXNlIHRvIGNoYW5nZSB0aGUgY29tcG9uZW50IHN0YXR1cyAoYnV0dG9uL3NsaWRlci9jaGVja2JveC4uLilcclxuICAgKiBNdXN0IGJlIGRlZmluZWQgaW4gdGhlIGRlcml2ZWQgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U3RhdHVzQ29udHJvbEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzQ3RybEVsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIHRoZSBVSSB0byBkaXNwbGF5IHRoZSBzdGF0dXMgb2YgdGhlIGNvbXBvbmVudCBzdGF0dXMgKGltYWdlL2xhYmVsLy4uLilcclxuICAgKiBNdXN0IGJlIGRlZmluZWQgaW4gdGhlIGRlcml2ZWQgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U3RhdHVzRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XHJcbiAgICB0aGlzLmNvbXB1dGVTdGF0dXMoKTtcclxuICAgIHJldHVybiB0aGlzLnN0YXR1c0VsO1xyXG4gIH1cclxuXHJcbiAgLyoqIENvbXB1dGUgdGhlIHN0YXR1cyBvZiB0aGlzIGNvbXBvbmVudFxyXG4gICAqIFRoaXMgbXVzdCBiZSBvdmVycmlkZGVuIGluIGEgZGVyaXZlZCBjbGFzc1xyXG4gICAqIFRoaXMgc2hvdWxkIGp1c3QgY2hhbmdlIHRoZSBIVE1MRWxlbWVudHMgZm9yIGRpc3BsYXkgYW5kIGNvbnRyb2xcclxuICAgKiBUaGlzIG11c3QgYWxzbyBzZXQgYW4gSUQgdG8gdGhlIEhUTUxFbGVtZW50cyB0aGF0IG5lZWRzIHRvIGJlIHVwZGF0ZWRcclxuICAgKi9cclxuICBjb21wdXRlU3RhdHVzKCkge31cclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHRoZSBET00gb2YgdGhlIGRvY3VtZW50IHJlcGxhY2luZyB0aGUgb2xkIHZhbHVlcyB3aXRoIHRoZSBjdXJyZW50IG9uZXNcclxuICAgKiBNdXN0IGJlIGNhbGxlZCBldmVyeXRpbWUgdGhlIGNvbXBvbmVudCB3YW50cyB0byB1cGRhdGUgdGhlIHBhZ2UuXHJcbiAgICogSW50ZXJuYWxseSBjYWxscyBjb21wdXRlU3RhdHVzKCkgYXMgZmlyc3Qgc3RlcFxyXG4gICAqIEl0IGlzIG1hbmRhdG9yeSB0aGF0IHRoZSB0d28gZWxlbWVudHMgaGF2ZSBhbiBJRCBkZWZpbmVkLiBPdGhlcndpc2UgdGhleSB3aWxsIG5vdCBiZSB1cGRhdGVkXHJcbiAgICovXHJcbiAgdXBkYXRlRE9NKCkge1xyXG4gICAgdGhpcy5jb21wdXRlU3RhdHVzKCk7XHJcblxyXG4gICAgLy8gcmVkcmF3IHRoZSBVSSBqdXN0IHJlcGxhY2luZyB0aGUgZWxlbWVudHMgdGhhdCBoYXMgY2hhbmdlZFxyXG4gICAgaWYgKHRoaXMuc3RhdHVzQ3RybEVsICE9IG51bGwpIHtcclxuICAgICAgbGV0IGN1cnJlbnRTdGF0ZUN0cmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN0YXR1c0N0cmxFbC5pZCk7XHJcbiAgICAgIGlmIChjdXJyZW50U3RhdGVDdHJsICE9IG51bGwpXHJcbiAgICAgICAgY3VycmVudFN0YXRlQ3RybC5yZXBsYWNlV2l0aCh0aGlzLnN0YXR1c0N0cmxFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdHVzRWwgIT0gbnVsbCkge1xyXG4gICAgICBsZXQgY3VycmVudFN0YXR1c0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zdGF0dXNFbC5pZCk7XHJcbiAgICAgIGlmIChjdXJyZW50U3RhdHVzRWwgIT0gbnVsbCkgY3VycmVudFN0YXR1c0VsLnJlcGxhY2VXaXRoKHRoaXMuc3RhdHVzRWwpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tY29tcG9uZW50XCIsIENvbXBvbmVudCk7XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEN1cnRhaW4gZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIGdyYWRlczogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLmdyYWRlcyA9IDA7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VHcmFkZXMoZGF0YSkge1xyXG4gICAgY29uc29sZS5kZWJ1ZyhcImlucHV0XCIsIGRhdGEpO1xyXG4gICAgdGhpcy5ncmFkZXMgPSBkYXRhLnRhcmdldC52YWx1ZTtcclxuICAgIHRoaXMudXBkYXRlRE9NKCk7XHJcbiAgfVxyXG5cclxuICAvLyBvdmVycmlkZSB3aXRoIHRoZSBzcGVjaWZpYyBiZWhhdmlvciBvZiBhIEN1cnRhaW5cclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgLy8gdGhlIHN0YXR1cyBjb250cm9sIGlzIGEgc2xpZGVyXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIGxldCBzbGlkZXJJbnB1dEVsID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgc2xpZGVySW5wdXRFbC50eXBlID0gXCJyYW5nZVwiO1xyXG4gICAgc2xpZGVySW5wdXRFbC5zdGVwID0gXCIxMFwiO1xyXG4gICAgc2xpZGVySW5wdXRFbC5taW4gPSBcIjBcIjtcclxuICAgIHNsaWRlcklucHV0RWwubWF4ID0gXCIxMDBcIjtcclxuICAgIHNsaWRlcklucHV0RWwudmFsdWUgPSBcIlwiICsgdGhpcy5ncmFkZXM7XHJcbiAgICBzbGlkZXJJbnB1dEVsLm9uY2hhbmdlID0gdiA9PiB0aGlzLmNoYW5nZUdyYWRlcyh2KTtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwiY3VydGFpbl9jdHJsX1wiICsgdGhpcy5pZDtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmFwcGVuZENoaWxkKHNsaWRlcklucHV0RWwpO1xyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImN1cnRhaW5fc3RhdHVzX1wiICsgdGhpcy5pZDtcclxuXHJcbiAgICAvLyB0aGlzLnN0YXR1c0VsLnN0eWxlLm1hcmdpblRvcCA9IFwiMHB4XCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmhlaWdodCA9IHRoaXMuZ3JhZGVzICsgXCIlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2M1YzVjNVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5hbGlnblNlbGYgPSBcInN0YXJ0XCI7XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1jdXJ0YWluXCIsIEN1cnRhaW4pO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEb29yIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBvcGVuZWQ6IGJvb2xlYW47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoaWQsIG5hbWUsIGRlc2NyaXB0aW9uKTtcclxuICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBjYWxsZWQgYnkgdGhlIGJ1dHRvbiB0byBjaGFuZ2UgdGhlIHN0YXRlXHJcbiAgdG9vZ2xlRG9vcigpIHtcclxuICAgIHRoaXMub3BlbmVkID0gIXRoaXMub3BlbmVkO1xyXG4gICAgdGhpcy51cGRhdGVET00oKTtcclxuICB9XHJcblxyXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgRG9vclxyXG4gIGNvbXB1dGVTdGF0dXMoKSB7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1CdXR0b24gc3BlY3RydW0tQnV0dG9uLS1jdGFcIjtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLm9uY2xpY2sgPSBldnQgPT4gdGhpcy50b29nbGVEb29yKCk7IC8vYXJyb3cgZnVuY3Rpb24ga2VlcCB0aGUgaW5zdGFuY2Ugc3RhdGVcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmlkID0gXCJkb29yX2N0cmxfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTFNwYW5FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwiZG9vcl9zdGF0dXNfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2VcIjtcclxuICAgIGlmICh0aGlzLm9wZW5lZCkge1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVyVGV4dCA9IFwiT1BFTkVEXCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lICs9IFwiIHNwZWN0cnVtLUxhYmVsLS1ibHVlXCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzQ3RybEVsLnRleHRDb250ZW50ID0gXCJDTE9TRVwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lclRleHQgPSBcIkNMT1NFRFwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSArPSBcIiBzcGVjdHJ1bS1MYWJlbC0tZ3JleVwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiT1BFTlwiO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tZG9vclwiLCBEb29yKTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlnaHQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIG9uOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLm9uID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBjYWxsZWQgYnkgdGhlIGJ1dHRvbiB0byBjaGFuZ2UgdGhlIHN0YXRlXHJcbiAgdG9vZ2xlTGlnaHQoKSB7XHJcbiAgICB0aGlzLm9uID0gIXRoaXMub247XHJcbiAgICB0aGlzLnVwZGF0ZURPTSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBMaWdodFxyXG4gIGNvbXB1dGVTdGF0dXMoKSB7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1CdXR0b24gc3BlY3RydW0tQnV0dG9uLS1jdGFcIjtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLm9uY2xpY2sgPSBldnQgPT4gdGhpcy50b29nbGVMaWdodCgpOyAvL2Fycm93IGZ1bmN0aW9uIGtlZXAgdGhlIGluc3RhbmNlIHN0YXRlXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwibGlnaHRfY3RybF9cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwibGlnaHRfc3RhdHVzX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgaWYgKHRoaXMub24pIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNmZmU2MmJcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lckhUTUwgPVxyXG4gICAgICAgIFwiPGxhYmVsIGNsYXNzPSdzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2UnPk9OPC9sYWJlbD5cIjtcclxuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIlRVUk4gT0ZGXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JleVwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVySFRNTCA9XHJcbiAgICAgICAgXCI8bGFiZWwgY2xhc3M9J3NwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZSc+T0ZGPC9sYWJlbD5cIjtcclxuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIlRVUk4gT05cIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWxpZ2h0XCIsIExpZ2h0KTtcclxuIiwiaW1wb3J0IHsgRG9vciB9IGZyb20gXCIuL2Rvb3JcIjtcclxuaW1wb3J0IHsgTGlnaHQgfSBmcm9tIFwiLi9saWdodFwiO1xyXG5pbXBvcnQgeyBDdXJ0YWluIH0gZnJvbSBcIi4vY3VydGFpblwiO1xyXG5pbXBvcnQgeyBDbGltYSB9IGZyb20gXCIuL2NsaW1hXCI7XHJcbi8vaW1wb3J0IHsgTXlDb21wb25lbnQgfSBmcm9tIFwiLi9teWNvbXBvbmVudFwiO1xyXG5cclxuZnVuY3Rpb24gc2hvd1BhbmVsKCkge1xyXG4gIGNvbnN0IGN1cnRhaW5zRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnRhaW5zXCIpO1xyXG4gIGNvbnN0IGRvb3JzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvb3JzXCIpO1xyXG4gIGNvbnN0IGxpZ2h0c0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaWdodHNcIik7XHJcbiAgY29uc3QgY2xpbWFFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xpbWFcIik7XHJcblxyXG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXHJcbiAgICBuZXcgRG9vcihcImRvb3IxXCIsIFwiTWFpbiBEb29yXCIsIFwiRW50cmFuY2UgZG9vciwgYWxsYXJtZWRcIilcclxuICApO1xyXG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXHJcbiAgICBuZXcgRG9vcihcImRvb3IyXCIsIFwiQmFjayBEb29yXCIsIFwiTXVzdCBiZSBhbHdhc3kgY2xvc2VkLCBhbGxhcm1lZFwiKVxyXG4gICk7XHJcbiAgZG9vcnNFbC5hcHBlbmRDaGlsZChcclxuICAgIG5ldyBEb29yKFwiZG9vcjNcIiwgXCJHYXJkZW4gRG9vclwiLCBcIkdhcmRlbiBkb29yLCB0aGlzIGlzIG5vdCBhbGxhcm1lZFwiKVxyXG4gICk7XHJcblxyXG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoMVwiLCBcIktpdGNoZW4gbGlnaHRcIiwgXCJcIikpO1xyXG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoMlwiLCBcIkJlZHJvb21cIiwgXCJcIikpO1xyXG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoM1wiLCBcIkxpdmluZyByb29tXCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDVcIiwgXCJDaGlsZHJlbiByb29tXCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDZcIiwgXCJPdXRkb29yXCIsIFwiXCIpKTtcclxuXHJcbiAgY3VydGFpbnNFbC5hcHBlbmRDaGlsZChuZXcgQ3VydGFpbihcImN1cnRhaW4xXCIsIFwiRW50cmFuY2VcIiwgXCJIb21lIGVudHJhbmNlXCIpKTtcclxuICBjdXJ0YWluc0VsLmFwcGVuZENoaWxkKFxyXG4gICAgbmV3IEN1cnRhaW4oXCJjdXJ0YWluM1wiLCBcIkxpdmluZyByb29tXCIsIFwibGl2aW5nIHJvb20gY3VydGFpblwiKVxyXG4gICk7XHJcbiAgY3VydGFpbnNFbC5hcHBlbmRDaGlsZChuZXcgQ3VydGFpbihcImN1cnRhaW4yXCIsIFwiT3V0ZG9vclwiLCBcIkZyb250IGdhcmRlblwiKSk7XHJcblxyXG4gIGNsaW1hRWwuYXBwZW5kQ2hpbGQobmV3IENsaW1hKFwiY2xpbWEwXCIsIFwiS2l0Y2hlblwiLCBcIkF1dG9tYXRpYyB0ZW1wZXJhdHVyZVwiKSk7XHJcbiAgY2xpbWFFbC5hcHBlbmRDaGlsZChuZXcgQ2xpbWEoXCJjbGltYTFcIiwgXCJSb29tXCIsIFwiQXV0b21hdGljIHRlbXBlcmF0dXJlXCIpKTtcclxuICBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBDbGltYShcImNsaW1hMlwiLCBcIkJhdGhcIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xyXG5cclxuICAvL2NsaW1hRWwuYXBwZW5kQ2hpbGQobmV3IE15Q29tcG9uZW50KFwiY29tcFwiLCBcIm5hbWVcIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xyXG59XHJcblxyXG5zaG93UGFuZWwoKTtcclxuIl19
