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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2xpbWEudHMiLCJzcmMvY29tcG9uZW50LnRzIiwic3JjL2N1cnRhaW4udHMiLCJzcmMvZG9vci50cyIsInNyYy9saWdodC50cyIsInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSwyQ0FBd0M7QUFFeEMsTUFBYSxLQUFNLFNBQVEscUJBQVM7SUFHbEMsWUFBWSxFQUFVLEVBQUUsSUFBWSxFQUFFLFdBQW1CO1FBQ3ZELEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtDQUErQztRQUM1RixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQzFELENBQUM7Q0FDRjtBQWpCRCxzQkFpQkM7QUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7OztBQ3JCeEQsSUFBWSxj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QUF1QixDQUFDLENBQUMsQ0FBQztJQUM3RSxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksYUFBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0lBQzFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxhQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7SUFFMUUsZ0ZBQWdGO0FBQ2xGLENBQUM7QUFFRCxTQUFTLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENsaW1hIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICB0ZW1wOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoaWQsIG5hbWUsIGRlc2NyaXB0aW9uKTtcclxuICAgIHRoaXMudGVtcCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgzNSAtIDEwKSArIDEwKTtcclxuICB9XHJcblxyXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgQ2xpbWFcclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MU3BhbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJkb29yX3N0YXR1c19cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmZvbnRTaXplID0gXCIyLjhlbVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5jb2xvciA9IFwiIzY2NjY2NlwiO1xyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID0gXCI8aDE+XCIgKyB0aGlzLnRlbXAgKyBcIsKwPC9oMT5cIjtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWNsaW1hXCIsIENsaW1hKTtcclxuIiwiZXhwb3J0IGVudW0gQ29tcG9uZW50U3RhdGUge1xyXG4gIE9uID0gMCxcclxuICBPZmYgPSAxLFxyXG4gIE5vbmUgPSAyIC8vbWVhbnMgZG9lcyBub3QgYXBwbHlcclxufVxyXG5cclxuLyoqXHJcbiAqIEJhc2ljIEF1dG9tYXRpb24gQ29tcG9uZW50LiBEcmF3IGl0c2VsZiBhcyBhIFNwZWN0cnVtIGNhcmRcclxuICogRGVmaW5lcyBzb21lIGV4dGVuc2lvbiBwb2ludHMgd2hlcmUgdG8gaG9vayB0byBtYW5hZ2UgdGhlIGNvbXBvbmVudCBzdGF0dXNcclxuICovXHJcblxyXG4vKlxyXG4gSFRNTCBjcmVhdGVkIGJ5IHRoaXMgZWxlbWVudDpcclxuXHJcbiA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZFwiIHN0eWxlPVwid2lkdGg6IDIwOHB4O1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtY292ZXJQaG90b1wiPlxyXG4gICAgICBTVEFUVVNcclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtYm9keVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC10aXRsZVwiPkNvbXBvbmVudE5hbWU8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLXN1YnRpdGxlXCI+ZGVzY3JpcHRpb248L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtZm9vdGVyXCI+XHJcbiAgICAgICAgU1RBVFVTIENPTlRST0xcclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIGlkOiBzdHJpbmc7XHJcblxyXG4gIHN0YXR1c0N0cmxFbDogSFRNTEVsZW1lbnQ7XHJcbiAgc3RhdHVzRWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAvKipcclxuICAgKiBCYXNlIGNvbXBvbmVudCwgZ2VuZXJpYyBjbGFzcyB0byB1c2UgYXMgcGFyZW50LlxyXG4gICAqIEVhY2ggZGVyaXZlZCBjb21wb25lbnQgc2hvdWxkIGRlZmluZSBpdHMgc3RhdHVzIHJlcHJlc2VudGF0aW9uIGFuZCBzdGF0dXMgY29udHJvbCBlbGVtZW50c1xyXG4gICAqXHJcbiAgICogQHBhcmFtIG5hbWUgZGlzcGxheSBuYW1lXHJcbiAgICogQHBhcmFtIGRlc2NyaXB0aW9uIGRlc2NyaXB0aW9uIG9mIHRoZSBjb21wb25lbnRcclxuICAgKiBAcGFyYW0gaWQgbXVzdCBiZSB1bmlxdWUgaW4gdGhlIERPTVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIGlmIChpZCA9PSBudWxsIHx8IGlkLmxlbmd0aCA9PSAwKSB0aHJvdyBcImludmFsaWQgaWRcIjtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICB0aGlzLmlkID0gaWQ7XHJcbiAgfVxyXG5cclxuICAvLyBjYWxsZWQgd2hlbiBhZGRlZCB0byB0aGUgRE9NIC0gdGhlIGZpcnN0IHRpbWVcclxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5nZXRUZW1wbGF0ZSgpKTtcclxuICB9XHJcblxyXG4gIGdldFRlbXBsYXRlKCkge1xyXG4gICAgLy8gZHJhdyBhIGJhc2ljIFNwZWN0cnVtIENhcmRcclxuXHJcbiAgICBsZXQgY2FyZERpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2FyZERpdi5zdHlsZS53aWR0aCA9IFwiMjA4cHhcIjtcclxuICAgIGNhcmREaXYuc3R5bGUubWFyZ2luID0gXCIyNXB4IDI1cHhcIjtcclxuICAgIGNhcmREaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkXCI7XHJcblxyXG4gICAgbGV0IGNvdmVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjb3ZlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtY292ZXJQaG90b1wiO1xyXG4gICAgY292ZXJEaXYuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XHJcbiAgICBsZXQgc3RhdHVzRWxlbWVudCA9IHRoaXMuZ2V0U3RhdHVzRWxlbWVudCgpO1xyXG4gICAgaWYgKHN0YXR1c0VsZW1lbnQgIT0gbnVsbCkgY292ZXJEaXYuYXBwZW5kQ2hpbGQoc3RhdHVzRWxlbWVudCk7XHJcblxyXG4gICAgbGV0IGJvZHlEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJvZHlEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWJvZHlcIjtcclxuXHJcbiAgICBsZXQgaGVhZGVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBoZWFkZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWhlYWRlclwiO1xyXG5cclxuICAgIGxldCB0aXRsZURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGl0bGVEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLXRpdGxlXCI7XHJcbiAgICB0aXRsZURpdi5pbm5lclRleHQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgbGV0IGNvbnRlbnREaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvbnRlbnREaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWNvbnRlbnRcIjtcclxuXHJcbiAgICBsZXQgc3VidGl0bGVEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHN1YnRpdGxlRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1zdWJ0aXRsZVwiO1xyXG4gICAgc3VidGl0bGVEaXYuaW5uZXJUZXh0ID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICBsZXQgZm9vdGVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBmb290ZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWZvb3RlclwiO1xyXG5cclxuICAgIGxldCBzdGF0dXNDb250cm9sRWxlbWVudCA9IHRoaXMuZ2V0U3RhdHVzQ29udHJvbEVsZW1lbnQoKTtcclxuICAgIGlmIChzdGF0dXNDb250cm9sRWxlbWVudCAhPSBudWxsKVxyXG4gICAgICBmb290ZXJEaXYuYXBwZW5kQ2hpbGQoc3RhdHVzQ29udHJvbEVsZW1lbnQpO1xyXG5cclxuICAgIGNvbnRlbnREaXYuYXBwZW5kQ2hpbGQoc3VidGl0bGVEaXYpO1xyXG4gICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcclxuICAgIGJvZHlEaXYuYXBwZW5kQ2hpbGQoaGVhZGVyRGl2KTtcclxuICAgIGJvZHlEaXYuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XHJcblxyXG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChjb3ZlckRpdik7XHJcbiAgICBjYXJkRGl2LmFwcGVuZENoaWxkKGJvZHlEaXYpO1xyXG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChmb290ZXJEaXYpO1xyXG5cclxuICAgIHJldHVybiBjYXJkRGl2O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIHRoZSBjb250cm9sIHRvIHVzZSB0byBjaGFuZ2UgdGhlIGNvbXBvbmVudCBzdGF0dXMgKGJ1dHRvbi9zbGlkZXIvY2hlY2tib3guLi4pXHJcbiAgICogTXVzdCBiZSBkZWZpbmVkIGluIHRoZSBkZXJpdmVkIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldFN0YXR1c0NvbnRyb2xFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHRoaXMuY29tcHV0ZVN0YXR1cygpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLnN0YXR1c0N0cmxFbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlZmluZSB0aGUgVUkgdG8gZGlzcGxheSB0aGUgc3RhdHVzIG9mIHRoZSBjb21wb25lbnQgc3RhdHVzIChpbWFnZS9sYWJlbC8uLi4pXHJcbiAgICogTXVzdCBiZSBkZWZpbmVkIGluIHRoZSBkZXJpdmVkIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldFN0YXR1c0VsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgdGhpcy5jb21wdXRlU3RhdHVzKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzRWw7XHJcbiAgfVxyXG5cclxuICAvKiogQ29tcHV0ZSB0aGUgc3RhdHVzIG9mIHRoaXMgY29tcG9uZW50XHJcbiAgICogVGhpcyBtdXN0IGJlIG92ZXJyaWRkZW4gaW4gYSBkZXJpdmVkIGNsYXNzXHJcbiAgICogVGhpcyBzaG91bGQganVzdCBjaGFuZ2UgdGhlIEhUTUxFbGVtZW50cyBmb3IgZGlzcGxheSBhbmQgY29udHJvbFxyXG4gICAqIFRoaXMgbXVzdCBhbHNvIHNldCBhbiBJRCB0byB0aGUgSFRNTEVsZW1lbnRzIHRoYXQgbmVlZCB0byBiZSB1cGRhdGVkXHJcbiAgICovXHJcbiAgY29tcHV0ZVN0YXR1cygpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgRE9NIG9mIHRoZSBkb2N1bWVudCByZXBsYWNpbmcgdGhlIG9sZCB2YWx1ZXMgd2l0aCB0aGUgY3VycmVudCBvbmVzXHJcbiAgICogTXVzdCBiZSBjYWxsZWQgZXZlcnl0aW1lIHRoZSBjb21wb25lbnQgd2FudHMgdG8gdXBkYXRlIHRoZSBwYWdlLlxyXG4gICAqIEludGVybmFsbHkgY2FsbHMgY29tcHV0ZVN0YXR1cygpIGFzIGZpcnN0IHN0ZXBcclxuICAgKiBJdCBpcyBtYW5kYXRvcnkgdGhhdCB0aGUgdHdvIGVsZW1lbnRzIGhhdmUgYW4gSUQgZGVmaW5lZC4gT3RoZXJ3aXNlIHRoZXkgd2lsbCBub3QgYmUgdXBkYXRlZFxyXG4gICAqL1xyXG4gIHVwZGF0ZURPTSgpIHtcclxuICAgIHRoaXMuY29tcHV0ZVN0YXR1cygpO1xyXG5cclxuICAgIC8vIHJlZHJhdyB0aGUgVUkganVzdCByZXBsYWNpbmcgdGhlIGVsZW1lbnRzIHRoYXQgaGFzIGNoYW5nZWRcclxuICAgIGlmICh0aGlzLnN0YXR1c0N0cmxFbCAhPSBudWxsKSB7XHJcbiAgICAgIGxldCBjdXJyZW50U3RhdGVDdHJsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zdGF0dXNDdHJsRWwuaWQpO1xyXG4gICAgICBpZiAoY3VycmVudFN0YXRlQ3RybCAhPSBudWxsKVxyXG4gICAgICAgIGN1cnJlbnRTdGF0ZUN0cmwucmVwbGFjZVdpdGgodGhpcy5zdGF0dXNDdHJsRWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnN0YXR1c0VsICE9IG51bGwpIHtcclxuICAgICAgbGV0IGN1cnJlbnRTdGF0dXNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc3RhdHVzRWwuaWQpO1xyXG4gICAgICBpZiAoY3VycmVudFN0YXR1c0VsICE9IG51bGwpIGN1cnJlbnRTdGF0dXNFbC5yZXBsYWNlV2l0aCh0aGlzLnN0YXR1c0VsKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWNvbXBvbmVudFwiLCBDb21wb25lbnQpO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDdXJ0YWluIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBncmFkZXM6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xyXG4gICAgdGhpcy5ncmFkZXMgPSAwO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlR3JhZGVzKGRhdGEpIHtcclxuICAgIGNvbnNvbGUuZGVidWcoXCJpbnB1dFwiLCBkYXRhKTtcclxuICAgIHRoaXMuZ3JhZGVzID0gZGF0YS50YXJnZXQudmFsdWU7XHJcbiAgICB0aGlzLnVwZGF0ZURPTSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBDdXJ0YWluXHJcbiAgY29tcHV0ZVN0YXR1cygpIHtcclxuICAgIC8vIHRoZSBzdGF0dXMgY29udHJvbCBpcyBhIHNsaWRlclxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICBsZXQgc2xpZGVySW5wdXRFbCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHNsaWRlcklucHV0RWwudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgIHNsaWRlcklucHV0RWwuc3RlcCA9IFwiMTBcIjtcclxuICAgIHNsaWRlcklucHV0RWwubWluID0gXCIwXCI7XHJcbiAgICBzbGlkZXJJbnB1dEVsLm1heCA9IFwiMTAwXCI7XHJcbiAgICBzbGlkZXJJbnB1dEVsLnZhbHVlID0gXCJcIiArIHRoaXMuZ3JhZGVzO1xyXG4gICAgc2xpZGVySW5wdXRFbC5vbmNoYW5nZSA9IHYgPT4gdGhpcy5jaGFuZ2VHcmFkZXModik7XHJcblxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuaWQgPSBcImN1cnRhaW5fY3RybF9cIiArIHRoaXMuaWQ7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5hcHBlbmRDaGlsZChzbGlkZXJJbnB1dEVsKTtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJjdXJ0YWluX3N0YXR1c19cIiArIHRoaXMuaWQ7XHJcblxyXG4gICAgLy8gdGhpcy5zdGF0dXNFbC5zdHlsZS5tYXJnaW5Ub3AgPSBcIjBweFwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLmdyYWRlcyArIFwiJVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNjNWM1YzVcIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYWxpZ25TZWxmID0gXCJzdGFydFwiO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tY3VydGFpblwiLCBDdXJ0YWluKTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRG9vciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgb3BlbmVkOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLy8gY2FsbGVkIGJ5IHRoZSBidXR0b24gdG8gY2hhbmdlIHRoZSBzdGF0ZVxyXG4gIHRvb2dsZURvb3IoKSB7XHJcbiAgICB0aGlzLm9wZW5lZCA9ICF0aGlzLm9wZW5lZDtcclxuICAgIHRoaXMudXBkYXRlRE9NKCk7XHJcbiAgfVxyXG5cclxuICAvLyBvdmVycmlkZSB3aXRoIHRoZSBzcGVjaWZpYyBiZWhhdmlvciBvZiBhIERvb3JcclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQnV0dG9uIHNwZWN0cnVtLUJ1dHRvbi0tY3RhXCI7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5vbmNsaWNrID0gZXZ0ID0+IHRoaXMudG9vZ2xlRG9vcigpOyAvL2Fycm93IGZ1bmN0aW9uIGtlZXAgdGhlIGluc3RhbmNlIHN0YXRlXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwiZG9vcl9jdHJsX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxTcGFuRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImRvb3Jfc3RhdHVzX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlXCI7XHJcbiAgICBpZiAodGhpcy5vcGVuZWQpIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lclRleHQgPSBcIk9QRU5FRFwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSArPSBcIiBzcGVjdHJ1bS1MYWJlbC0tYmx1ZVwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiQ0xPU0VcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJUZXh0ID0gXCJDTE9TRURcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgKz0gXCIgc3BlY3RydW0tTGFiZWwtLWdyZXlcIjtcclxuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIk9QRU5cIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWRvb3JcIiwgRG9vcik7XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpZ2h0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBvbjogYm9vbGVhbjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xyXG4gICAgdGhpcy5vbiA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLy8gY2FsbGVkIGJ5IHRoZSBidXR0b24gdG8gY2hhbmdlIHRoZSBzdGF0ZVxyXG4gIHRvb2dsZUxpZ2h0KCkge1xyXG4gICAgdGhpcy5vbiA9ICF0aGlzLm9uO1xyXG4gICAgdGhpcy51cGRhdGVET00oKTtcclxuICB9XHJcblxyXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgTGlnaHRcclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQnV0dG9uIHNwZWN0cnVtLUJ1dHRvbi0tY3RhXCI7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5vbmNsaWNrID0gZXZ0ID0+IHRoaXMudG9vZ2xlTGlnaHQoKTsgLy9hcnJvdyBmdW5jdGlvbiBrZWVwIHRoZSBpbnN0YW5jZSBzdGF0ZVxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuaWQgPSBcImxpZ2h0X2N0cmxfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImxpZ2h0X3N0YXR1c19cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIGlmICh0aGlzLm9uKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmZlNjJiXCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID1cclxuICAgICAgICBcIjxsYWJlbCBjbGFzcz0nc3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlJz5PTjwvbGFiZWw+XCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzQ3RybEVsLnRleHRDb250ZW50ID0gXCJUVVJOIE9GRlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyZXlcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lckhUTUwgPVxyXG4gICAgICAgIFwiPGxhYmVsIGNsYXNzPSdzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2UnPk9GRjwvbGFiZWw+XCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzQ3RybEVsLnRleHRDb250ZW50ID0gXCJUVVJOIE9OXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1saWdodFwiLCBMaWdodCk7XHJcbiIsImltcG9ydCB7IERvb3IgfSBmcm9tIFwiLi9kb29yXCI7XHJcbmltcG9ydCB7IExpZ2h0IH0gZnJvbSBcIi4vbGlnaHRcIjtcclxuaW1wb3J0IHsgQ3VydGFpbiB9IGZyb20gXCIuL2N1cnRhaW5cIjtcclxuaW1wb3J0IHsgQ2xpbWEgfSBmcm9tIFwiLi9jbGltYVwiO1xyXG4vL2ltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSBcIi4vbXljb21wb25lbnRcIjtcclxuXHJcbmZ1bmN0aW9uIHNob3dQYW5lbCgpIHtcclxuICBjb25zdCBjdXJ0YWluc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJ0YWluc1wiKTtcclxuICBjb25zdCBkb29yc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkb29yc1wiKTtcclxuICBjb25zdCBsaWdodHNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlnaHRzXCIpO1xyXG4gIGNvbnN0IGNsaW1hRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsaW1hXCIpO1xyXG5cclxuICBkb29yc0VsLmFwcGVuZENoaWxkKFxyXG4gICAgbmV3IERvb3IoXCJkb29yMVwiLCBcIk1haW4gRG9vclwiLCBcIkVudHJhbmNlIGRvb3IsIGFsbGFybWVkXCIpXHJcbiAgKTtcclxuICBkb29yc0VsLmFwcGVuZENoaWxkKFxyXG4gICAgbmV3IERvb3IoXCJkb29yMlwiLCBcIkJhY2sgRG9vclwiLCBcIk11c3QgYmUgYWx3YXN5IGNsb3NlZCwgYWxsYXJtZWRcIilcclxuICApO1xyXG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXHJcbiAgICBuZXcgRG9vcihcImRvb3IzXCIsIFwiR2FyZGVuIERvb3JcIiwgXCJHYXJkZW4gZG9vciwgdGhpcyBpcyBub3QgYWxsYXJtZWRcIilcclxuICApO1xyXG5cclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDFcIiwgXCJLaXRjaGVuIGxpZ2h0XCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDJcIiwgXCJCZWRyb29tXCIsIFwiXCIpKTtcclxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDNcIiwgXCJMaXZpbmcgcm9vbVwiLCBcIlwiKSk7XHJcbiAgbGlnaHRzRWwuYXBwZW5kQ2hpbGQobmV3IExpZ2h0KFwibGlndGg1XCIsIFwiQ2hpbGRyZW4gcm9vbVwiLCBcIlwiKSk7XHJcbiAgbGlnaHRzRWwuYXBwZW5kQ2hpbGQobmV3IExpZ2h0KFwibGlndGg2XCIsIFwiT3V0ZG9vclwiLCBcIlwiKSk7XHJcblxyXG4gIGN1cnRhaW5zRWwuYXBwZW5kQ2hpbGQobmV3IEN1cnRhaW4oXCJjdXJ0YWluMVwiLCBcIkVudHJhbmNlXCIsIFwiSG9tZSBlbnRyYW5jZVwiKSk7XHJcbiAgY3VydGFpbnNFbC5hcHBlbmRDaGlsZChcclxuICAgIG5ldyBDdXJ0YWluKFwiY3VydGFpbjNcIiwgXCJMaXZpbmcgcm9vbVwiLCBcImxpdmluZyByb29tIGN1cnRhaW5cIilcclxuICApO1xyXG4gIGN1cnRhaW5zRWwuYXBwZW5kQ2hpbGQobmV3IEN1cnRhaW4oXCJjdXJ0YWluMlwiLCBcIk91dGRvb3JcIiwgXCJGcm9udCBnYXJkZW5cIikpO1xyXG5cclxuICBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBDbGltYShcImNsaW1hMFwiLCBcIktpdGNoZW5cIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xyXG4gIGNsaW1hRWwuYXBwZW5kQ2hpbGQobmV3IENsaW1hKFwiY2xpbWExXCIsIFwiUm9vbVwiLCBcIkF1dG9tYXRpYyB0ZW1wZXJhdHVyZVwiKSk7XHJcbiAgY2xpbWFFbC5hcHBlbmRDaGlsZChuZXcgQ2xpbWEoXCJjbGltYTJcIiwgXCJCYXRoXCIsIFwiQXV0b21hdGljIHRlbXBlcmF0dXJlXCIpKTtcclxuXHJcbiAgLy9jbGltYUVsLmFwcGVuZENoaWxkKG5ldyBNeUNvbXBvbmVudChcImNvbXBcIiwgXCJuYW1lXCIsIFwiQXV0b21hdGljIHRlbXBlcmF0dXJlXCIpKTtcclxufVxyXG5cclxuc2hvd1BhbmVsKCk7XHJcbiJdfQ==
