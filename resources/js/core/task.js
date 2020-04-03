class Service extends Physia {
    /**
    * @constructor
    * @param {Object} defaults
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
        if (this.status != newStatus) {
            this.status = newStatus;
            Object.keys(this).forEach(key => {
                if (this[key] instanceof Element) {
                    this[key].setAttribute(this._sname_, this.status);
                }
            });
        }
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
        this.$el = this.widget[this.widget.F[this._sname_].options.el];
        this.actions = this.widget.F[this._sname_].actions;

        if (!this.widget.F[this._sname_].enabled) {
            return; // DEV ... إيقاف
        }

        if (!this.ready) {
            this._build();
        }

        if (this.actions.hasOwnProperty(this.widget.status)) {
            this[this.actions[this.widget.status]]();
        }
    }
    reset() {
        this.destroy();
        this.setup();
    }
    destroy() {
    }

}
