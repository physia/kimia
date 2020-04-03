//
//class Physia {
//    /**
//     * Widgets constructor
//     * @constructor
//     */
//    constructor() {
//    }
//
//    /**
//     * Initializes widgets
//     * @param  widget
//     * @param {Object} settings
//     */
//}
// Feature
class Widget extends Physia {
    /**
    * @constructor
    * @param {Object} defaults
    * @param {String} setupMode
    */
    constructor(defaults, setupMode = "global") {
        super("widget");

        this._defaults = defaults;
        this._defaults.prefix = "";
        this._defaults.key = this._defaults.key || "";
        this._defaults.levels = this._defaults.levels || 1; // number: 0,1,Infinity...
        this._defaults.showId = this._defaults.showId || false;
        this._defaults.showKey = this._defaults.showKey || true;
        this._defaults.showStatus = this._defaults.showStatus || true;

        this._settings = Object.assign({}, this._defaults);
        this._features = this._settings.features || {};
        this._triggers = {};
        this._tasks = this._settings.tasks || {};

        this._event = null;
        this._events = {};
        this._customEvents = {};

        this.EL_TYPE = setupMode;

        this.$ = this._settings;

    }
    static new(_settings) {
        let $this = this;
        if (_settings.el instanceof Element || typeof _settings.el === "string") {
            let inst = new $this();
            for (let key in _settings) {
                inst.$[key] = _settings[key];
            }
            inst.setup();
            return inst;
        }
        if (_settings.el instanceof NodeList) {
            let insts = [], i = 0;
            [].forEach.call(_settings.el, function (el) {
                insts[i] = new $this();
                for (let key in _settings) {
                    insts[i].$[key] = _settings[key];
                }
                insts[i].$.el = el;
                insts[i].setup();
                i++;
            });
            return insts;
        }
    }

    /** Custom Events */
    _addCustomEvents(eventName) {
        this._customEvents[eventName] = new CustomEvent(this._sname_ + ":" + eventName, {
            detail: {
                widget: this
            }
        });
    }
    _removeCustomEvents(eventName) {
        this._customEvents[eventName] = undefined;
    }
    /** Setup */
    setup() {
        this.S = Object.assign({}, this.$);
        this._addCustomEvents("update");
        this.update("setup");
        /** init if el instanceof Element  */ // DEV...
        //if (this.S.el instanceof NodeList) {
        //    return Widget.new(this.$, Wv);
        //} else if (this.S.el instanceof Element) {
        //    this.EL_TYPE = "Element";
        //    if (this.S.el.matches(this.S.q.n)) {
        //        this.S.scope = this.S.el;
        //        this._config(this.S.el);
        //    } else {
        //        return false;
        //    }
        //}
        /** setup Widget */
        this.registe();
        /** setup all events */
        if (this._setupEvents) {
            this._setupEvents();
        }
        /** setup gBuild */
        if (this.EL_TYPE == "global" && this._setup) {
            this._setup();
        }
    }


