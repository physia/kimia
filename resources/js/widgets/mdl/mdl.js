class Mdl extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".mdl",
            scope: document,
            type: "mdl",
            q: {
                n: ":not(.mdl-n)",
                temp: ".mdl-temp",
                box: ".mdl-box",
                keep: ".mdl-keep",
                skip: ".mdl-skip",
                close: ".mdl-close",
                area: ".mdl-area"
            },
            autoClose: 0,
            boxed: 1,
            defaultQ: "close",// dev
            clean: true,
            mode: "normal", // dev
            content: false, // dev
            effact: false,// dev
            anims: {
                open: "scl-in",
                close: "scl-out"
            },
            features: {
                ovrly: {
                    feature: new Ovrly(),
                    actions: {
                        open: "open",
                        close: "close",
                    },
                    options: {
                        el: "$modal",
                        noscroll: 1,
                    },
                    events: {
                        close: "close"
                    },
                    enabled: 1
                }
            }
        };
        super(defaults);


    }
    /** Setup target */
    _buildStatus() { }
    _build() {
        this._logname_ = "mdl";

        if (!this.D.$modal || !this.$el.getAttribute(this.S.type + "-q")) {
            let $modal = document.querySelector(this.$el.getAttribute(this.S.type + "-q")), $box;
            $modal.classList.add("mdl");
            this.D.$modal = $modal;
            this.D.$scrlEl = document.scrollingElement;
            if (this.S.boxed) {
                this.addInBox();
            }
            this._addEvents();
            //this._buildStatus();
        }

    }
    addInBox() {
        if (!this.D.$modal.parentNode.matches(".mdl-box")) {
            this.D.$box = document.createElement("div");
            this.D.$box.classList.add("mdl-box", "b", "b-cl");
            this.D.$modal.parentNode.insertBefore(this.D.$box, this.D.$modal);
            this.D.$box.appendChild(this.D.$modal);
        } else {
            this.D.$box = this.D.$modal.closest(".mdl-box");
        }
        this.S.boxed = 1;
    }
    /**
     * setup Events
     */

    _setupEventsStatus() {
        this._events["click"] = { fn: this._toggleBind, el: this.S.scope };
        this._events["keypress"] = { fn: this._closeBind, el: window };
    }
    _setupEvents() {
        this._toggleBind = this._toggle.bind(this);
        this._events = {};
        this._setupEventsStatus();
        this._addEvents();
    }


    //
    toggle() {
        if (this.status === "close") {
            this.open();
        } else if (this.status === "open") {
            this.close();
        }
    }

    open() {
        this.update("open");
        C.addTopZIndex(this.$modal);
        if (this.$area != this.$el) {
            C.addTopZIndex(this.$area);
        }
        //(this.D.$box || this.D.$modal).style.overflow = "auto";

        C.animate(this.$modal, ["anm", this.S.anims.open]);
    }

    close() {
        this.update("close");
        C.animate(this.$modal, ["anm", this.S.anims.close], this.end.bind(this));
    }

    end() {
        if (this.status === "close") {
            this.update("end");
            C.removeZIndex(this.$modal);
            if (this.$area != this.$el) {
                C.removeZIndex(this.$area);
            }
            //(this.D.$box || this.D.$modal).style.overflow = "";
        }
    }
    /**
     * all Events
     */
    _toggle(e) {
        let $_el = this.once(e);
        if (e.target && !$_el && !(e.target.closest(".mdl") && e.target.closest(".mdl")[this.ID])) return;
        console.log(this.D.status);
        if (this.D.status !== "open") {
            this._open(e);
        } else {
            console.log("_close");
            this._close(e);
        }
    }

    _openStatus() { }
    _open(e) {
        this.open();
        this._openStatus(e);
    }

    _closeStatus() { }
    _close(e) {
        //var isOwn = this.initFrom(e.target);
        //console.log(isOwn);
        //let _trg = e.target,
        //    _trgKeep = _trg.closest(this.S.q.keep) || undefined,
        //    _trgClose = _trg.closest(this.S.q.close) || undefined,
        //    _trgMdl = _trg.closest(".mdl") || undefined,
        //    _isKeep = _trgKeep && (_trg.closest("[" + this._sname_ + "-q]") == this.$el || _trgKeep.closest(".mdl") == this.$modal),// || (_trg.closest(this.S.q.n) && _trg.closest(this.S.q.n) != this.$el),
        //    _isClose = _trgClose && _trgClose.closest(".mdl") == this.$modal,
        //    _isEl = _trgMdl && _trgMdl == this.$modal;

        //if (e.key == "Escape" || this.S.boxed && _trg.matches(this.S.q.box) && _trg.getAttribute(this.S.type + "--for") == this.ID || (_isEl || this.$.autoClose) && !_isKeep || _isClose) {
            //if (e.target && this.initFrom(e.target) && !this.init(e)) {
        if (!e.target.closest(this.S.q.keep) && e.target.closest(this.S.q.close)) {
            this.close();
            this._closeStatus(e);
        }
        //}

        //}
    }

    _endStatus() { }
    _end(e) {
        if (e.animationName === "an-sld-out" && e.target == this.$modal) {
            this.end();
            this._endStatus(e);
        }
    }
}

