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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2xpbWEudHMiLCJzcmMvY29tcG9uZW50LnRzIiwic3JjL2N1cnRhaW4udHMiLCJzcmMvZG9vci50cyIsInNyYy9saWdodC50cyIsInNyYy9tYWluLnRzIiwic3JjL215Y29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSwyQ0FBd0M7QUFFeEMsTUFBYSxLQUFNLFNBQVEscUJBQVM7SUFHbEMsWUFBWSxFQUFVLEVBQUUsSUFBWSxFQUFFLFdBQW1CO1FBQ3ZELEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLCtDQUErQztRQUM1RixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQzFELENBQUM7Q0FDRjtBQWpCRCxzQkFpQkM7QUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMs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QyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUN4QyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0NBQ0Y7QUF2QkQsa0NBdUJDO0FBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsV0FBVyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcblxuZXhwb3J0IGNsYXNzIENsaW1hIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgdGVtcDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XG4gICAgdGhpcy50ZW1wID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDM1IC0gMTApICsgMTApO1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBDbGltYVxuICBjb21wdXRlU3RhdHVzKCkge1xuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTFNwYW5FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImRvb3Jfc3RhdHVzX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLmZvbnRTaXplID0gXCIyLjhlbVwiO1xuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuY29sb3IgPSBcIiM2NjY2NjZcIjtcblxuICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID0gXCI8aDE+XCIgKyB0aGlzLnRlbXAgKyBcIsKwPC9oMT5cIjtcbiAgfVxufVxuXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1jbGltYVwiLCBDbGltYSk7XG4iLCJleHBvcnQgZW51bSBDb21wb25lbnRTdGF0ZSB7XG4gIE9uID0gMCxcbiAgT2ZmID0gMSxcbiAgTm9uZSA9IDIgLy9tZWFucyBkb2VzIG5vdCBhcHBseVxufVxuXG4vKipcbiAqIEJhc2ljIEF1dG9tYXRpb24gQ29tcG9uZW50LiBEcmF3IGl0c2VsZiBhcyBhIFNwZWN0cnVtIGNhcmRcbiAqIERlZmluZXMgc29tZSBleHRlbnNpb24gcG9pbnRzIHdoZXJlIHRvIGhvb2sgdG8gbWFuYWdlIHRoZSBjb21wb25lbnQgc3RhdHVzXG4gKi9cblxuLypcbiBIVE1MIGNyZWF0ZWQgYnkgdGhpcyBlbGVtZW50OlxuXG4gPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmRcIiBzdHlsZT1cIndpZHRoOiAyMDhweDtcIj5cbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1jb3ZlclBob3RvXCI+XG4gICAgICBTVEFUVVNcbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1ib2R5XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWhlYWRlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtdGl0bGVcIj5Db21wb25lbnROYW1lPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1zdWJ0aXRsZVwiPmRlc2NyaXB0aW9uPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWZvb3RlclwiPlxuICAgICAgICBTVEFUVVMgQ09OVFJPTFxuICAgIDwvZGl2PlxuPC9kaXY+XG4gKi9cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xuXG4gIHN0YXR1c0N0cmxFbDogSFRNTEVsZW1lbnQ7XG4gIHN0YXR1c0VsOiBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogQmFzZSBjb21wb25lbnQsIGdlbmVyaWMgY2xhc3MgdG8gdXNlIGFzIHBhcmVudC5cbiAgICogRWFjaCBkZXJpdmVkIGNvbXBvbmVudCBzaG91bGQgZGVmaW5lIGl0cyBzdGF0dXMgcmVwcmVzZW50YXRpb24gYW5kIHN0YXR1cyBjb250cm9sIGVsZW1lbnRzXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIGRpc3BsYXkgbmFtZVxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gZGVzY3JpcHRpb24gb2YgdGhlIGNvbXBvbmVudFxuICAgKiBAcGFyYW0gaWQgbXVzdCBiZSB1bmlxdWUgaW4gdGhlIERPTVxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoaWQgPT0gbnVsbCB8fCBpZC5sZW5ndGggPT0gMCkgdGhyb3cgXCJpbnZhbGlkIGlkXCI7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5pZCA9IGlkO1xuICB9XG5cbiAgLy8gY2FsbGVkIHdoZW4gYWRkZWQgdG8gdGhlIERPTSAtIHRoZSBmaXJzdCB0aW1lXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5nZXRUZW1wbGF0ZSgpKTtcbiAgfVxuXG4gIGdldFRlbXBsYXRlKCkge1xuICAgIC8vIGRyYXcgYSBiYXNpYyBTcGVjdHJ1bSBDYXJkXG5cbiAgICBsZXQgY2FyZERpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNhcmREaXYuc3R5bGUud2lkdGggPSBcIjIwOHB4XCI7XG4gICAgY2FyZERpdi5zdHlsZS5tYXJnaW4gPSBcIjI1cHggMjVweFwiO1xuICAgIGNhcmREaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkXCI7XG5cbiAgICBsZXQgY292ZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb3ZlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtY292ZXJQaG90b1wiO1xuICAgIGNvdmVyRGl2LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgIGxldCBzdGF0dXNFbGVtZW50ID0gdGhpcy5nZXRTdGF0dXNFbGVtZW50KCk7XG4gICAgaWYgKHN0YXR1c0VsZW1lbnQgIT0gbnVsbCkgY292ZXJEaXYuYXBwZW5kQ2hpbGQoc3RhdHVzRWxlbWVudCk7XG5cbiAgICBsZXQgYm9keURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJvZHlEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWJvZHlcIjtcblxuICAgIGxldCBoZWFkZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBoZWFkZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWhlYWRlclwiO1xuXG4gICAgbGV0IHRpdGxlRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGl0bGVEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLXRpdGxlXCI7XG4gICAgdGl0bGVEaXYuaW5uZXJUZXh0ID0gdGhpcy5uYW1lO1xuXG4gICAgbGV0IGNvbnRlbnREaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250ZW50RGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1jb250ZW50XCI7XG5cbiAgICBsZXQgc3VidGl0bGVEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBzdWJ0aXRsZURpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtc3VidGl0bGVcIjtcbiAgICBzdWJ0aXRsZURpdi5pbm5lclRleHQgPSB0aGlzLmRlc2NyaXB0aW9uO1xuXG4gICAgbGV0IGZvb3RlckRpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGZvb3RlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtZm9vdGVyXCI7XG5cbiAgICBsZXQgc3RhdHVzQ29udHJvbEVsZW1lbnQgPSB0aGlzLmdldFN0YXR1c0NvbnRyb2xFbGVtZW50KCk7XG4gICAgaWYgKHN0YXR1c0NvbnRyb2xFbGVtZW50ICE9IG51bGwpXG4gICAgICBmb290ZXJEaXYuYXBwZW5kQ2hpbGQoc3RhdHVzQ29udHJvbEVsZW1lbnQpO1xuXG4gICAgY29udGVudERpdi5hcHBlbmRDaGlsZChzdWJ0aXRsZURpdik7XG4gICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcbiAgICBib2R5RGl2LmFwcGVuZENoaWxkKGhlYWRlckRpdik7XG4gICAgYm9keURpdi5hcHBlbmRDaGlsZChjb250ZW50RGl2KTtcblxuICAgIGNhcmREaXYuYXBwZW5kQ2hpbGQoY292ZXJEaXYpO1xuICAgIGNhcmREaXYuYXBwZW5kQ2hpbGQoYm9keURpdik7XG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChmb290ZXJEaXYpO1xuXG4gICAgcmV0dXJuIGNhcmREaXY7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBjb250cm9sIHRvIHVzZSB0byBjaGFuZ2UgdGhlIGNvbXBvbmVudCBzdGF0dXMgKGJ1dHRvbi9zbGlkZXIvY2hlY2tib3guLi4pXG4gICAqIE11c3QgYmUgZGVmaW5lZCBpbiB0aGUgZGVyaXZlZCBjb21wb25lbnRcbiAgICovXG4gIGdldFN0YXR1c0NvbnRyb2xFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICB0aGlzLmNvbXB1dGVTdGF0dXMoKTtcblxuICAgIHJldHVybiB0aGlzLnN0YXR1c0N0cmxFbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgdGhlIFVJIHRvIGRpc3BsYXkgdGhlIHN0YXR1cyBvZiB0aGUgY29tcG9uZW50IHN0YXR1cyAoaW1hZ2UvbGFiZWwvLi4uKVxuICAgKiBNdXN0IGJlIGRlZmluZWQgaW4gdGhlIGRlcml2ZWQgY29tcG9uZW50XG4gICAqL1xuICBnZXRTdGF0dXNFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICB0aGlzLmNvbXB1dGVTdGF0dXMoKTtcblxuICAgIHJldHVybiB0aGlzLnN0YXR1c0VsO1xuICB9XG5cbiAgLyoqIENvbXB1dGUgdGhlIHN0YXR1cyBvZiB0aGlzIGNvbXBvbmVudFxuICAgKiBUaGlzIG11c3QgYmUgb3ZlcnJpZGRlbiBpbiBhIGRlcml2ZWQgY2xhc3NcbiAgICogVGhpcyBzaG91bGQganVzdCBjaGFuZ2UgdGhlIEhUTUxFbGVtZW50cyBmb3IgZGlzcGxheSBhbmQgY29udHJvbFxuICAgKiBUaGlzIG11c3QgYWxzbyBzZXQgYW4gSUQgdG8gdGhlIEhUTUxFbGVtZW50cyB0aGF0IG5lZWQgdG8gYmUgdXBkYXRlZFxuICAgKi9cbiAgY29tcHV0ZVN0YXR1cygpIHt9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgRE9NIG9mIHRoZSBkb2N1bWVudCByZXBsYWNpbmcgdGhlIG9sZCB2YWx1ZXMgd2l0aCB0aGUgY3VycmVudCBvbmVzXG4gICAqIE11c3QgYmUgY2FsbGVkIGV2ZXJ5dGltZSB0aGUgY29tcG9uZW50IHdhbnRzIHRvIHVwZGF0ZSB0aGUgcGFnZS5cbiAgICogSW50ZXJuYWxseSBjYWxscyBjb21wdXRlU3RhdHVzKCkgYXMgZmlyc3Qgc3RlcFxuICAgKiBJdCBpcyBtYW5kYXRvcnkgdGhhdCB0aGUgdHdvIGVsZW1lbnRzIGhhdmUgYW4gSUQgZGVmaW5lZC4gT3RoZXJ3aXNlIHRoZXkgd2lsbCBub3QgYmUgdXBkYXRlZFxuICAgKi9cbiAgdXBkYXRlRE9NKCkge1xuICAgIHRoaXMuY29tcHV0ZVN0YXR1cygpO1xuXG4gICAgLy8gcmVkcmF3IHRoZSBVSSBqdXN0IHJlcGxhY2luZyB0aGUgZWxlbWVudHMgdGhhdCBoYXMgY2hhbmdlZFxuICAgIGlmICh0aGlzLnN0YXR1c0N0cmxFbCAhPSBudWxsKSB7XG4gICAgICBsZXQgY3VycmVudFN0YXRlQ3RybCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc3RhdHVzQ3RybEVsLmlkKTtcbiAgICAgIGlmIChjdXJyZW50U3RhdGVDdHJsICE9IG51bGwpXG4gICAgICAgIGN1cnJlbnRTdGF0ZUN0cmwucmVwbGFjZVdpdGgodGhpcy5zdGF0dXNDdHJsRWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXR1c0VsICE9IG51bGwpIHtcbiAgICAgIGxldCBjdXJyZW50U3RhdHVzRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN0YXR1c0VsLmlkKTtcbiAgICAgIGlmIChjdXJyZW50U3RhdHVzRWwgIT0gbnVsbCkgY3VycmVudFN0YXR1c0VsLnJlcGxhY2VXaXRoKHRoaXMuc3RhdHVzRWwpO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1jb21wb25lbnRcIiwgQ29tcG9uZW50KTtcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuXG5leHBvcnQgY2xhc3MgQ3VydGFpbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIGdyYWRlczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XG4gICAgdGhpcy5ncmFkZXMgPSAwO1xuICB9XG5cbiAgY2hhbmdlR3JhZGVzKGRhdGEpIHtcbiAgICBjb25zb2xlLmRlYnVnKFwiaW5wdXRcIiwgZGF0YSk7XG4gICAgdGhpcy5ncmFkZXMgPSBkYXRhLnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZURPTSgpO1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBDdXJ0YWluXG4gIGNvbXB1dGVTdGF0dXMoKSB7XG4gICAgLy8gdGhlIHN0YXR1cyBjb250cm9sIGlzIGEgc2xpZGVyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgIGxldCBzbGlkZXJJbnB1dEVsID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHNsaWRlcklucHV0RWwudHlwZSA9IFwicmFuZ2VcIjtcbiAgICBzbGlkZXJJbnB1dEVsLnN0ZXAgPSBcIjEwXCI7XG4gICAgc2xpZGVySW5wdXRFbC5taW4gPSBcIjBcIjtcbiAgICBzbGlkZXJJbnB1dEVsLm1heCA9IFwiMTAwXCI7XG4gICAgc2xpZGVySW5wdXRFbC52YWx1ZSA9IFwiXCIgKyB0aGlzLmdyYWRlcztcbiAgICBzbGlkZXJJbnB1dEVsLm9uY2hhbmdlID0gdiA9PiB0aGlzLmNoYW5nZUdyYWRlcyh2KTtcblxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmlkID0gXCJjdXJ0YWluX2N0cmxfXCIgKyB0aGlzLmlkO1xuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmFwcGVuZENoaWxkKHNsaWRlcklucHV0RWwpO1xuXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImN1cnRhaW5fc3RhdHVzX1wiICsgdGhpcy5pZDtcblxuICAgIC8vIHRoaXMuc3RhdHVzRWwuc3R5bGUubWFyZ2luVG9wID0gXCIwcHhcIjtcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLmdyYWRlcyArIFwiJVwiO1xuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYzVjNWM1XCI7XG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5hbGlnblNlbGYgPSBcInN0YXJ0XCI7XG4gIH1cbn1cblxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tY3VydGFpblwiLCBDdXJ0YWluKTtcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuXG5leHBvcnQgY2xhc3MgRG9vciBleHRlbmRzIENvbXBvbmVudCB7XG4gIG9wZW5lZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xuICAgIHRoaXMub3BlbmVkID0gZmFsc2U7XG4gIH1cblxuICAvLyBjYWxsZWQgYnkgdGhlIGJ1dHRvbiB0byBjaGFuZ2UgdGhlIHN0YXRlXG4gIHRvb2dsZURvb3IoKSB7XG4gICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XG4gICAgdGhpcy51cGRhdGVET00oKTtcbiAgfVxuXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgRG9vclxuICBjb21wdXRlU3RhdHVzKCkge1xuICAgIHRoaXMuc3RhdHVzQ3RybEVsID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1CdXR0b24gc3BlY3RydW0tQnV0dG9uLS1jdGFcIjtcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5vbmNsaWNrID0gZXZ0ID0+IHRoaXMudG9vZ2xlRG9vcigpOyAvL2Fycm93IGZ1bmN0aW9uIGtlZXAgdGhlIGluc3RhbmNlIHN0YXRlXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuaWQgPSBcImRvb3JfY3RybF9cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XG5cbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxTcGFuRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJkb29yX3N0YXR1c19cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XG5cbiAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlXCI7XG4gICAgaWYgKHRoaXMub3BlbmVkKSB7XG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVyVGV4dCA9IFwiT1BFTkVEXCI7XG4gICAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSArPSBcIiBzcGVjdHJ1bS1MYWJlbC0tYmx1ZVwiO1xuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIkNMT1NFXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJUZXh0ID0gXCJDTE9TRURcIjtcbiAgICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lICs9IFwiIHNwZWN0cnVtLUxhYmVsLS1ncmV5XCI7XG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiT1BFTlwiO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1kb29yXCIsIERvb3IpO1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBMaWdodCBleHRlbmRzIENvbXBvbmVudCB7XG4gIG9uOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XG4gICAgdGhpcy5vbiA9IGZhbHNlO1xuICB9XG5cbiAgLy8gY2FsbGVkIGJ5IHRoZSBidXR0b24gdG8gY2hhbmdlIHRoZSBzdGF0ZVxuICB0b29nbGVMaWdodCgpIHtcbiAgICB0aGlzLm9uID0gIXRoaXMub247XG4gICAgdGhpcy51cGRhdGVET00oKTtcbiAgfVxuXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgTGlnaHRcbiAgY29tcHV0ZVN0YXR1cygpIHtcbiAgICB0aGlzLnN0YXR1c0N0cmxFbCA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQnV0dG9uIHNwZWN0cnVtLUJ1dHRvbi0tY3RhXCI7XG4gICAgdGhpcy5zdGF0dXNDdHJsRWwub25jbGljayA9IGV2dCA9PiB0aGlzLnRvb2dsZUxpZ2h0KCk7IC8vYXJyb3cgZnVuY3Rpb24ga2VlcCB0aGUgaW5zdGFuY2Ugc3RhdGVcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwibGlnaHRfY3RybF9cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XG5cbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwibGlnaHRfc3RhdHVzX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcblxuICAgIHRoaXMuc3RhdHVzRWwuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2VcIjtcbiAgICB0aGlzLnN0YXR1c0VsLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICBpZiAodGhpcy5vbikge1xuICAgICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNmZmU2MmJcIjtcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID1cbiAgICAgICAgXCI8bGFiZWwgY2xhc3M9J3NwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZSc+T048L2xhYmVsPlwiO1xuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIlRVUk4gT0ZGXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmV5XCI7XG4gICAgICB0aGlzLnN0YXR1c0VsLmlubmVySFRNTCA9XG4gICAgICAgIFwiPGxhYmVsIGNsYXNzPSdzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2UnPk9GRjwvbGFiZWw+XCI7XG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiVFVSTiBPTlwiO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1saWdodFwiLCBMaWdodCk7XG4iLCJpbXBvcnQgeyBEb29yIH0gZnJvbSBcIi4vZG9vclwiO1xuaW1wb3J0IHsgTGlnaHQgfSBmcm9tIFwiLi9saWdodFwiO1xuaW1wb3J0IHsgQ3VydGFpbiB9IGZyb20gXCIuL2N1cnRhaW5cIjtcbmltcG9ydCB7IENsaW1hIH0gZnJvbSBcIi4vY2xpbWFcIjtcbmltcG9ydCB7IE15Q29tcG9uZW50IH0gZnJvbSBcIi4vbXljb21wb25lbnRcIjtcblxuZnVuY3Rpb24gc2hvd1BhbmVsKCkge1xuICBjb25zdCBjdXJ0YWluc0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJ0YWluc1wiKTtcbiAgY29uc3QgZG9vcnNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZG9vcnNcIik7XG4gIGNvbnN0IGxpZ2h0c0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaWdodHNcIik7XG4gIGNvbnN0IGNsaW1hRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNsaW1hXCIpO1xuXG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXG4gICAgbmV3IERvb3IoXCJkb29yMVwiLCBcIk1haW4gRG9vclwiLCBcIkVudHJhbmNlIGRvb3IsIGFsbGFybWVkXCIpXG4gICk7XG4gIGRvb3JzRWwuYXBwZW5kQ2hpbGQoXG4gICAgbmV3IERvb3IoXCJkb29yMlwiLCBcIkJhY2sgRG9vclwiLCBcIk11c3QgYmUgYWx3YXN5IGNsb3NlZCwgYWxsYXJtZWRcIilcbiAgKTtcbiAgZG9vcnNFbC5hcHBlbmRDaGlsZChcbiAgICBuZXcgRG9vcihcImRvb3IzXCIsIFwiR2FyZGVuIERvb3JcIiwgXCJHYXJkZW4gZG9vciwgdGhpcyBpcyBub3QgYWxsYXJtZWRcIilcbiAgKTtcblxuICBsaWdodHNFbC5hcHBlbmRDaGlsZChuZXcgTGlnaHQoXCJsaWd0aDFcIiwgXCJLaXRjaGVuIGxpZ2h0XCIsIFwiXCIpKTtcbiAgbGlnaHRzRWwuYXBwZW5kQ2hpbGQobmV3IExpZ2h0KFwibGlndGgyXCIsIFwiQmVkcm9vbVwiLCBcIlwiKSk7XG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoM1wiLCBcIkxpdmluZyByb29tXCIsIFwiXCIpKTtcbiAgbGlnaHRzRWwuYXBwZW5kQ2hpbGQobmV3IExpZ2h0KFwibGlndGg1XCIsIFwiQ2hpbGRyZW4gcm9vbVwiLCBcIlwiKSk7XG4gIGxpZ2h0c0VsLmFwcGVuZENoaWxkKG5ldyBMaWdodChcImxpZ3RoNlwiLCBcIk91dGRvb3JcIiwgXCJcIikpO1xuXG4gIGN1cnRhaW5zRWwuYXBwZW5kQ2hpbGQobmV3IEN1cnRhaW4oXCJjdXJ0YWluMVwiLCBcIkVudHJhbmNlXCIsIFwiSG9tZSBlbnRyYW5jZVwiKSk7XG4gIGN1cnRhaW5zRWwuYXBwZW5kQ2hpbGQoXG4gICAgbmV3IEN1cnRhaW4oXCJjdXJ0YWluM1wiLCBcIkxpdmluZyByb29tXCIsIFwibGl2aW5nIHJvb20gY3VydGFpblwiKVxuICApO1xuICBjdXJ0YWluc0VsLmFwcGVuZENoaWxkKG5ldyBDdXJ0YWluKFwiY3VydGFpbjJcIiwgXCJPdXRkb29yXCIsIFwiRnJvbnQgZ2FyZGVuXCIpKTtcblxuICBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBDbGltYShcImNsaW1hMFwiLCBcIktpdGNoZW5cIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xuICBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBDbGltYShcImNsaW1hMVwiLCBcIlJvb21cIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xuICBjbGltYUVsLmFwcGVuZENoaWxkKG5ldyBDbGltYShcImNsaW1hMlwiLCBcIkJhdGhcIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xuXG4gIGNsaW1hRWwuYXBwZW5kQ2hpbGQobmV3IE15Q29tcG9uZW50KFwiY29tcFwiLCBcIm5hbWVcIiwgXCJBdXRvbWF0aWMgdGVtcGVyYXR1cmVcIikpO1xufVxuXG5zaG93UGFuZWwoKTtcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xuXG5leHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0dXM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xuICAgIHRoaXMuc3RhdHVzID0gMDtcbiAgfVxuXG4gIGNsaWNrZWQoKSB7XG4gICAgdGhpcy5zdGF0dXMrKztcbiAgICB0aGlzLnVwZGF0ZURPTSgpO1xuICB9XG5cbiAgY29tcHV0ZVN0YXR1cygpIHtcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxTcGFuRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB0aGlzLnN0YXR1c0VsLmlubmVySFRNTCA9IFwiPGgxPlwiICsgdGhpcy5zdGF0dXMgKyBcIjwvaDE+XCI7XG4gICAgdGhpcy5zdGF0dXNFbC5pZCA9IFwic3RhdHVzX1wiICsgdGhpcy5pZDtcblxuICAgIHRoaXMuc3RhdHVzQ3RybEVsID0gPEhUTUxCdXR0b25FbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgdGhpcy5zdGF0dXNDdHJsRWwub25jbGljayA9IGV2dCA9PiB0aGlzLmNsaWNrZWQoKTtcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiQ0xJQ0tcIjtcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwiY3RybF9cIiArIHRoaXMuaWQ7XG4gIH1cbn1cblxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tbXljb21wb25lbnRcIiwgTXlDb21wb25lbnQpO1xuIl19