    builder(name, force = false) {
        let elemByName = this.in("[" + this._logname_ + "--name='" + name + "']");
        if (force && elemByName) {
            elemByName.remove();
        }
        if (!elemByName) {
            elemByName = document.createElement(this.S.builder[name].tag || "div");
            elemByName.setAttribute(this._logname_ + "--name", name);

            if (this.S.builder[name].class) {
                elemByName.classList.add(...this.S.builder[name].class);
            }
            //console.log(elemByName,name);

            this.$area.append(elemByName);
        }

        return elemByName;
    }
    /** Update Status */
    update(newStatus, css = true) {
        this.status = newStatus;
        if (this.$el) {
            if (this.D) {
                this.$el[this._name_].status = newStatus;
            }
            if (!this._customEvents[newStatus]) {
                this._addCustomEvents(newStatus);
            }
            this._dispatchCustomEvent(newStatus);
            if (css) {
                this.updateStatus();
            }
        }
            try {
                document.querySelector('.btn-n[mdl-q="#picker"]').innerHTML = document.querySelector('.btn-n[mdl-q="#picker"]').Mdl.status;
                document.querySelector('.btn-n[mdl-q="#picker2"]').innerHTML = document.querySelector('.btn-n[mdl-q="#picker2"]').Mdl.status;

            } catch (error) {
                
            }
    }
    _dispatchCustomEvent(customEvent) {
        this.$el.dispatchEvent(this._customEvents['update']);
        this.$el.dispatchEvent(this._customEvents[customEvent]);
    }
    /** Update Classes */
    updateStatus() {
        this.removeUpdates();
        this.addUpdates();
    }
    addUpdates() {
        Object.keys(this.D).forEach(key => {
            if (this.D[key] instanceof Element) {
                this.D[key][this.ID] = this.$el;
                //this.D[key][this.TID] = this.$el;
                this.D[key].setAttribute(this._logname_, this.status);
                this.D[key].setAttribute(this._logname_ + "--name", key.replace("$", ""));
            }
        });
        if (this.$el.getAttribute(this._logname_ + "::" + this.status)) {
            let classList = this.$el.getAttribute(this._logname_ + "::" + this.status).trim().replace("  ", " ");
            this.$el.classList.add(...classList);
        }
        if (this.S.updates instanceof Object) {
            for (var _key in this.S.updates) {
                for (let _value in this.S.updates[_key]) {
                    if (this.status === _key && this.D[_value]) {
                        if (this.S.updates[_key][_value] instanceof Array) {
                            this.S.updates[_key][_value].forEach(_val => {
                                this.D[_value].classList.add(this.S.prefix + _val);
                            });
                        } else {
                            this.D[_value].classList.add(this.S.prefix + this.S.updates[_key][_value]);
                        }
                    }
                }
            }
        }

    }
    removeUpdates() {
        Object.keys(this.D).forEach(key => {
            if (this.D[key] instanceof Element) {
                this.D[key][this.ID] = undefined;
                this.D[key].removeAttribute(this._logname_);
                this.D[key].removeAttribute(this._logname_ + "--name");
            }
        });

        if (this.$el.getAttribute(this._logname_ + "::" + this.status)) {
            let classList = this.$el.getAttribute(this._logname_ + "::" + this.status).trim().replace("  ", " ");
            this.$el.classList.remove(...classList);
        }
        if (this.S.updates instanceof Object) {
            for (var _key in this.S.updates) {
                for (let _value in this.S.updates[_key]) {
                    if (this.status === _key && this.D[_value]) {
                        if (this.S.updates[_key][_value] instanceof Array) {
                            this.S.updates[_key][_value].forEach(_val => {
                                this.D[_value].classList.remove(this.S.prefix + _val);
                            });
                        } else {
                            this.D[_value].classList.remove(this.S.prefix + this.S.updates[_key][_value]);
                        }
                    }
                }
            }
        }
    }

    /** Features */
    _addFeatures() {
        for (let feature in this.F) {
            this.F[feature].feature.widget = this;
            this.F[feature].feature.setup();
        }
    }
    _removeFeatures() {
        for (let feature in this.F) {
            this.F[feature].feature.destroy();
        }
    }
    /** init El */
    once(e/*,matchesParents=false, willChangeElems = false*/) {
        let el = e.target || e;
        if (this._matches(el)) {
            if (el.closest("." + this._logname_ + "-skip") && el.closest(this.Q("skip")) != this._el(el)) {
                return false;
            }
            this._event = e.type ? e : false;
            this._config(this._el(el));
            //if (this.S.withTriggers && !Object.values(this._triggers).includes(el)) {
            //    let _id = Object.values(this._triggers).length + 1;
            //    this._triggers[_id];
            //    this.TID = this.ID + "," + _id;
            //}
            //if (willChangeElems) {
            //    this.removeUpdates();
            //}
            //this._setupOptions();
            return true;
        }
        return false;
    }

    init(e, action, status = false, level = this.S.levels) {
        if (this.once(e)) {
            if (action === undefined) {
                return 1;
            }
            action();
            if (this.matchesParent() && (level - 1) > 0) {
                let ev = e.target ? (Object.assign({}, e).target = this.$el.parentElement.closest(this.S.el)) : this.$el.parentElement.closest(this.S.el);
                this.init(ev, action, status, level - 1);
            }
            if (status) {
                this.update(status);
            }
        }
    }
    initFrom(el) {
        let _el = el.closest("[" + this._sname_ + "]");

        return _el ? this.once(_el[this.ID] || _el) : false;
    }
    on(status, action, options) {
        this.$el.addEventListener(this._sname_ + ":" + status, action.bind(this), options);
    }

    _elUp(el = this.$el) {
        if (el.closest(this.S.el)) {
            if (el.closest(this.S.el).matches(this.S.q.n)) {
                return el.closest(this.S.el);
            }
            //return this._elUp(el.closest(this.S.el));
        }
        return 0;
    }
    _findElUp() {
        if (this.$el.closest(this.S.el) && this.$el.closest(this.S.el).matches(this.S.q.n)) {
            return this.$el.closest(this.S.el);
        }

        return 0;
    }

