class Hlp extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** settings */
        let defaults = {
            el: ".hlp",
            scope: document,
            q: {
                n: ".hlp:not(.hlp-n)",
                area: ".hlp-area",
            },
            all: true,
            use: "f h a",
            actions: {
                f: { // focus 
                    in: "focus",
                    out: "blur",
                    fn: "indicator"
                },
                h: { // hover 
                    in: "mousemove",
                    out: "mouseout",
                    fn: "indicator"
                },
                a: { // active
                    in: 'ontouchstart' in window ? "touchstart" : "mousedown",
                    out: 'ontouchstart' in window ? "touchend" : "mouseup",
                    fn: "indicator"
                },
                //toggle: true,
            }
        };
        super(defaults);
    }
    /** Build */
    _build() {

    }

    /**
     * add Events
     */
    // _dynamicSetupEvents() beta!!

    initEvent(e) {
        if (e.animationName === "anm-init" && this.init(e)) {
            this.updateActions();
        }
    }
    _setupEvents() {
        this.initEventBind = this.initEvent.bind(this);
        if (this.EL_TYPE === "global") {
            this._events["animationstart"] = { fn: this.initEventBind, el: this.S.scope };
        }
        this._addEvents();
    }

    /**
     * all Events
     */
    _handleEvent(action, isIn, e, elUp = null) {
        if (this.init(elUp || e)) {
            this.updateActions();
            this.updateClass(action, isIn, e);
            this.update("handle" + (isIn?"in":"out"));
            if (this.$el.parentElement.closest(this.S.el) && this.$el.parentElement.closest(this.S.el) != this.$el && this.S.all) {
                this._handleEvent(action, isIn, e, this.$el.parentElement.closest(this.S.el));
            }
        }
    }

    updateActions() {
        let actions = C.asList(this.S.use);

        actions.forEach(action => {
            if (this.S.actions[action]) {
                if (!this._events[this.S.actions[action].in]) {
                    this._events[this.S.actions[action].in] = { fn: this._handleEvent.bind(this, action, true), el: this.S.scope };
                    this._events[this.S.actions[action].out] = { fn: this._handleEvent.bind(this, action, false), el: this.S.scope };
                }
            } else {
                if (!this._events[action]) {
                    this._events[action] = { fn: this._handleEvent.bind(this, action, true), el: this.S.scope };
                }
            }
            this._addEvents();
        });
    }

    updateClass(action, isIn, e) {
        let classList = C.asList(this.$el.getAttribute(action + ":class"));
        if (classList.length) {
            this.D.cssUsedClasses = this.D.cssUsedClasses || {};
            classList.forEach(classItem => {
                this.D.cssUsedClasses[classItem] = this.D.cssUsedClasses[classItem] || {};
                if (isIn) {
                    this.$el.classList.add(classItem);
                    this.D.cssUsedClasses[classItem][action] = 1;
                } else {
                    this.D.cssUsedClasses[classItem][action] = 0;
                    if (Object.values(this.D.cssUsedClasses[classItem]).reduce((a, b) => a + b) == 0) {
                        this.$el.classList.remove(classItem);
                    }
                }
            });
        }

        if (C.asList(this.S.use).includes(action) && this.S.actions[action] && this.S.actions[action].fn) {
            if (this.$area != this.$el) {
                this[this.S.actions[action].fn](e, "area", action, isIn);
            }
            if (this.$areatop != this.$el) {
                this[this.S.actions[action].fn](e, "areatop", action, isIn);
            }
            this[this.S.actions[action].fn](e, "el", action, isIn);
        }

    }

    indicator(e, elName, action, isIn) {
        let _width = this["$" + elName].offsetWidth,
            __inOrOut = isIn?"in":"out",
            _height = this["$" + elName].offsetHeight,
            _top = this["$" + elName].offsetTop,
            _left = this["$" + elName].offsetLeft,
            _x = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX ? e.touches[0].clientX : 0)) + document.body.scrollLeft + document.documentElement.scrollLeft,
            _y = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY ? e.touches[0].clientY : 0)) + document.body.scrollTop + document.documentElement.scrollTop;
        let data = {
            width: _width,
            height: _height,
            top: _top,
            left: _left,
            x: _x,
            y: _y,
        };
        let key = "";
        if (this.S.key && this.S.key != "") {
            key = this.S.key + "-";
        }
        for (let item in data) {
            this["$" + elName].style.setProperty("--hlp-" + key + elName + "-" + action + "-" + __inOrOut + "-" + item, data[item]);
        }
        this["$" + elName].style.setProperty("--hlp-" + key + elName + "-" + action + "-is", isIn ? 1 : 0);

    }
}

const hlp = new Hlp();
hlp.setup();