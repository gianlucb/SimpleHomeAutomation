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
        coverDiv.appendChild(this.getStatusElement());
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
        return null;
    }
    /**
     * Define the UI to display the status of the component status (image/label/...)
     * Must be defined in the derived component
     */
    getStatusElement() {
        return null;
    }
}
exports.Component = Component;
window.customElements.define("automation-component", Component);
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("./component");
class Door extends component_1.Component {
    constructor(id, name, description) {
        super(id, name, description);
        this.opened = false;
    }
    // custom state control for a door
    getStatusControlElement() {
        return this.statusButton;
    }
    /* draw the following HTML:
     <span class="spectrum-Label spectrum-Label--large spectrum-Label--blue">Blue Label</span>
    */
    getStatusElement() {
        this.refreshStatus();
        return this.statusEl;
    }
    changeState() {
        this.opened = !this.opened;
        this.refreshStatus();
        // redraw the UI just replacing the elements that changed
        let currentStateButton = document.getElementById(this.statusButton.id);
        currentStateButton.replaceWith(this.statusButton);
        let currentStatusEl = document.getElementById(this.statusEl.id);
        currentStatusEl.replaceWith(this.statusEl);
    }
    /** Compute the status of this component */
    refreshStatus() {
        this.statusButton = document.createElement("button");
        this.statusButton.className = "spectrum-Button spectrum-Button--cta";
        this.statusButton.onclick = evt => this.changeState(); //arrow function keep the instance state
        this.statusButton.id = "ctrl_" + this.id;
        this.statusEl = document.createElement("span");
        this.statusEl.id = "status_" + this.id;
        this.statusEl.className = "spectrum-Label spectrum-Label--large";
        if (this.opened) {
            this.statusEl.innerText = "OPENED";
            this.statusEl.className += " spectrum-Label--blue";
            this.statusButton.textContent = "OPEN";
        }
        else {
            this.statusEl.innerText = "CLOSED";
            this.statusEl.className += " spectrum-Label--grey";
            this.statusButton.textContent = "CLOSE";
        }
    }
}
exports.Door = Door;
window.customElements.define("automation-door", Door);
},{"./component":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const door_1 = require("./door");
function showPanel() {
    const elt = document.getElementById("main");
    for (let i = 0; i < 20; i++) {
        let door = new door_1.Door("" + i, "Main Door", "Entrance door, allarmed");
        elt.appendChild(door);
    }
}
showPanel();
},{"./door":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29tcG9uZW50LnRzIiwic3JjL2Rvb3IudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBWSxjQUlYO0FBSkQsV0FBWSxjQUFjO0lBQ3hCLCtDQUFNLENBQUE7SUFDTixpREFBTyxDQUFBO0lBQ1AsbURBQVEsQ0FBQSxDQUFDLHNCQUFzQjtBQUNqQyxDQUFDLEVBSlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFJekI7QUFFRDs7O0dBR0c7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBRUgsTUFBYSxTQUFVLFNBQVEsV0FBVztJQU94Qzs7Ozs7OztPQU9HO0lBQ0gsWUFBWSxFQUFVLEVBQUUsSUFBWSxFQUFFLFdBQW1CO1FBQ3ZELEtBQUssRUFBRSxDQUFDO1FBQ1IsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELGlCQUFpQjtRQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELFdBQVc7UUFDVCw2QkFBNkI7UUFFN0IsSUFBSSxPQUFPLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztRQUNuQyxPQUFPLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQztRQUVwQyxJQUFJLFFBQVEsR0FBbUIsUUFBUSxD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QUFTLElBQUksdUJBQXVCLENBQUM7WUFDbkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQ3hDO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLElBQUksdUJBQXVCLENBQUM7WUFDbkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztDQUNGO0FBeERELG9CQXdEQztBQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDOzs7O0FDNUR0RCxpQ0FBOEI7QUFHOUIsU0FBUyxTQUFTO0lBQ2hCLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQixJQUFJLElBQUksR0FBRyxJQUFJLFdBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3BFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDdkI7QUFDSCxDQUFDO0FBRUQsU0FBUyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgZW51bSBDb21wb25lbnRTdGF0ZSB7XHJcbiAgT24gPSAwLFxyXG4gIE9mZiA9IDEsXHJcbiAgTm9uZSA9IDIgLy9tZWFucyBkb2VzIG5vdCBhcHBseVxyXG59XHJcblxyXG4vKipcclxuICogQmFzaWMgQXV0b21hdGlvbiBDb21wb25lbnQuIERyYXcgaXRzZWxmIGFzIGEgU3BlY3RydW0gY2FyZFxyXG4gKiBEZWZpbmVzIHNvbWUgZXh0ZW5zaW9uIHBvaW50cyB3aGVyZSB0byBob29rIHRvIG1hbmFnZSB0aGUgY29tcG9uZW50IHN0YXR1c1xyXG4gKi9cclxuXHJcbi8qXHJcbiBIVE1MIGNyZWF0ZWQgYnkgdGhpcyBlbGVtZW50XHJcbiA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZFwiIHN0eWxlPVwid2lkdGg6IDIwOHB4O1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtY292ZXJQaG90b1wiPlxyXG4gICAgICBDT1ZFUlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1ib2R5XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLXRpdGxlXCI+Q29tcG9uZW50TmFtZTwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzcGVjdHJ1bS1DYXJkLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNwZWN0cnVtLUNhcmQtc3VidGl0bGVcIj5kZXNjcmlwdGlvbjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwic3BlY3RydW0tQ2FyZC1mb290ZXJcIj5cclxuICAgICAgICBGT09URVJcclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuICovXHJcblxyXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gIC8vZmllbGRcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgZGVzY3JpcHRpb246IHN0cmluZztcclxuICBlbmFibGVkOiBib29sZWFuO1xyXG4gIGlkOiBzdHJpbmc7XHJcblxyXG4gIC8qKlxyXG4gICAqIEJhc2UgY29tcG9uZW50LCBnZW5lcmljIGNsYXNzIHRvIHVzZSBhcyBwYXJlbnQuXHJcbiAgICogRWFjaCBkZXJpdmVkIGNvbXBvbmVudCBzaG91bGQgZGVmaW5lIGl0cyBzdGF0dXMgcmVwcmVzZW50YXRpb24gYW5kIHN0YXR1cyBjb250cm9sIGVsZW1lbnRzXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmFtZSBkaXNwbGF5IG5hbWVcclxuICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gZGVzY3JpcHRpb24gb2YgdGhlIGNvbXBvbmVudFxyXG4gICAqIEBwYXJhbSBpZCBtdXN0IGJlIHVuaXF1ZSBpbiB0aGUgRE9NXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgLy90b2RvOiBjaGVjayBpbnB1dCB2YWxpZGF0aW9uXHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xyXG4gICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmdldFRlbXBsYXRlKCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGVtcGxhdGUoKSB7XHJcbiAgICAvLyBkcmF3IGEgYmFzaWMgU3BlY3RydW0gQ2FyZFxyXG5cclxuICAgIGxldCBjYXJkRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjYXJkRGl2LnN0eWxlLndpZHRoID0gXCIyMDhweFwiO1xyXG4gICAgY2FyZERpdi5zdHlsZS5tYXJnaW4gPSBcIjI1cHggMjVweFwiO1xyXG4gICAgY2FyZERpdi5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUNhcmRcIjtcclxuXHJcbiAgICBsZXQgY292ZXJEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvdmVyRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1jb3ZlclBob3RvXCI7XHJcbiAgICBjb3ZlckRpdi5hcHBlbmRDaGlsZCh0aGlzLmdldFN0YXR1c0VsZW1lbnQoKSk7XHJcblxyXG4gICAgbGV0IGJvZHlEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGJvZHlEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWJvZHlcIjtcclxuXHJcbiAgICBsZXQgaGVhZGVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBoZWFkZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWhlYWRlclwiO1xyXG5cclxuICAgIGxldCB0aXRsZURpdiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgdGl0bGVEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLXRpdGxlXCI7XHJcbiAgICB0aXRsZURpdi5pbm5lclRleHQgPSB0aGlzLm5hbWU7XHJcblxyXG4gICAgbGV0IGNvbnRlbnREaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvbnRlbnREaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWNvbnRlbnRcIjtcclxuXHJcbiAgICBsZXQgc3VidGl0bGVEaXYgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHN1YnRpdGxlRGl2LmNsYXNzTmFtZSA9IFwic3BlY3RydW0tQ2FyZC1zdWJ0aXRsZVwiO1xyXG4gICAgc3VidGl0bGVEaXYuaW5uZXJUZXh0ID0gdGhpcy5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICBsZXQgZm9vdGVyRGl2ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBmb290ZXJEaXYuY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1DYXJkLWZvb3RlclwiO1xyXG5cclxuICAgIGxldCBzdGF0dXNDb250cm9sRWxlbWVudCA9IHRoaXMuZ2V0U3RhdHVzQ29udHJvbEVsZW1lbnQoKTtcclxuICAgIGlmIChzdGF0dXNDb250cm9sRWxlbWVudCAhPSBudWxsKVxyXG4gICAgICBmb290ZXJEaXYuYXBwZW5kQ2hpbGQoc3RhdHVzQ29udHJvbEVsZW1lbnQpO1xyXG5cclxuICAgIGNvbnRlbnREaXYuYXBwZW5kQ2hpbGQoc3VidGl0bGVEaXYpO1xyXG4gICAgaGVhZGVyRGl2LmFwcGVuZENoaWxkKHRpdGxlRGl2KTtcclxuICAgIGJvZHlEaXYuYXBwZW5kQ2hpbGQoaGVhZGVyRGl2KTtcclxuICAgIGJvZHlEaXYuYXBwZW5kQ2hpbGQoY29udGVudERpdik7XHJcblxyXG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChjb3ZlckRpdik7XHJcbiAgICBjYXJkRGl2LmFwcGVuZENoaWxkKGJvZHlEaXYpO1xyXG4gICAgY2FyZERpdi5hcHBlbmRDaGlsZChmb290ZXJEaXYpO1xyXG5cclxuICAgIHJldHVybiBjYXJkRGl2O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIHRoZSBjb250cm9sIHRvIHVzZSB0byBjaGFuZ2UgdGhlIGNvbXBvbmVudCBzdGF0dXMgKGJ1dHRvbi9zbGlkZXIvY2hlY2tib3guLi4pXHJcbiAgICogTXVzdCBiZSBkZWZpbmVkIGluIHRoZSBkZXJpdmVkIGNvbXBvbmVudFxyXG4gICAqL1xyXG4gIGdldFN0YXR1c0NvbnRyb2xFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVmaW5lIHRoZSBVSSB0byBkaXNwbGF5IHRoZSBzdGF0dXMgb2YgdGhlIGNvbXBvbmVudCBzdGF0dXMgKGltYWdlL2xhYmVsLy4uLilcclxuICAgKiBNdXN0IGJlIGRlZmluZWQgaW4gdGhlIGRlcml2ZWQgY29tcG9uZW50XHJcbiAgICovXHJcbiAgZ2V0U3RhdHVzRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdXRvbWF0aW9uLWNvbXBvbmVudFwiLCBDb21wb25lbnQpO1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEb29yIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICBzdGF0dXNCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG4gIG9wZW5lZDogYm9vbGVhbjtcclxuICBzdGF0dXNFbDogSFRNTFNwYW5FbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcpIHtcclxuICAgIHN1cGVyKGlkLCBuYW1lLCBkZXNjcmlwdGlvbik7XHJcbiAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgLy8gY3VzdG9tIHN0YXRlIGNvbnRyb2wgZm9yIGEgZG9vclxyXG4gIGdldFN0YXR1c0NvbnRyb2xFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLnN0YXR1c0J1dHRvbjtcclxuICB9XHJcblxyXG4gIC8qIGRyYXcgdGhlIGZvbGxvd2luZyBIVE1MOlxyXG4gICA8c3BhbiBjbGFzcz1cInNwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZSBzcGVjdHJ1bS1MYWJlbC0tYmx1ZVwiPkJsdWUgTGFiZWw8L3NwYW4+XHJcbiAgKi9cclxuICBnZXRTdGF0dXNFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHRoaXMucmVmcmVzaFN0YXR1cygpO1xyXG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzRWw7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VTdGF0ZSgpIHtcclxuICAgIHRoaXMub3BlbmVkID0gIXRoaXMub3BlbmVkO1xyXG5cclxuICAgIHRoaXMucmVmcmVzaFN0YXR1cygpO1xyXG5cclxuICAgIC8vIHJlZHJhdyB0aGUgVUkganVzdCByZXBsYWNpbmcgdGhlIGVsZW1lbnRzIHRoYXQgY2hhbmdlZFxyXG4gICAgbGV0IGN1cnJlbnRTdGF0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc3RhdHVzQnV0dG9uLmlkKTtcclxuICAgIGN1cnJlbnRTdGF0ZUJ1dHRvbi5yZXBsYWNlV2l0aCh0aGlzLnN0YXR1c0J1dHRvbik7XHJcblxyXG4gICAgbGV0IGN1cnJlbnRTdGF0dXNFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc3RhdHVzRWwuaWQpO1xyXG4gICAgY3VycmVudFN0YXR1c0VsLnJlcGxhY2VXaXRoKHRoaXMuc3RhdHVzRWwpO1xyXG4gIH1cclxuXHJcbiAgLyoqIENvbXB1dGUgdGhlIHN0YXR1cyBvZiB0aGlzIGNvbXBvbmVudCAqL1xyXG4gIHJlZnJlc2hTdGF0dXMoKSB7XHJcbiAgICB0aGlzLnN0YXR1c0J1dHRvbiA9IDxIVE1MQnV0dG9uRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgdGhpcy5zdGF0dXNCdXR0b24uY2xhc3NOYW1lID0gXCJzcGVjdHJ1bS1CdXR0b24gc3BlY3RydW0tQnV0dG9uLS1jdGFcIjtcclxuICAgIHRoaXMuc3RhdHVzQnV0dG9uLm9uY2xpY2sgPSBldnQgPT4gdGhpcy5jaGFuZ2VTdGF0ZSgpOyAvL2Fycm93IGZ1bmN0aW9uIGtlZXAgdGhlIGluc3RhbmNlIHN0YXRlXHJcbiAgICB0aGlzLnN0YXR1c0J1dHRvbi5pZCA9IFwiY3RybF9cIiArIHRoaXMuaWQ7XHJcblxyXG4gICAgdGhpcy5zdGF0dXNFbCA9IDxIVE1MU3BhbkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB0aGlzLnN0YXR1c0VsLmlkID0gXCJzdGF0dXNfXCIgKyB0aGlzLmlkO1xyXG4gICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgPSBcInNwZWN0cnVtLUxhYmVsIHNwZWN0cnVtLUxhYmVsLS1sYXJnZVwiO1xyXG4gICAgaWYgKHRoaXMub3BlbmVkKSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJUZXh0ID0gXCJPUEVORURcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgKz0gXCIgc3BlY3RydW0tTGFiZWwtLWJsdWVcIjtcclxuICAgICAgdGhpcy5zdGF0dXNCdXR0b24udGV4dENvbnRlbnQgPSBcIk9QRU5cIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc3RhdHVzRWwuaW5uZXJUZXh0ID0gXCJDTE9TRURcIjtcclxuICAgICAgdGhpcy5zdGF0dXNFbC5jbGFzc05hbWUgKz0gXCIgc3BlY3RydW0tTGFiZWwtLWdyZXlcIjtcclxuICAgICAgdGhpcy5zdGF0dXNCdXR0b24udGV4dENvbnRlbnQgPSBcIkNMT1NFXCI7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXV0b21hdGlvbi1kb29yXCIsIERvb3IpO1xyXG4iLCJpbXBvcnQgeyBEb29yIH0gZnJvbSBcIi4vZG9vclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRcIjtcclxuXHJcbmZ1bmN0aW9uIHNob3dQYW5lbCgpIHtcclxuICBjb25zdCBlbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIik7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xyXG4gICAgbGV0IGRvb3IgPSBuZXcgRG9vcihcIlwiICsgaSwgXCJNYWluIERvb3JcIiwgXCJFbnRyYW5jZSBkb29yLCBhbGxhcm1lZFwiKTtcclxuICAgIGVsdC5hcHBlbmRDaGlsZChkb29yKTtcclxuICB9XHJcbn1cclxuXHJcbnNob3dQYW5lbCgpO1xyXG4iXX0=