    _setupOptions(data = this.S) {
        Object.keys(data).forEach(option => {
            let _val = this.$el.getAttribute(this._sname_ + ":" + option) || undefined;
            if (_val) {
                //if (_val.indexOf(".") !== -1) {
                //    console.log("IN DEV...!");
                //}
                if (typeof this.$[option] === "string") {
                    this.S[option] = _val;
                } else {
                    this.S[option] = eval(_val);
                }
            }
        });

        //let prefix = this._sname_ + ":";
        //Array.prototype.slice.call(this.$el.attributes).forEach(function (item) {
        //    if (item.name.indexOf(prefix) !== -1) {
        //        let key = item.name;//this.S.hasOwnProperty(item.name.replace(prefix,""));
        //        let path = this.S;
        //        key.split(".").forEach(item => {
        //            path = path[item];
        //        });
        //    }
        //});
        //Array.prototype.slice.call(cars).forEach(function (item) {
        //    if (item.indexOf(prefix) !== -1) {
        //        let key = item.replace(prefix, "");
        //        let path = { Volvo: "Volvo", AAA: { BBB: { CCC: "مبروك! لقد وصلت" } } };
        //        key.split(".").forEach(items => {
        //            path = path[items];
        //        });
        //        console.log(path);
        //    }
        //});


    }

    /** Matches El */
    _matches(el) {
        let _el = this._el(el);
        return (_el && _el.matches(this.S.q.n));
    }
    /** Get El */
    _el(_el) {
        if (this.S.el instanceof Element) {
            return this.S.el;
        }
        if (_el === this.S.el) {
            return this.S.el;
        }
        if (typeof _el.matches === 'function' && _el.matches(this.S.q.n) && _el.matches(this.S.el)) {
            return _el;
        }
        if (typeof _el.closest === 'function' && _el.closest(this.S.el) && _el.closest(this.S.el).matches(this.S.q.n)) {
            return _el.closest(this.S.el);
        }

        return false;
    }
    /** config el */
    _config(el) {
        if (el == this.$el) return;
        this.$el = el;

        let area = this.$el.querySelector(this.S.q.area || "." + this._sname_ + "-area");
        this.$area = area && area.closest(this.S.q.n) == this.$el ? area : this.$el;

        let areatop = this.$el.closest(this.S.q.areatop || "." + this._sname_ + "-areatop");
        this.$areatop = areatop && areatop.querySelector(this.S.q.n) == this.$el ? areatop : this.$el;

        if (!this.$el[this._name_]) {
            this.ID = this._name_.toLowerCase() + "-" + this._Nid_;
            this.KEY = "";

            if (this.S.showId) {
                this.$el.setAttribute(this._name_ + "--id", this.ID);
            }
            if (this.S.key != "") {
                this.KEY = this.S.key;
            }
            this.$el[this._name_] = this.$el[this._name_] || {};
            this.$el[this._name_].Settings = Object.assign({}, this.$);

            this._configData();

            this._build();
            this._configDataObjects();
            this._addFeatures();

        } else {
            //Object.keys(this).forEach(key => {
            //    if (this[key] instanceof Element) {
            //        //this.D[key].setAttribute(this._name_ + "--for", this.ID);
            //        this.D[key] = this[key];
            //    }
            //});
            this._configData();
            this._configDataObjects();
        }
        this.status = this.D.status || this.status;

        //this.update("config", false);
    }
    _configData() {
        this.D = this.$el[this._name_];
        this.D.$el = this.$el;
        this.D.$area = this.$area;
        this.D.$areatop = this.$areatop;
        this.D.id = this.ID;


        this.D.Features = this._features;
        this.D.Tasks = this._tasks;
        this.D.Widget = this;
        this.D.Event = this._event;

        this.F = this.D.Features;
        this.T = this.D.Tasks;
        this.W = this;
        this.S = this.D.Settings;
        this.E = this.D.Event;

        this._setupOptions();
    }
    _configDataObjects() {
        Object.keys(this.D).forEach(key => {
            if (this.D[key] instanceof Element) {
                //this.D[key].setAttribute(this._name_ + "--for", this.ID);
                this[key] = this.D[key];
                if (key !== "$el" && this.showKey && this.key !== "") {
                    this[key].setAttribute(this._logname_ + "--key", this.KEY);
                }
            }
        });
    }
    /**
     * Events
     */
    //_eventsLayer(eventFn) {
    //    return eventFn;
    //}
    _addEvents() {
        var op;
        if (this._events) {
            for (let _event in this._events) {
                if (!this._events[_event].exists) {
                    if (this._events[_event].op === undefined) {
                        op = true;
                    } else {
                        op = false;
                    }
                    //this._events[_event].el.addEventListener(_event, this._eventsLayer(this._events[_event].fn), op);
                    this._events[_event].el.addEventListener(_event, this._events[_event].fn, op);
                    this._events[_event].exists = 1;
                }
            }
        }
    }
    _removeEvents() {
        var op;
        if (this._events) {
            for (let _event in this._events) {
                if (this._events[_event].op === undefined) {
                    op = true;
                } else {
                    op = false;
                }
                //this._events[_event].el.removeEventListener(_event, this._eventsLayer(this._events[_event].fn), op);
                this._events[_event].el.removeEventListener(_event, this._events[_event].fn, op);
                this._events[_event].exists = 0;
            }
        }
    }

