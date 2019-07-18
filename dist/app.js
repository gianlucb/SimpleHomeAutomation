(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
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
},{"./component":1}],3:[function(require,module,exports){
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
},{"./component":1}],4:[function(require,module,exports){
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
},{"./component":1}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const door_1 = require("./door");
const light_1 = require("./light");
const curtain_1 = require("./curtain");
function showPanel() {
    const elt = document.getElementById("main");
    for (let i = 0; i < 5; i++) {
        let door = new door_1.Door("" + i, "Main Door", "Entrance door, allarmed");
        elt.appendChild(door);
    }
    for (let i = 0; i < 5; i++) {
        let light = new light_1.Light("" + i, "Main Light", "Entrance");
        elt.appendChild(light);
    }
    for (let i = 0; i < 3; i++) {
        let curtain = new curtain_1.Curtain("" + i, "Main curtain", "Entrance");
        elt.appendChild(curtain);
    }
}
showPanel();
},{"./curtain":2,"./door":3,"./light":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50LnRzIiwic3JjL2N1cnRhaW4udHMiLCJzcmMvZG9vci50cyIsInNyYy9saWdodC50cyIsInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFZLGNBSVg7QUFKRCxXQUFZLGNBQWM7SUFDeEIsK0NBQU0sQ0FBQTtJQUNOLGlEQUFPLENBQUE7SUFDUCxtREFBUSxDQUFBLENBQUMsc0JBQXNCO0FBQ2pDLENBQUMsRUFKVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUl6QjtBQUVEOzs7R0FHRztBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFFSCxNQUFhLFNBQVUsU0FBUSxXQUFXO0lBU3hDOzs7Ozs7O09BT0c7SUFDSCxZQUFZLEVBQVUsRUFBRSxJQUFZLEVBQUUsV0FBbUI7UUFDdkQsS0FBSyxFQUFFLENBQUM7UUFDUiw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsV0FBVztRQUNULDZCQUE2QjtRQUU3QixJQUFJLE9BQU8sR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsZUFBZSxD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QUFDO1FBQ3BFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdkI7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLElBQUksS0FBSyxHQUFHLElBQUksYUFBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDeEI7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzFCLElBQUksT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM5RCxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFCO0FBQ0gsQ0FBQztBQUVELFNBQVMsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGVudW0gQ29tcG9uZW50U3RhdGUge1xyXG4gIE9uID0gMCxcclxuICBPZmYgPSAxLFxyXG4gIE5vbmUgPSAyIC8vbWVhbnMgZG9lcyBub3QgYXBwbHlcclxufVxyXG5cclxuLyoqXHJcbiAqIEJhc2ljIEF1dG9tYXRpb24gQ29tcG9uZW50LiBEcmF3IGl0c2VsZiBhcyBhIFNwZWN0cnVtIGNhcmRcclxuICogRGVmaW5lcyBzb21lIGV4dGVuc2lvbiBwb2ludHMgd2hlcmUgdG8gaG9vayB0byBtYW5hZ2UgdGhlIGNvbXBvbmVudCBzdGF0dXNcclxuICovXHJcblxyXG4vKlxyXG4gSFRNTCBjcmVhdGVkIGJ5IHRoaXMgZWxlbWVudFxyXG4gPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmRcIiBzdHlsZT1cIndpZHRoOiAyMDhweDtcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWNvdmVyUGhvdG9cIj5cclxuICAgICAgQ09WRVJcclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtYm9keVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC10aXRsZVwiPkNvbXBvbmVudE5hbWU8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1jb250ZW50XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLXN1YnRpdGxlXCI+ZGVzY3JpcHRpb248L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtZm9vdGVyXCI+XHJcbiAgICAgICAgRk9PVEVSXHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBlbmFibGVkOiBib29sZWFuO1xyXG4gIGlkOiBzdHJpbmc7XHJcblxyXG4gIHN0YXR1c0N0cmxFbDogSFRNTEVsZW1lbnQ7XHJcbiAgc3RhdHVzRWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAvKipcclxuICAgKiBCYXNlIGNvbXBvbmVudCwgZ2VuZXJpYyBjbGFzcyB0byB1c2UgYXMgcGFyZW50LlxyXG4gICAqIEVhY2ggZGVyaXZlZCBjb21wb25lbnQgc2hvdWxkIGRlZmluZSBpdHMgc3RhdHVzIHJlcHJlc2VudGF0aW9uIGFuZCBzdGF0dXMgY29udHJvbCBlbGVtZW50c1xyXG4gICAqXHJcbiAgICogQHBhcmFtIG5hbWUgZGlzcGxheSBuYW1lXHJcbiAgICogQHBhcmFtIGRlc2NyaXB0aW9uIGRlc2NyaXB0aW9uIG9mIHRoZSBjb21wb25lbnRcclxuICAgKiBAcGFyYW0gaWQgbXVzdCBiZSB1bmlxdWUgaW4gdGhlIERPTVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZykge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIC8vdG9kbzogY2hlY2sgaW5wdXQgdmFsaWRhdGlvblxyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBjb25uZWN0ZWRDYWxsYmFjaygpIHtcclxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5nZXRUZW1wbGF0ZSgpKTtcclxuICB9XHJcblxyXG4gIGdldFRlbXBsYXRlKCkge1xyXG4gICAgLy8gZHJhdyBhIGJhc2ljIFNwZWN0cnVtIENhcmRcclxuXHJcbiAgICBsZXQgY2FyZERpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY2FyZERpdi5zdHlsZS53aWR0aCA9IFwiMjA4cHhcIjtcclxuICAgIGNhcmREaXYuc3R5bGUubWFyZ2luID0gXCIyNXB4IDI1cHhcIjtcclxuICAgIGNhcmREaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkXCI7XHJcblxyXG4gICAgbGV0IGNvdmVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjb3ZlckRpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmQtY292ZXJQaG90b1wiO1xyXG4gICAgY292ZXJEaXYuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XHJcbiAgICBsZXQgc3RhdHVzRWxlbWVudCA9IHRoaXMuZ2V0U3RhdHVzRWxlbWVudCgpO1xyXG4gICAgaWYgKHN0YXR1c0VsZW1lbnQgIT0gbnVsbCkgY292ZXJEaXYuYXBwZW5kQ2hpbGQoc3RhdHVzRWxlbWVudCk7XHJcblxyXG4gICAgbGV0IGJvZHlEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJvZHlEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWJvZHlcIjtcclxuXHJcbiAgICBsZXQgaGVhZGVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBoZWFkZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWhlYWRlclwiO1xyXG5cclxuICAgIGxldCB0aXRsZURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGl0bGVEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLXRpdGxlXCI7XHJcbiAgICB0aXRsZURpdi5pbm5lclRleHQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgbGV0IGNvbnRlbnREaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvbnRlbnREaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWNvbnRlbnRcIjtcclxuXHJcbiAgICBsZXQgc3VidGl0bGVEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHN1YnRpdGxlRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1zdWJ0aXRsZVwiO1xyXG4gICAgc3VidGl0bGVEaXYuaW5uZXJUZXh0ID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICBsZXQgZm9vdGVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBmb290ZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWZvb3RlclwiO1xyXG5cclxuICAgIGxldCBzdGF0dXNDb250cm9sRWxlbWVudCA9IHRoaXMuZ2V0U3RhdHVzQ29udHJvbEVsZW1lbnQoKTtcclxuICAgIGlmIChzdGF0dXNDb250cm9sRWxlbWVudCAhPSBudWxsKVxyXG4gICAgICBmb290ZXJEaXYuYXBwZW5kQ2hpbGQoc3RhdHVzQ29udHJvbEVsZW1lbnQpO1xyXG5cclxuICAgIGNvbnRlbnREaXYuYXBwZW5kQ2hpbGQoc3VidGl0bGVEaXYpO1xyXG4gICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcclxuICAgIGJvZHlEaXYuYXBwZW5kQ2hpbGQoaGVhZGVyRGl2KTtcclxuICAgIGJvZHlEaXYuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XHJcblxyXG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChjb3ZlckRpdik7XHJcbiAgICBjYXJkRGl2LmFwcGVuZENoaWxkKGJvZHlEaXYpO1xyXG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChmb290ZXJEaXYpO1xyXG5cclxuICAgIHJldHVybiBjYXJkRGl2O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIHRoZSBjb250cm9sIHRvIHVzZSB0byBjaGFuZ2UgdGhlIGNvbXBvbmVudCBzdGF0dXMgKGJ1dHRvbi9zbGlkZXIvY2hlY2tib3guLi4pXHJcbiAgICogTXVzdCBiZSBkZWZpbmVkIGluIHRoZSBkZXJpdmVkIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldFN0YXR1c0NvbnRyb2xFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLnN0YXR1c0N0cmxFbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlZmluZSB0aGUgVUkgdG8gZGlzcGxheSB0aGUgc3RhdHVzIG9mIHRoZSBjb21wb25lbnQgc3RhdHVzIChpbWFnZS9sYWJlbC8uLi4pXHJcbiAgICogTXVzdCBiZSBkZWZpbmVkIGluIHRoZSBkZXJpdmVkIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldFN0YXR1c0VsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgdGhpcy5jb21wdXRlU3RhdHVzKCk7XHJcbiAgICByZXR1cm4gdGhpcy5zdGF0dXNFbDtcclxuICB9XHJcblxyXG4gIC8qKiBDb21wdXRlIHRoZSBzdGF0dXMgb2YgdGhpcyBjb21wb25lbnRcclxuICAgKiBUaGlzIG11c3QgYmUgb3ZlcnJpZGRlbiBpbiBhIGRlcml2ZWQgY2xhc3NcclxuICAgKiBUaGlzIHNob3VsZCBqdXN0IGNoYW5nZSB0aGUgSFRNTEVsZW1lbnRzIGZvciBkaXNwbGF5IGFuZCBjb250cm9sXHJcbiAgICogVGhpcyBtdXN0IGFsc28gc2V0IGFuIElEIHRvIHRoZSBIVE1MRWxlbWVudHMgdGhhdCBuZWVkcyB0byBiZSB1cGRhdGVkXHJcbiAgICovXHJcbiAgY29tcHV0ZVN0YXR1cygpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgRE9NIG9mIHRoZSBkb2N1bWVudCByZXBsYWNpbmcgdGhlIG9sZCB2YWx1ZXMgd2l0aCB0aGUgY3VycmVudCBvbmVzXHJcbiAgICogTXVzdCBiZSBjYWxsZWQgZXZlcnl0aW1lIHRoZSBjb21wb25lbnQgd2FudHMgdG8gdXBkYXRlIHRoZSBwYWdlLlxyXG4gICAqIEludGVybmFsbHkgY2FsbHMgY29tcHV0ZVN0YXR1cygpIGFzIGZpcnN0IHN0ZXBcclxuICAgKiBJdCBpcyBtYW5kYXRvcnkgdGhhdCB0aGUgdHdvIGVsZW1lbnRzIGhhdmUgYW4gSUQgZGVmaW5lZC4gT3RoZXJ3aXNlIHRoZXkgd2lsbCBub3QgYmUgdXBkYXRlZFxyXG4gICAqL1xyXG4gIHVwZGF0ZURPTSgpIHtcclxuICAgIHRoaXMuY29tcHV0ZVN0YXR1cygpO1xyXG5cclxuICAgIC8vIHJlZHJhdyB0aGUgVUkganVzdCByZXBsYWNpbmcgdGhlIGVsZW1lbnRzIHRoYXQgaGFzIGNoYW5nZWRcclxuICAgIGlmICh0aGlzLnN0YXR1c0N0cmxFbCAhPSBudWxsKSB7XHJcbiAgICAgIGxldCBjdXJyZW50U3RhdGVDdHJsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zdGF0dXNDdHJsRWwuaWQpO1xyXG4gICAgICBpZiAoY3VycmVudFN0YXRlQ3RybCAhPSBudWxsKVxyXG4gICAgICAgIGN1cnJlbnRTdGF0ZUN0cmwucmVwbGFjZVdpdGgodGhpcy5zdGF0dXNDdHJsRWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnN0YXR1c0VsICE9IG51bGwpIHtcclxuICAgICAgbGV0IGN1cnJlbnRTdGF0dXNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc3RhdHVzRWwuaWQpO1xyXG4gICAgICBpZiAoY3VycmVudFN0YXR1c0VsICE9IG51bGwpIGN1cnJlbnRTdGF0dXNFbC5yZXBsYWNlV2l0aCh0aGlzLnN0YXR1c0VsKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWNvbXBvbmVudFwiLCBDb21wb25lbnQpO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDdXJ0YWluIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBncmFkZXM6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xyXG4gICAgdGhpcy5ncmFkZXMgPSAwO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlR3JhZGVzKGRhdGEpIHtcclxuICAgIGNvbnNvbGUuZGVidWcoXCJpbnB1dFwiLCBkYXRhKTtcclxuICAgIHRoaXMuZ3JhZGVzID0gZGF0YS50YXJnZXQudmFsdWU7XHJcbiAgICB0aGlzLnVwZGF0ZURPTSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gb3ZlcnJpZGUgd2l0aCB0aGUgc3BlY2lmaWMgYmVoYXZpb3Igb2YgYSBDdXJ0YWluXHJcbiAgY29tcHV0ZVN0YXR1cygpIHtcclxuICAgIC8vIHRoZSBzdGF0dXMgY29udHJvbCBpcyBhIHNsaWRlclxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICBsZXQgc2xpZGVySW5wdXRFbCA9IDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgIHNsaWRlcklucHV0RWwudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgIHNsaWRlcklucHV0RWwuc3RlcCA9IFwiMTBcIjtcclxuICAgIHNsaWRlcklucHV0RWwubWluID0gXCIwXCI7XHJcbiAgICBzbGlkZXJJbnB1dEVsLm1heCA9IFwiMTAwXCI7XHJcbiAgICBzbGlkZXJJbnB1dEVsLnZhbHVlID0gXCJcIiArIHRoaXMuZ3JhZGVzO1xyXG4gICAgc2xpZGVySW5wdXRFbC5vbmNoYW5nZSA9IHYgPT4gdGhpcy5jaGFuZ2VHcmFkZXModik7XHJcblxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuaWQgPSBcImN1cnRhaW5fY3RybF9cIiArIHRoaXMuaWQ7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5hcHBlbmRDaGlsZChzbGlkZXJJbnB1dEVsKTtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJjdXJ0YWluX3N0YXR1c19cIiArIHRoaXMuaWQ7XHJcblxyXG4gICAgLy8gdGhpcy5zdGF0dXNFbC5zdHlsZS5tYXJnaW5Ub3AgPSBcIjBweFwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLmdyYWRlcyArIFwiJVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNjNWM1YzVcIjtcclxuICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYWxpZ25TZWxmID0gXCJzdGFydFwiO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LmN1c3RvbUVsZW1lbnRzLmRlZmluZShcImF1dG9tYXRpb24tY3VydGFpblwiLCBDdXJ0YWluKTtcclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRG9vciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgb3BlbmVkOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLy8gY2FsbGVkIGJ5IHRoZSBidXR0b24gdG8gY2hhbmdlIHRoZSBzdGF0ZVxyXG4gIHRvb2dsZURvb3IoKSB7XHJcbiAgICB0aGlzLm9wZW5lZCA9ICF0aGlzLm9wZW5lZDtcclxuICAgIHRoaXMudXBkYXRlRE9NKCk7XHJcbiAgfVxyXG5cclxuICAvLyBvdmVycmlkZSB3aXRoIHRoZSBzcGVjaWZpYyBiZWhhdmlvciBvZiBhIERvb3JcclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQnV0dG9uIHNwZWN0cnVtLUJ1dHRvbi0tY3RhXCI7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5vbmNsaWNrID0gZXZ0ID0+IHRoaXMudG9vZ2xlRG9vcigpOyAvL2Fycm93IGZ1bmN0aW9uIGtlZXAgdGhlIGluc3RhbmNlIHN0YXRlXHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5pZCA9IFwiZG9vcl9jdHJsX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsID0gPEhUTUxTcGFuRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImRvb3Jfc3RhdHVzX1wiICsgdGhpcy5pZDsgLy90byBiZSBhYmxlIHRvIHJldHJpZXZlIHRoZW0gZnJvbSB0aGUgZG9jdW1lbnRcclxuXHJcbiAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlXCI7XHJcbiAgICBpZiAodGhpcy5vcGVuZWQpIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lclRleHQgPSBcIk9QRU5FRFwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0VsLmNsYXNzTmFtZSArPSBcIiBzcGVjdHJ1bS1MYWJlbC0tYmx1ZVwiO1xyXG4gICAgICB0aGlzLnN0YXR1c0N0cmxFbC50ZXh0Q29udGVudCA9IFwiQ0xPU0VcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJUZXh0ID0gXCJDTE9TRURcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgKz0gXCIgc3BlY3RydW0tTGFiZWwtLWdyZXlcIjtcclxuICAgICAgdGhpcy5zdGF0dXNDdHJsRWwudGV4dENvbnRlbnQgPSBcIk9QRU5cIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWRvb3JcIiwgRG9vcik7XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExpZ2h0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBvbjogYm9vbGVhbjtcclxuXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcihpZCwgbmFtZSwgZGVzY3JpcHRpb24pO1xyXG4gICAgdGhpcy5vbiA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLy8gY2FsbGVkIGJ5IHRoZSBidXR0b24gdG8gY2hhbmdlIHRoZSBzdGF0ZVxyXG4gIHRvb2dsZUxpZ2h0KCkge1xyXG4gICAgdGhpcy5vbiA9ICF0aGlzLm9uO1xyXG4gICAgdGhpcy51cGRhdGVET00oKTtcclxuICB9XHJcblxyXG4gIC8vIG92ZXJyaWRlIHdpdGggdGhlIHNwZWNpZmljIGJlaGF2aW9yIG9mIGEgTGlnaHRcclxuICBjb21wdXRlU3RhdHVzKCkge1xyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwgPSA8SFRNTEJ1dHRvbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgIHRoaXMuc3RhdHVzQ3RybEVsLmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQnV0dG9uIHNwZWN0cnVtLUJ1dHRvbi0tY3RhXCI7XHJcbiAgICB0aGlzLnN0YXR1c0N0cmxFbC5vbmNsaWNrID0gZXZ0ID0+IHRoaXMudG9vZ2xlTGlnaHQoKTsgLy9hcnJvdyBmdW5jdGlvbiBrZWVwIHRoZSBpbnN0YW5jZSBzdGF0ZVxyXG4gICAgdGhpcy5zdGF0dXNDdHJsRWwuaWQgPSBcImxpZ2h0X2N0cmxfXCIgKyB0aGlzLmlkOyAvL3RvIGJlIGFibGUgdG8gcmV0cmlldmUgdGhlbSBmcm9tIHRoZSBkb2N1bWVudFxyXG5cclxuICAgIHRoaXMuc3RhdHVzRWwgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHRoaXMuc3RhdHVzRWwuaWQgPSBcImxpZ2h0X3N0YXR1c19cIiArIHRoaXMuaWQ7IC8vdG8gYmUgYWJsZSB0byByZXRyaWV2ZSB0aGVtIGZyb20gdGhlIGRvY3VtZW50XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIGlmICh0aGlzLm9uKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmZlNjJiXCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJIVE1MID1cclxuICAgICAgICBcIjxsYWJlbCBjbGFzcz0nc3BlY3RydW0tTGFiZWwgc3BlY3RydW0tTGFiZWwtLWxhcmdlJz5PTjwvbGFiZWw+XCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzQ3RybEVsLnRleHRDb250ZW50ID0gXCJUVVJOIE9GRlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyZXlcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5pbm5lckhUTUwgPVxyXG4gICAgICAgIFwiPGxhYmVsIGNsYXNzPSdzcGVjdHJ1bS1MYWJlbCBzcGVjdHJ1bS1MYWJlbC0tbGFyZ2UnPk9GRjwvbGFiZWw+XCI7XHJcbiAgICAgIHRoaXMuc3RhdHVzQ3RybEVsLnRleHRDb250ZW50ID0gXCJUVVJOIE9OXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1saWdodFwiLCBMaWdodCk7XHJcbiIsImltcG9ydCB7IERvb3IgfSBmcm9tIFwiLi9kb29yXCI7XHJcbmltcG9ydCB7IExpZ2h0IH0gZnJvbSBcIi4vbGlnaHRcIjtcclxuaW1wb3J0IHsgQ3VydGFpbiB9IGZyb20gXCIuL2N1cnRhaW5cIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50XCI7XHJcblxyXG5mdW5jdGlvbiBzaG93UGFuZWwoKSB7XHJcbiAgY29uc3QgZWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgbGV0IGRvb3IgPSBuZXcgRG9vcihcIlwiICsgaSwgXCJNYWluIERvb3JcIiwgXCJFbnRyYW5jZSBkb29yLCBhbGxhcm1lZFwiKTtcclxuICAgIGVsdC5hcHBlbmRDaGlsZChkb29yKTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICBsZXQgbGlnaHQgPSBuZXcgTGlnaHQoXCJcIiArIGksIFwiTWFpbiBMaWdodFwiLCBcIkVudHJhbmNlXCIpO1xyXG4gICAgZWx0LmFwcGVuZENoaWxkKGxpZ2h0KTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICBsZXQgY3VydGFpbiA9IG5ldyBDdXJ0YWluKFwiXCIgKyBpLCBcIk1haW4gY3VydGFpblwiLCBcIkVudHJhbmNlXCIpO1xyXG4gICAgZWx0LmFwcGVuZENoaWxkKGN1cnRhaW4pO1xyXG4gIH1cclxufVxyXG5cclxuc2hvd1BhbmVsKCk7XHJcbiJdfQ==
