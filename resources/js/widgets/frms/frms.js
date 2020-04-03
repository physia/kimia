class Frms extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".frms",
            scope               : document,
            q                   : {
                n               : ".frms:not(.frms-n)",
                temp            : ".frms-temp",
                area            : ".frms-area",
            },
            updates: {
                select: { $frm: "frms--active", $prev: "frms--prev",},
            },
        };
        super(defaults);
    }
    /** Setup target */
    _build() {
        let _frm = this.D.$el.querySelector(".frm");
        this.D.$frm = _frm;
        this.D.$prev = _frm;
    }

    /**
     * setup Events
     */
    _setupEvents() {
        this._selectEventBind = this._select.bind(this);

        this._events                = this._events || {};
        if (this.EL_TYPE === "global") {
            this._events["animationstart"] = { fn: this._selectEventBind, el: this.S.scope };
        }

        P.MO.unshift({
            w: this,
            q: ".frms",
            d: ".frm",
            a: "resize"
        });
        window.addEventListener('DOMContentLoaded', (event) => {
            new MutationObserver(this._detectChanges.bind(this)).observe(document.body, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        });

        this._addEvents();

    } 



    /**
     * all Events
     */
    _detectChanges(mutations, observer) {
        let mutation = mutations[0];
        if (mutation.target.matches(".frm")) {
            this.init(mutation.target.closest(".frms"));
            this.$frm = mutation.target;
            this.resize();
        }
    }
    resize(e) {
        this.update("resize");
        let _el = this.$el,
            _area = this.$area,
            _frm = this.$frm;

        _el.style.setProperty("--bxd-width", _area.offsetWidth + "px");
        _el.style.setProperty("--bxd-height", _area.offsetHeight + "px");
        _el.style.setProperty("--bxd-width", _frm.offsetWidth + "px");
        _el.style.setProperty("--bxd-height", _frm.offsetHeight + "px");

        setTimeout(() => {
        //    this.release(_el);
        }, (window.getComputedStyle(this.$el).transitionDuration.replace("s", "")) * 1000);

    }
    release(_el) {
        _el.style.removeProperty("--bxd-width");
        _el.style.removeProperty("--bxd-height");
        _el.style.removeProperty("--bxd-width");
        _el.style.removeProperty("--bxd-height");
        this.update("release");
    }

    _select(e) {
        if (e.animationName === "an-frms-select") {
            if (e.target.closest(".frms") == this.$el) {
                //this.select(e.target);
            }
            this.select(e.target);

        }
    }

    select(q) {
        let $frm = q instanceof Element ? q : this.S.scope.querySelector(q),
            $frms = q.closest(".frms") || undefined;
        if ($frm && this.init($frms,true)) {
            if ($frm != this.$frm) {
                this.D.$prev = this.$frm;
            }
            this.D.$frm = $frm;
            this.update("select");
        }
    }


}

const frms = Frms.new({ el: ".frms"});



