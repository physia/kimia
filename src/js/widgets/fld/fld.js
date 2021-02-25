class Fld extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el                  : ".fld",
            scope               : document,
            type                : "auto",
            overlay             : 0,
            q                   : {
                n       : ".fld:not(.fld-n)",
                box     : ".fld-box",
                temp    : ".fld-temp",
                keep    : ".fld-keep",
                focus   : ".fld-focus",
                blur    : ".fld-blur",
                change  : ".fld-change",
                reset   : ".fld-reset",
                area    : ".fld-area",
                overlay : ".fld-overlay"
            },
            clean               : true,
            mode                : "normal", // dev
            content             : false, // dev
        };
        super(defaults);


    }
    /** Setup target */
    _build() {
        this._events["transitionend"] = { fn: this._endBind, el: this.$area };
        this._addEvents();
        if (this.S.overlay) {
            this.setupOverlay(this.$el);
        }
    }
    /**
     * setup Events
     */
    _setupEvents() {
        this._focusBind                     = this._focus.bind(this);
        this._blurBind                      = this._blur.bind(this);
        this._changeBind                    = this._change.bind(this);
        this._endBind                       = this._end.bind(this);

        this._events                        = {};
        this._events["focus"]               = { fn: this._focusBind,  el: this.S.scope};
        this._events["blur"]                = { fn: this._blurBind ,  el: this.S.scope };
        this._events["change"]              = { fn: this._changeBind,el: this.S.scope };
        
        this._addEvents();

    } 
    /**
     * all Events
     */

    focus() {
        this.update("focus");
        //setTimeout(() => {
        //    this.$area.focus();
        //}, 0);
    }
    blur() {
        this.update("blur");
        //setTimeout(() => {
        //    this.$area.blur();
        //}, 0);
    }
    change() {
        this.update("change");
    }
    end() {
        this.update("end");
    }

    _focus(e) {
        if (this.status !== "focus" && this.init(e)) {
            this.focus();
        }
    }
    _blur(e) {
        if (this.init(e)) {
            if (this.status !== "blur" && (e.explicitOriginalTarget.closest && e.explicitOriginalTarget.closest(this.S.q.blur) || !this.$el.contains(e.explicitOriginalTarget))) {
                this.blur();
            } else {
                this.focus();
            }
        }

    }
    _change(e) {
        if (this.status !== "change" && this.init(e)) {
            this.change();
        }
    }
    _end(e) {
        if (this.status === "blur" && e.propertyName === "color") {
            this.end();
        }
    }
}
const fld = new Fld();
fld.$.el = ".fld";
//fld.$.el = document.querySelector('[fld-q="#fld"]');
fld.setup();

//const Fld0 = new Fld();
//Fld0.$.el = document.querySelector("#fld");
//Fld0.setup();