const mdl = new Mdl();
mdl.$.el = "[mdl-q]";
mdl.setup();


class Drp extends Mdl {
    /**
     * @constructor  
     */
    constructor() {
        super();
        this.$.type = "drp";
        this._features.ovrly.enabled = 0;
        this.$.noscroll = 0;
        this.$.boxed = 0;
        this.$.q.below = ".mdl-below";
        this.$.autoClose = 1;
    }
    _buildStatus() {
        if (!this.S.boxed) {
            this.$el.parentNode.insertBefore(this.D.$modal, this.$el.nextSibling);
        }
    }

    calc() {
        let $el = this.$el,
            $mdl = this.$modal,
            $area = this.$area,
            __rect = $area.getBoundingClientRect(),
            __t = $area.offsetTop,
            __l = $area.offsetLeft,
            __max_width,
            __max_height,
            __o,
            __top = $area.offsetTop,
            __left = $area.offsetLeft,
            isBelow = $el.matches(this.S.q.below) ? 1 : 1;


        if (this.S.boxed) {
            __top = __rect.top;
            __left = __rect.left;
        }
        if (__rect.top > (window.innerHeight / 2)) {
            __t = __top + $el.offsetHeight - $mdl.offsetHeight - ($el.offsetHeight * isBelow);
            __o = "bottom";
            __max_height = __rect.top + $el.offsetHeight - ($el.offsetHeight * isBelow);

        } else {
            __t = __top + ($el.offsetHeight * isBelow);
            __o = "top";
            __max_height = window.innerHeight - __rect.top - ($el.offsetHeight * isBelow);

        }

        if (__rect.left > (window.innerWidth / 2)) {

            __l = __left + $el.offsetWidth - $mdl.offsetWidth;
            __o += " right";
            __max_width = __rect.left + $el.offsetWidth;

        } else {
            __l = __left;
            __o += " left";
            __max_width = window.innerWidth - __rect.left;

        }


        $mdl.style.setProperty("--mdl-offset-left", __l);
        $mdl.style.setProperty("--mdl-offset-top", __t);
        $mdl.style.setProperty("--mdl-origin", __o);
        $mdl.style.setProperty("--mdl-max-width", __max_width);
        $mdl.style.setProperty("--mdl-max-height", __max_height);
        $mdl.style.setProperty("--mdl-min-width", $el.offsetWidth);
        $mdl.style.setProperty("--mdl-min-height", $el.offsetHeight);

    }

    _openStatus(e) {
        this.$el.parentNode.insertBefore(this.D.$modal, this.$el.nextSibling);
        this.calc();
    }
}

const drp = new Drp();
drp.$.el = "[drp-q]";
drp.setup();


class Pnl extends Mdl {
    /**
     * @constructor 
     */
    constructor() {
        super();
        this.$.type = "pnl";
        this._features.ovrly.enabled = 1;
    }
}

const pnl = new Pnl();
pnl.$.el = "[pnl-q]";
pnl.setup();




class Drw extends Mdl {
    /**
     * @constructor 
     */
    constructor() {
        super();
        this.$.type = "drw";
        this._features.ovrly.enabled = 1;
        this.$.boxed = 1;
    }
}

const drw = new Drw();
drw.$.el = "[drw-q]";
drw.setup();

