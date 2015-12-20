tui.util.defineNamespace("fedoc.content", {});
fedoc.content["core_drag.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview General drag handler\n * @author NHN Ent. FE Development Team &lt;dl_javascript@nhnent.com>\n */\n'use strict';\n\nvar util = global.tui.util;\nvar domutil = require('./domutil');\nvar domevent = require('./domevent');\n\n/**\n * @constructor\n * @mixes CustomEvents\n * @param {object} options - options for drag handler\n * @param {number} [options.distance=10] - distance in pixels after mouse must move before dragging should start\n * @param {HTMLElement} container - container element to bind drag events\n */\nfunction Drag(options, container) {\n    domevent.on(container, 'mousedown', this._onMouseDown, this);\n\n    this.options = util.extend({\n        distance: 10\n    }, options);\n\n    /**\n     * @type {HTMLElement}\n     */\n    this.container = container;\n\n    /**\n     * @type {boolean}\n     */\n    this._isMoved = false;\n\n    /**\n     * dragging distance in pixel between mousedown and firing dragStart events\n     * @type {number}\n     */\n    this._distance = 0;\n\n    /**\n     * @type {boolean}\n     */\n    this._dragStartFired = false;\n\n    /**\n     * @type {object}\n     */\n    this._dragStartEventData = null;\n}\n\n/**\n * Destroy method.\n */\nDrag.prototype.destroy = function() {\n    domevent.off(this.container, 'mousedown', this._onMouseDown, this);\n\n    this.options = this.container = this._isMoved = this._distance =\n        this._dragStartFired = this._dragStartEventData = null;\n};\n\n/**\n * Toggle events for mouse dragging.\n * @param {boolean} toBind - bind events related with dragging when supplied \"true\"\n */\nDrag.prototype._toggleDragEvent = function(toBind) {\n    var container = this.container,\n        domMethod,\n        method;\n\n    if (toBind) {\n        domMethod = 'on';\n        method = 'disable';\n    } else {\n        domMethod = 'off';\n        method = 'enable';\n    }\n\n    domutil[method + 'TextSelection'](container);\n    domutil[method + 'ImageDrag'](container);\n    domevent[domMethod](global.document, {\n        mousemove: this._onMouseMove,\n        mouseup: this._onMouseUp\n    }, this);\n};\n\n/**\n * Normalize mouse event object.\n * @param {MouseEvent} mouseEvent - mouse event object.\n * @returns {object} normalized mouse event data.\n */\nDrag.prototype._getEventData = function(mouseEvent) {\n    return {\n        target: mouseEvent.target || mouseEvent.srcElement,\n        originEvent: mouseEvent\n    };\n};\n\n/**\n * MouseDown DOM event handler.\n * @param {MouseEvent} mouseDownEvent MouseDown event object.\n */\nDrag.prototype._onMouseDown = function(mouseDownEvent) {\n    // only primary button can start drag.\n    if (domevent.getMouseButton(mouseDownEvent) !== 0) {\n        return;\n    }\n\n    this._distance = 0;\n    this._dragStartFired = false;\n    this._dragStartEventData = this._getEventData(mouseDownEvent);\n\n    this._toggleDragEvent(true);\n};\n\n/**\n * MouseMove DOM event handler.\n * @emits Drag#drag\n * @emits Drag#dragStart\n * @param {MouseEvent} mouseMoveEvent MouseMove event object.\n */\nDrag.prototype._onMouseMove = function(mouseMoveEvent) {\n    var distance = this.options.distance;\n    // prevent automatic scrolling.\n    domevent.preventDefault(mouseMoveEvent);\n\n    this._isMoved = true;\n\n    if (this._distance &lt; distance) {\n        this._distance += 1;\n        return;\n    }\n\n    if (!this._dragStartFired) {\n        this._dragStartFired = true;\n\n        /**\n         * Drag starts events. cancelable.\n         * @event Drag#dragStart\n         * @type {object}\n         * @property {HTMLElement} target - target element in this event.\n         * @property {MouseEvent} originEvent - original mouse event object.\n         */\n        if (!this.invoke('dragStart', this._dragStartEventData)) {\n            this._toggleDragEvent(false);\n            return;\n        }\n    }\n\n    /**\n     * Events while dragging.\n     * @event Drag#drag\n     * @type {object}\n     * @property {HTMLElement} target - target element in this event.\n     * @property {MouseEvent} originEvent - original mouse event object.\n     */\n    this.fire('drag', this._getEventData(mouseMoveEvent));\n};\n\n/**\n * MouseUp DOM event handler.\n * @param {MouseEvent} mouseUpEvent MouseUp event object.\n * @emits Drag#dragEnd\n * @emits Drag#click\n */\nDrag.prototype._onMouseUp = function(mouseUpEvent) {\n    this._toggleDragEvent(false);\n\n    // emit \"click\" event when not emitted drag event between mousedown and mouseup.\n    if (this._isMoved) {\n        this._isMoved = false;\n\n        /**\n         * Drag end events.\n         * @event Drag#dragEnd\n         * @type {MouseEvent}\n         * @property {HTMLElement} target - target element in this event.\n         * @property {MouseEvent} originEvent - original mouse event object.\n         */\n        this.fire('dragEnd', this._getEventData(mouseUpEvent));\n        return;\n    }\n\n    /**\n     * Click events.\n     * @event Drag#click\n     * @type {MouseEvent}\n     * @property {HTMLElement} target - target element in this event.\n     * @property {MouseEvent} originEvent - original mouse event object.\n     */\n    this.fire('click', this._getEventData(mouseUpEvent));\n};\n\nutil.CustomEvents.mixin(Drag);\n\nmodule.exports = Drag;\n\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"