    _destroyEvents() {
        this._removeEvents();
        delete this._events;
    }

    /** clean widget */
    clean() {
        //    this.removeUpdates();
        //
        //    let _styleRegEx = new RegExp("^--" + this._sname_ + "--", 'i'),
        //        _attributeRegEx = new RegExp("^" + this._sname_ + "--", 'i'),
        //        _attributesList = [],
        //        _styleList = [];
        //
        //    let _temp = document.querySelectorAll(this.S.q.temp || "." + this._sname_ + "--temp");
        //    _temp.forEach(_el => {
        //        _el.remove();
        //    });
        //
        //    let _els = document.querySelectorAll("." + this._sname_);
        //    _els.forEach(_el => {
        //        delete _el[this._name_];
        //
        //        for (let _i = 0; _i < _el.attributes.length; _i++) {
        //            if (_attributeRegEx.exec(_el.attributes[_i].name)) {
        //                _attributesList.unshift(_el.attributes[_i]);
        //            }
        //        }
        //        _attributesList.forEach(_attribute => {
        //            _el.removeAttribute(_attribute.name);
        //        });
        //
        //
        //        for (let _i = 0; _i < _el.style.length; _i++) {
        //            if (_styleRegEx.exec(_el.style[_i])) {
        //                _styleList.unshift(_el.style[_i]);
        //            }
        //        }
        //        _styleList.forEach(_property => {
        //            _el.style.removeProperty(_property);
        //        });
        //    });

    }

    /** destroy widget */
    reset() {
        this.update("reset");
        this.destroy();
        this.setup();
    }
    /** destroy widget */
    destroy() {
        this.update("destroy");
        this.status = undefined;
        this.$el = undefined;
        this.$area = undefined;
        this.$areatop = undefined;
        //delete widgets[this._name_].list[this._id_];
        this._destroyEvents();
        this.clean();
    }




    // halpers
    static of (el) {
        let widget = el[this.name].Widget;
        el.click();
        //widget.init(el);
        return widget;
    }

    in(q) {
        let qEl = this.$el.querySelector(q) || undefined;
        if (qEl && qEl.closest("[" + this._logname_ + "--id]") == this.$el) {
            return qEl;
        }
        return false;
    }
    isInside(q) {
        let __el = this.$el.querySelector(q);
        return (__el.closest(this.S.q.n) && __el.closest(this.S.q.n) === this.$el) || this.$e.matches(q);
    }
    own(e, q = false) {
        let _el = q ? (e.target || e).closest(q) : (e.target || e);
        return _el && _el.closest("[" + this._logname_ + "--id]") == this.$el ? _el : undefined;
    }
    getTempChild(q, matches = null) {
        let qEl = this.$el.querySelector(q) || this.$el.closest(q);
        if (qEl && qEl.closest(matches || this.Q("n")) == this.$el) {
            return qEl;
        }
        return false;
    }

    Q(_q, _not = false) {
        var q = this.S.q[_q] || "." + this._logname_ + "-" + _q;
        return _not ? ":not(" + q + ")" : q;
    }

    matchesParent() {
        return this.$el.parentElement.closest(this.S.el);
    }

    //link(widget,options) {
    //    this._links = options;
    //    this._linkEvent = options;
    //    let link = {
    //        widget: new Ovrly(),
    //        actions: {
    //            open: "open",
    //            close: "close",
    //        },
    //        options: {
    //            el: "$modal",
    //            noscroll: 1,
    //        },
    //        events: {
    //            close: "close"
    //        },
    //        enabled: 1
    //    };
    //    
    //}


}
