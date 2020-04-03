class Tbs extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".tbs",
            scope               : document,
            q                   : {
                n               : ".tbs:not(.tbs-n)",
                temp            : ".tbs-temp",
                area            : ".tbs-area",
            },
            mode                : "x",
            scrollable          : false,
            sdl: {
                resizing: false,
            },
            builder: {
                indctrs: {
                    pos: "beforeend",
                    class: ["r", "-rm"],
                    tag: "div",
                },
                indctr: {
                    pos: "beforeend",
                    tag: "div",
                    class:[">"],
                }
            }
        };
        super(defaults);


    }
    /** Setup target */
    _build() {
        this.D.$indctrs = this.builder("indctrs");
        this.D.$indctr  = this.builder("indctr");
        this.D.$indctrs.append(this.D.$indctr);
    }
    initEvent(e) {
        if (e.animationName === "anm-init" && !e.target[this._data_] && e.target.matches(this.S.el)) {
            let trgr = e.target.querySelector("[tb-q].tbs-active") || e.target.querySelector("[tb-q]");
            this.select(trgr);
        }
    }

    /**
     * setup Events
     */
    _setupEvents() {
        this._selectBind            = this._select.bind(this);
        this._resizeBind            = this._resize.bind(this);
        this.initEventBind         = this.initEvent.bind(this);

        this._events["click"]       = { fn: this._selectBind, el: this.S.scope };
        this._events["resize"]      = { fn: this._resizeBind, el: window };
        if (this.EL_TYPE === "global") {
            this._events["animationstart"] = { fn: this.initEventBind, el: this.S.scope };
        }

        this._addEvents();

    } 



    /**
     * all Events
     */
    _select(e) {
        this.select(e.target.closest("[tb-q]"));
    }
    _resize() {
        this.D.$activeTbTrgr.click();
    }
    calc($tb_trgr, $el, $indctr, $activeTbTrgr = null, $tb) {
        if ($activeTbTrgr && $tb_trgr.offsetLeft < $activeTbTrgr.offsetLeft) {
            $el.classList.remove("tbs--ltr");
            $el.classList.add("tbs--rtl");
        } else {
            $el.classList.add("tbs--ltr");
            $el.classList.remove("tbs--rtl");
        }
        if ($activeTbTrgr && $tb_trgr.offsetTop < $activeTbTrgr.offsetTop) {
            $el.classList.remove("tbs--ttb");
            $el.classList.add("tbs--btt");
        } else {
            $el.classList.add("tbs--ttb");
            $el.classList.remove("tbs--btt");
        }


        if (this.S.mode == "x" || this.S.mode == "xy") {
            $indctr.style.setProperty("--tbs-indc-right", $tb_trgr.offsetParent.offsetWidth - $tb_trgr.offsetLeft - $tb_trgr.clientWidth);
            $indctr.style.setProperty("--tbs-indc-left", $tb_trgr.offsetLeft);
        }
        if (this.S.mode == "y" || this.S.mode == "xy") {
            $indctr.style.setProperty("--tbs-indc-bottom", $tb_trgr.offsetParent.offsetHeight - $tb_trgr.offsetTop - $tb_trgr.clientHeight);
            $indctr.style.setProperty("--tbs-indc-top", $tb_trgr.offsetTop);
        }

        let $indctrs = $indctr.parentElement;
        $indctrs.style.width = $tb_trgr.offsetParent.offsetWidth + "px";
        $indctrs.style.height = $tb_trgr.offsetParent.offsetHeight + "px";

        $indctr.style.backgroundColor = window.getComputedStyle($tb_trgr, null).getPropertyValue("color");
        setTimeout(() => {
            $indctr.style.backgroundColor = window.getComputedStyle($tb_trgr, null).getPropertyValue("color");
        }, 200);

    }
    select(q) {
        let $tb_trgr = q instanceof Element ? q : this.S.scope.querySelector("[tb-q='" + q + "']");
        if ($tb_trgr && this.init($tb_trgr)) {
            let $tb,
                $activeTb = this.D.$activeTb || 0,
                $activeTbTrgr = this.D.$activeTbTrgr || 0,
                $indctr = this.D.$indctr,
                $el = this.$el,
                hasTrgt = $tb_trgr.getAttribute("tb-q") && $tb_trgr.getAttribute("tb-q") != "" && document.querySelector($tb_trgr.getAttribute("tb-q"));


            if (this.D.$activeTbTrgr) {
                this.D.$activeTbTrgr.classList.remove("tbs-trgr-active");
            }
            this.D.$activeTbTrgr = $tb_trgr;
            this.D.$activeTbTrgr.classList.add("tbs-trgr-active");

            if (this.D.$activeTb) {
                this.D.$activeTb.classList.remove("tbs-active");
            }

            if (hasTrgt) {
                $tb = document.querySelector($tb_trgr.getAttribute("tb-q"));
                this.D.$activeTb = $tb;
                $tb.classList.add("tbs-active");
            }

            this.calc($tb_trgr, $el, $indctr, $activeTbTrgr);
            
            if (this.D.$activeTb) {
                //this.D.$activeTb.scrollIntoView({ behavior: "smooth", block: "nearest" });
                this.D.$activeTb.parentElement.scroll({
                    top: (this.S.mode === "y" || this.S.mode === "auto") ? this.D.$activeTb.offsetTop : this.D.$activeTb.parentElement.scrollTop,
                    left: (this.S.mode === "x" || this.S.mode === "auto") ? this.D.$activeTb.offsetLeft : this.D.$activeTb.parentElement.scrollLeft,
                    behavior: 'smooth'
                });
            }

            //if (this.D.$activeTb.closest(".sld")) {
            //    window.sld.init(this.D.$activeTb);
            //    window.sld.select(this.D.$activeTb);
            //    window.sld.$el.Sld.Widget.S.onlyControle = true;
//
            //}
            this.update("select");
        }
    }
}

window.tbs = Tbs.new({ el: ".tbs"});



