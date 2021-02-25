class Feature extends Physia {
    /**
    * @constructor
    * @param {Object} defaults
    * @param {String} setupMode
    */
    constructor(defaults, setupMode = "global") {
        super("feature");
        this.$ = defaults;

        for (const key in defaults) {
            this[key] = defaults[key]
        }

        this.actions = {};
        this.widget = null;
        this.status = null;
        this.ready = 0;
    }
    /** Update Status */
    update(newStatus) {
        this.status = newStatus;
        Object.keys(this.$el[this._sname_]).forEach(key => {
            if (this.$el[this._sname_][key] instanceof Element) {
                this.$el[this._sname_][key].setAttribute(this._sname_, this.status);
            }
        });
    }

    setup() {
        this.registe();
        if (this.actions instanceof Object) {
            this._controlBind = this._control.bind(this);
            this.widget.$el.addEventListener(this.widget._sname_ + ":update", this._controlBind);
        }
    }
    _control(e) {
        this.widget = e.detail.widget;
        this.$wEl = this.widget.$el;
        this.wElDATA = this.$wEl[this.widget._name_];
        this.config = this.wElDATA.Features[this._sname_];
        this.$el = this.wElDATA[this.config.options.el];
        this.actions = this.config.actions;

        if (!this.config.enabled) {
            return; // DEV ... إيقاف
        }

        //if (!this.$el[this._sname_]) {
        this._build();
        //}

        if (this.actions.hasOwnProperty(this.widget.status)) {
            this[this.actions[this.widget.status]]();
        }
    }
    of(el) {
        this.$el = el;
        return this;
    }
    reset() {
        this.destroy();
        this.setup();
    }
    destroy() {
        this.status = undefined;
        this.$el = undefined;
        this.$wEl.removeEventListener(this.widget._sname_ + ":update", this._controlBind);
    }

}
