(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class Clima extends component_1.Component {
    constructor(id, name, description) {
        super(id, name, description);
        this.temperature = Math.floor(Math.random() * (30 - 10) + 10);
    }
    changeTemperature(diff) {
        this.temperature = this.temperature + diff;
        this.updateDOM();
    }
    // override with the specific behavior of a Clima
    computeStatus() {
        this.statusEl = document.createElement("span");
        this.statusEl.id = "door_status_" + this.id; //to be able to retrieve them from the document
        this.statusEl.style.fontSize = "2.8em";
        this.statusEl.style.color = "#666666";
        this.statusEl.innerHTML = "<h1>" + this.temperature + "°</h1>";
        this.statusCtrlEl = document.createElement("div");
        this.statusCtrlEl.id = "clima_ctrl_" + this.id;
        let plusEl = document.createElement("button");
        plusEl.className = "spectrum-Button spectrum-Button--cta";
        plusEl.onclick = evt => this.changeTemperature(1);
        plusEl.textContent = "+";
        let minusEl = document.createElement("button");
        minusEl.className = "spectrum-Button spectrum-Button";
        minusEl.onclick = evt => this.changeTemperature(-1);
        minusEl.textContent = "-";
        this.statusCtrlEl.appendChild(plusEl);
        this.statusCtrlEl.appendChild(minusEl);
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
// import { MyComponent } from "./mycomponent";
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
    // climaEl.appendChild(new MyComponent("comp", "name", "Automatic temperature"));
}
showPanel();
},{"./clima":1,"./curtain":3,"./door":4,"./light":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2xpbWEudHMiLCJzcmMvY29tcG9uZW50LnRzIiwic3JjL2N1cnRhaW4udHMiLCJzcmMvZG9vci50cyIsInNyYy9saWdodC50cyIsInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSwyQ0FBd0M7QUFFeEMsTUFBYSxLQUFNLFNBQVEscUJBQVM7SUFHbEMsWUFBWSxFQUFVLEVBQUUsSUFBWSxFQUFFLFdBQW1CO1FBQ3ZELEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELGlCQUFpQixDQUFDLElBQVk7UUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUMzQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtDQUErQztRQUM1RixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEdB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cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDbGltYSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgdGVtcGVyYXR1cmU6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgzMCAtIDEwKSArIDEwKTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVRlbXBlcmF0dXJlKGRpZmY6IG51bWJlcikge1xyXG4gICAgdGhpcy50ZW1wZXJhdHVyZSA9IHRoaXMudGVtcGVyYXR1cmUgKyBkaWZmO1xyXG4gICAgdGhpcy51cGRhdGVET00oKTtcclxuICB9XHJcblxyXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgQ2xpbWFcclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MU3BhbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJkb29yX3N0YXR1c19cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmZvbnRTaXplID0gXCIyLjhlbVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5jb2xvciA9IFwiIzY2NjY2NlwiO1xyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID0gXCI8aDE+XCIgKyB0aGlzLnRlbXBlcmF0dXJlICsgXCLCsDwvaDE+XCI7XHJcblxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmlkID0gXCJjbGltYV9jdHJsX1wiICsgdGhpcy5pZDtcclxuXHJcbiAgICBsZXQgcGx1c0VsID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICBwbHVzRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1CdXR0b24gc3BlY3RydW0tQnV0dG9uLS1jdGFcIjtcclxuICAgIHBsdXNFbC5vbmNsaWNrID0gZXZ0ID0+IHRoaXMuY2hhbmdlVGVtcGVyYXR1cmUoMSk7XHJcbiAgICBwbHVzRWwudGV4dENvbnRlbnQgPSBcIitcIjtcclxuXHJcbiAgICBsZXQgbWludXNFbCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgbWludXNFbC5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUJ1dHRvbiBzcGVjdHJ1bS1CdXR0b25cIjtcclxuICAgIG1pbnVzRWwub25jbGljayA9IGV2dCA9PiB0aGlzLmNoYW5nZVRlbXBlcmF0dXJlKC0xKTtcclxuICAgIG1pbnVzRWwudGV4dENvbnRlbnQgPSBcIi1cIjtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5hcHBlbmRDaGlsZChwbHVzRWwpO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuYXBwZW5kQ2hpbGQobWludXNFbCk7XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1jbGltYVwiLCBDbGltYSk7XHJcbiIsIi8qKlxyXG4gKiBCYXNpYyBBdXRvbWF0aW9uIENvbXBvbmVudC4gRHJhdyBpdHNlbGYgYXMgYSBTcGVjdHJ1bSBjYXJkXHJcbiAqIERlZmluZXMgc29tZSBleHRlbnNpb24gcG9pbnRzIHdoZXJlIHRvIGhvb2sgdG8gbWFuYWdlIHRoZSBjb21wb25lbnQgc3RhdHVzXHJcbiAqL1xyXG5cclxuLypcclxuIEhUTUwgY3JlYXRlZCBieSB0aGlzIGVsZW1lbnQ6XHJcblxyXG4gPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmRcIiBzdHlsZT1cIndpZHRoOiAyMDhweDtcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWNvdmVyUGhvdG9cIj5cclxuICAgICAgU1RBVFVTXHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWJvZHlcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtdGl0bGVcIj5Db21wb25lbnROYW1lPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtY29udGVudFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1zdWJ0aXRsZVwiPmRlc2NyaXB0aW9uPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWZvb3RlclwiPlxyXG4gICAgICAgIFNUQVRVUyBDT05UUk9MXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBpZDogc3RyaW5nO1xyXG5cclxuICBzdGF0dXNDdHJsRWw6IEhUTUxFbGVtZW50O1xyXG4gIHN0YXR1c0VsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgLyoqXHJcbiAgICogQmFzZSBjb21wb25lbnQsIGdlbmVyaWMgY2xhc3MgdG8gdXNlIGFzIHBhcmVudC5cclxuICAgKiBFYWNoIGRlcml2ZWQgY29tcG9uZW50IHNob3VsZCBkZWZpbmUgaXRzIHN0YXR1cyByZXByZXNlbnRhdGlvbiBhbmQgc3RhdHVzIGNvbnRyb2wgZWxlbWVudHNcclxuICAgKlxyXG4gICAqIEBwYXJhbSBuYW1lIGRpc3BsYXkgbmFtZVxyXG4gICAqIEBwYXJhbSBkZXNjcmlwdGlvbiBkZXNjcmlwdGlvbiBvZiB0aGUgY29tcG9uZW50XHJcbiAgICogQHBhcmFtIGlkIG11c3QgYmUgdW5pcXVlIGluIHRoZSBET01cclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZC5sZW5ndGggPT0gMCkgdGhyb3cgXCJpbnZhbGlkIGlkXCI7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gIH1cclxuXHJcbiAgLy8gY2FsbGVkIHdoZW4gYWRkZWQgdG8gdGhlIERPTSAtIHRoZSBmaXJzdCB0aW1lXHJcbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XHJcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuZ2V0VGVtcGxhdGUoKSk7XHJcbiAgfVxyXG5cclxuICBnZXRUZW1wbGF0ZSgpIHtcclxuICAgIC8vIGRyYXcgYSBiYXNpYyBTcGVjdHJ1bSBDYXJkXHJcblxyXG4gICAgbGV0IGNhcmREaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNhcmREaXYuc3R5bGUud2lkdGggPSBcIjIwOHB4XCI7XHJcbiAgICBjYXJkRGl2LnN0eWxlLm1hcmdpbiA9IFwiMjVweCAyNXB4XCI7XHJcbiAgICBjYXJkRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZFwiO1xyXG5cclxuICAgIGxldCBjb3ZlckRpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY292ZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWNvdmVyUGhvdG9cIjtcclxuICAgIGNvdmVyRGl2LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xyXG4gICAgbGV0IHN0YXR1c0VsZW1lbnQgPSB0aGlzLmdldFN0YXR1c0VsZW1lbnQoKTtcclxuICAgIGlmIChzdGF0dXNFbGVtZW50ICE9IG51bGwpIGNvdmVyRGl2LmFwcGVuZENoaWxkKHN0YXR1c0VsZW1lbnQpO1xyXG5cclxuICAgIGxldCBib2R5RGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBib2R5RGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1ib2R5XCI7XHJcblxyXG4gICAgbGV0IGhlYWRlckRpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgaGVhZGVyRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1oZWFkZXJcIjtcclxuXHJcbiAgICBsZXQgdGl0bGVEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRpdGxlRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC10aXRsZVwiO1xyXG4gICAgdGl0bGVEaXYuaW5uZXJUZXh0ID0gdGhpcy5uYW1lO1xyXG5cclxuICAgIGxldCBjb250ZW50RGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjb250ZW50RGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1jb250ZW50XCI7XHJcblxyXG4gICAgbGV0IHN1YnRpdGxlRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBzdWJ0aXRsZURpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtc3VidGl0bGVcIjtcclxuICAgIHN1YnRpdGxlRGl2LmlubmVyVGV4dCA9IHRoaXMuZGVzY3JpcHRpb247XHJcblxyXG4gICAgbGV0IGZvb3RlckRpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZm9vdGVyRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1mb290ZXJcIjtcclxuXHJcbiAgICBsZXQgc3RhdHVzQ29udHJvbEVsZW1lbnQgPSB0aGlzLmdldFN0YXR1c0NvbnRyb2xFbGVtZW50KCk7XHJcbiAgICBpZiAoc3RhdHVzQ29udHJvbEVsZW1lbnQgIT0gbnVsbClcclxuICAgICAgZm9vdGVyRGl2LmFwcGVuZENoaWxkKHN0YXR1c0NvbnRyb2xFbGVtZW50KTtcclxuXHJcbiAgICBjb250ZW50RGl2LmFwcGVuZENoaWxkKHN1YnRpdGxlRGl2KTtcclxuICAgIGhlYWRlckRpdi5hcHBlbmRDaGlsZCh0aXRsZURpdik7XHJcbiAgICBib2R5RGl2LmFwcGVuZENoaWxkKGhlYWRlckRpdik7XHJcbiAgICBib2R5RGl2LmFwcGVuZENoaWxkKGNvbnRlbnREaXYpO1xyXG5cclxuICAgIGNhcmREaXYuYXBwZW5kQ2hpbGQoY292ZXJEaXYpO1xyXG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChib2R5RGl2KTtcclxuICAgIGNhcmREaXYuYXBwZW5kQ2hpbGQoZm9vdGVyRGl2KTtcclxuXHJcbiAgICByZXR1cm4gY2FyZERpdjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlZmluZSB0aGUgY29udHJvbCB0byB1c2UgdG8gY2hhbmdlIHRoZSBjb21wb25lbnQgc3RhdHVzIChidXR0b24vc2xpZGVyL2NoZWNrYm94Li4uKVxyXG4gICAqIE11c3QgYmUgZGVmaW5lZCBpbiB0aGUgZGVyaXZlZCBjb21wb25lbnRcclxuICAgKi9cclxuICBnZXRTdGF0dXNDb250cm9sRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XHJcbiAgICB0aGlzLmNvbXB1dGVTdGF0dXMoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdGF0dXNDdHJsRWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZWZpbmUgdGhlIFVJIHRvIGRpc3BsYXkgdGhlIHN0YXR1cyBvZiB0aGUgY29tcG9uZW50IHN0YXR1cyAoaW1hZ2UvbGFiZWwvLi4uKVxyXG4gICAqIE11c3QgYmUgZGVmaW5lZCBpbiB0aGUgZGVyaXZlZCBjb21wb25lbnRcclxuICAgKi9cclxuICBnZXRTdGF0dXNFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHRoaXMuY29tcHV0ZVN0YXR1cygpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnN0YXR1c0VsO1xyXG4gIH1cclxuXHJcbiAgLyoqIENvbXB1dGUgdGhlIHN0YXR1cyBvZiB0aGlzIGNvbXBvbmVudFxyXG4gICAqIFRoaXMgbXVzdCBiZSBvdmVycmlkZGVuIGluIGEgZGVyaXZlZCBjbGFzc1xyXG4gICAqIFRoaXMgc2hvdWxkIGp1c3QgY2hhbmdlIHRoZSBIVE1MRWxlbWVudHMgZm9yIGRpc3BsYXkgYW5kIGNvbnRyb2xcclxuICAgKiBUaGlzIG11c3QgYWxzbyBzZXQgYW4gSUQgdG8gdGhlIEhUTUxFbGVtZW50cyB0aGF0IG5lZWQgdG8gYmUgdXBkYXRlZFxyXG4gICAqL1xyXG4gIGNvbXB1dGVTdGF0dXMoKSB7fVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdGhlIERPTSBvZiB0aGUgZG9jdW1lbnQgcmVwbGFjaW5nIHRoZSBvbGQgdmFsdWVzIHdpdGggdGhlIGN1cnJlbnQgb25lc1xyXG4gICAqIE11c3QgYmUgY2FsbGVkIGV2ZXJ5dGltZSB0aGUgY29tcG9uZW50IHdhbnRzIHRvIHVwZGF0ZSB0aGUgcGFnZS5cclxuICAgKiBJbnRlcm5hbGx5IGNhbGxzIGNvbXB1dGVTdGF0dXMoKSBhcyBmaXJzdCBzdGVwXHJcbiAgICogSXQgaXMgbWFuZGF0b3J5IHRoYXQgdGhlIHR3byBlbGVtZW50cyBoYXZlIGFuIElEIGRlZmluZWQuIE90aGVyd2lzZSB0aGV5IHdpbGwgbm90IGJlIHVwZGF0ZWRcclxuICAgKi9cclxuICB1cGRhdGVET00oKSB7XHJcbiAgICB0aGlzLmNvbXB1dGVTdGF0dXMoKTtcclxuXHJcbiAgICAvLyByZWRyYXcgdGhlIFVJIGp1c3QgcmVwbGFjaW5nIHRoZSBlbGVtZW50cyB0aGF0IGhhcyBjaGFuZ2VkXHJcbiAgICBpZiAodGhpcy5zdGF0dXNDdHJsRWwgIT0gbnVsbCkge1xyXG4gICAgICBsZXQgY3VycmVudFN0YXRlQ3RybCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc3RhdHVzQ3RybEVsLmlkKTtcclxuICAgICAgaWYgKGN1cnJlbnRTdGF0ZUN0cmwgIT0gbnVsbClcclxuICAgICAgICBjdXJyZW50U3RhdGVDdHJsLnJlcGxhY2VXaXRoKHRoaXMuc3RhdHVzQ3RybEVsKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0dXNFbCAhPSBudWxsKSB7XHJcbiAgICAgIGxldCBjdXJyZW50U3RhdHVzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN0YXR1c0VsLmlkKTtcclxuICAgICAgaWYgKGN1cnJlbnRTdGF0dXNFbCAhPSBudWxsKSBjdXJyZW50U3RhdHVzRWwucmVwbGFjZVdpdGgodGhpcy5zdGF0dXNFbCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1jb21wb25lbnRcIiwgQ29tcG9uZW50KTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ3VydGFpbiBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgZ3JhZGVzOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoaWQsIG5hbWUsIGRlc2NyaXB0aW9uKTtcclxuICAgIHRoaXMuZ3JhZGVzID0gMDtcclxuICB9XHJcblxyXG4gIGNoYW5nZUdyYWRlcyhkYXRhKSB7XHJcbiAgICBjb25zb2xlLmRlYnVnKFwiaW5wdXRcIiwgZGF0YSk7XHJcbiAgICB0aGlzLmdyYWRlcyA9IGRhdGEudGFyZ2V0LnZhbHVlO1xyXG4gICAgdGhpcy51cGRhdGVET00oKTtcclxuICB9XHJcblxyXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgQ3VydGFpblxyXG4gIGNvbXB1dGVTdGF0dXMoKSB7XHJcbiAgICAvLyB0aGUgc3RhdHVzIGNvbnRyb2wgaXMgYSBzbGlkZXJcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgbGV0IHNsaWRlcklucHV0RWwgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBzbGlkZXJJbnB1dEVsLnR5cGUgPSBcInJhbmdlXCI7XHJcbiAgICBzbGlkZXJJbnB1dEVsLnN0ZXAgPSBcIjEwXCI7XHJcbiAgICBzbGlkZXJJbnB1dEVsLm1pbiA9IFwiMFwiO1xyXG4gICAgc2xpZGVySW5wdXRFbC5tYXggPSBcIjEwMFwiO1xyXG4gICAgc2xpZGVySW5wdXRFbC52YWx1ZSA9IFwiXCIgKyB0aGlzLmdyYWRlcztcclxuICAgIHNsaWRlcklucHV0RWwub25jaGFuZ2UgPSB2ID0+IHRoaXMuY2hhbmdlR3JhZGVzKHYpO1xyXG5cclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmlkID0gXCJjdXJ0YWluX2N0cmxfXCIgKyB0aGlzLmlkO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuYXBwZW5kQ2hpbGQoc2xpZGVySW5wdXRFbCk7XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwiY3VydGFpbl9zdGF0dXNfXCIgKyB0aGlzLmlkO1xyXG5cclxuICAgIC8vIHRoaXMuc3RhdHVzRWwuc3R5bGUubWFyZ2luVG9wID0gXCIwcHhcIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuaGVpZ2h0ID0gdGhpcy5ncmFkZXMgKyBcIiVcIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYzVjNWM1XCI7XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmFsaWduU2VsZiA9IFwic3RhcnRcIjtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWN1cnRhaW5cIiwgQ3VydGFpbik7XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERvb3IgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIG9wZW5lZDogYm9vbGVhbjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xyXG4gICAgdGhpcy5vcGVuZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vIGNhbGxlZCBieSB0aGUgYnV0dG9uIHRvIGNoYW5nZSB0aGUgc3RhdGVcclxuICB0b29nbGVEb29yKCkge1xyXG4gICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XHJcbiAgICB0aGlzLnVwZGF0ZURPTSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBEb29yXHJcbiAgY29tcHV0ZVN0YXR1cygpIHtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUJ1dHRvbiBzcGVjdHJ1bS1CdXR0b24tLWN0YVwiO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwub25jbGljayA9IGV2dCA9PiB0aGlzLnRvb2dsZURvb3IoKTsgLy9hcnJvdyBmdW5jdGlvbiBrZWVwIHRoZSBpbnN0YW5jZSBzdGF0ZVxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuaWQgPSBcImRvb3JfY3RybF9cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MU3BhbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJkb29yX3N0YXR1c19cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZVwiO1xyXG4gICAgaWYgKHRoaXMub3BlbmVkKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJUZXh0ID0gXCJPUEVORURcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgKz0gXCIgc3BlY3RydW0tTGFiZWwtLWJsdWVcIjtcclxuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIkNMT1NFXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVyVGV4dCA9IFwiQ0xPU0VEXCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lICs9IFwiIHNwZWN0cnVtLUxhYmVsLS1ncmV5XCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzQ3RybEVsLnRleHRDb250ZW50ID0gXCJPUEVOXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1kb29yXCIsIERvb3IpO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBMaWdodCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgb246IGJvb2xlYW47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoaWQsIG5hbWUsIGRlc2NyaXB0aW9uKTtcclxuICAgIHRoaXMub24gPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vIGNhbGxlZCBieSB0aGUgYnV0dG9uIHRvIGNoYW5nZSB0aGUgc3RhdGVcclxuICB0b29nbGVMaWdodCgpIHtcclxuICAgIHRoaXMub24gPSAhdGhpcy5vbjtcclxuICAgIHRoaXMudXBkYXRlRE9NKCk7XHJcbiAgfVxyXG5cclxuICAvLyBvdmVycmlkZSB3aXRoIHRoZSBzcGVjaWZpYyBiZWhhdmlvciBvZiBhIExpZ2h0XHJcbiAgY29tcHV0ZVN0YXR1cygpIHtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUJ1dHRvbiBzcGVjdHJ1bS1CdXR0b24tLWN0YVwiO1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwub25jbGljayA9IGV2dCA9PiB0aGlzLnRvb2dsZUxpZ2h0KCk7IC8vYXJyb3cgZnVuY3Rpb24ga2VlcCB0aGUgaW5zdGFuY2Ugc3RhdGVcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmlkID0gXCJsaWdodF9jdHJsX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJsaWdodF9zdGF0dXNfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2VcIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICBpZiAodGhpcy5vbikge1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2ZmZTYyYlwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVySFRNTCA9XHJcbiAgICAgICAgXCI8bGFiZWwgY2xhc3M9J3NwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZSc+T048L2xhYmVsPlwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiVFVSTiBPRkZcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmV5XCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID1cclxuICAgICAgICBcIjxsYWJlbCBjbGFzcz0nc3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlJz5PRkY8L2xhYmVsPlwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiVFVSTiBPTlwiO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tbGlnaHRcIiwgTGlnaHQpO1xyXG4iLCJpbXBvcnQgeyBEb29yIH0gZnJvbSBcIi4vZG9vclwiO1xyXG5pbXBvcnQgeyBMaWdodCB9IGZyb20gXCIuL2xpZ2h0XCI7XHJcbmltcG9ydCB7IEN1cnRhaW4gfSBmcm9tIFwiLi9jdXJ0YWluXCI7XHJcbmltcG9ydCB7IENsaW1hIH0gZnJvbSBcIi4vY2xpbWFcIjtcclxuLy8gaW1wb3J0IHsgTXlDb21wb25lbnQgfSBmcm9tIFwiLi9teWNvbXBvbmVudFwiO1xyXG5cclxuZnVuY3Rpb24gc2hvd1BhbmVsKCkge1xyXG4gIGNvbnN0IGN1cnRhaW5zRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnRhaW5zXCIpO1xyXG4gIGNvbnN0IGRvb3JzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRvb3JzXCIpO1xyXG4gIGNvbnN0IGxpZ2h0c0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaWdodHNcIik7XHJcbiAgY29uc3QgY2xpbWFFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xpbWFcIik7XHJcblxyXG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXHJcbiAgICBuZXcgRG9vcihcImRvb3IxXCIsIFwiTWFpbiBEb29yXCIsIFwiRW50cmFuY2UgZG9vciwgYWxsYXJtZWRcIilcclxuICApO1xyXG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXHJcbiAgICBuZXcgRG9vcihcImRvb3IyXCIsIFwiQmFjayBEb29yXCIsIFwiTXVzdCBiZSBhbHdhc3kgY2xvc2VkLCBhbGxhcm1lZFwiKVxyXG4gICk7XHJcbiAgZG9vcnNFbC5hcHBlbmRDaGlsZChcclxuICAgIG5ldyBEb29yKFwiZG9vcjNcIiwgXCJHYXJkZW4gRG9vclwiLCBcIkdhcmRlbiBkb29yLCB0aGlzIGlzIG5vdCBhbGxhcm1lZFwiKVxyXG4gICk7XHJcblxyXG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoMVwiLCBcIktpdGNoZW4gbGlnaHRcIiwgXCJcIikpO1xyXG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoMlwiLCBcIkJlZHJvb21cIiwgXCJcIikpO1xyXG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoM1wiLCBcIkxpdmluZyByb29tXCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDVcIiwgXCJDaGlsZHJlbiByb29tXCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDZcIiwgXCJPdXRkb29yXCIsIFwiXCIpKTtcclxuXHJcbiAgY3VydGFpbnNFbC5hcHBlbmRDaGlsZChuZXcgQ3VydGFpbihcImN1cnRhaW4xXCIsIFwiRW50cmFuY2VcIiwgXCJIb21lIGVudHJhbmNlXCIpKTtcclxuICBjdXJ0YWluc0VsLmFwcGVuZENoaWxkKFxyXG4gICAgbmV3IEN1cnRhaW4oXCJjdXJ0YWluM1wiLCBcIkxpdmluZyByb29tXCIsIFwibGl2aW5nIHJvb20gY3VydGFpblwiKVxyXG4gICk7XHJcbiAgY3VydGFpbnNFbC5hcHBlbmRDaGlsZChuZXcgQ3VydGFpbihcImN1cnRhaW4yXCIsIFwiT3V0ZG9vclwiLCBcIkZyb250IGdhcmRlblwiKSk7XHJcblxyXG4gIGNsaW1hRWwuYXBwZW5kQ2hpbGQobmV3IENsaW1hKFwiY2xpbWEwXCIsIFwiS2l0Y2hlblwiLCBcIkF1dG9tYXRpYyB0ZW1wZXJhdHVyZVwiKSk7XHJcbiAgY2xpbWFFbC5hcHBlbmRDaGlsZChuZXcgQ2xpbWEoXCJjbGltYTFcIiwgXCJSb29tXCIsIFwiQXV0b21hdGljIHRlbXBlcmF0dXJlXCIpKTtcclxuICBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBDbGltYShcImNsaW1hMlwiLCBcIkJhdGhcIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xyXG5cclxuICAvLyBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBNeUNvbXBvbmVudChcImNvbXBcIiwgXCJuYW1lXCIsIFwiQXV0b21hdGljIHRlbXBlcmF0dXJlXCIpKTtcclxufVxyXG5cclxuc2hvd1BhbmVsKCk7XHJcbiJdfQ==
