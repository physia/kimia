class Bxd extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** settings */
        let defaults = {
            el                  : ".bxd",
            scope: document,

            q                   : {
                n               : ".bxd:not(.bxd-n)",
                frm             : ".bxd-frm",
                area            : ".bxd-area",
            },

            //features: {
            //    scn: {
            //        feature: new Scn(),
            //        actions: {
            //            setup: "add",
            //        },
            //        options: {
            //            el: "$modal",
            //            noscroll: 1,
            //        },
            //        events: {
            //            click: "close"
            //        },
            //        enabled: 1
            //    }
            //}
        };


        super(defaults);

    }
    /** Build */
    _build() {
        this.D.$frm = this.$el.querySelector(this.S.q.frm);
    }


    /**
     * add Events
     */
    _setupEvents() {
        this._resizeBind = this._resize.bind(this);
        this._events = {};
        this._events["animationstart"] = { fn: this._resizeBind, el: this.S.scope };
        this._addEvents();


        //P.MO.unshift({
        //    w: this,
        //    q: ".frms",
        //    d: ".frm",
        //    a: "resize"
        //});
        //window.addEventListener('DOMContentLoaded', (event) => {
        //    new MutationObserver(this._detectChanges).observe(document.body, {
        //        attributes: true,
        //        subtree: true,
        //        attributeFilter: ['class']
        //    });
        //});



        new ResizeObserver(this._detectChanges).observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });        
    }
    //_detectChanges(mutations, observer) {
//
    //    let mutation = mutations[0];
    //    P.MO.forEach(_mo => {
    //        if (mutation.target.matches(_mo.d)) {
    //            _mo.w.init(mutation.target.closest(_mo.q));
    //            _mo.w.$frm = mutation.target;
    //            _mo.w[_mo.a]();
    //            console.log("CALLED!");
    //        }
    //    });
    //}
    _detectChanges(entries) {
        console.log("CALLED!");

        let entry = entries[0];
        if (entry.target.matches(".frm") || entry.target.matches(".frms")) {
            this.init(entry.target.closest(".frms"));
            this.$frm = entry.target;
            this.resize();
        }
    }
    /**
     * all Events
     */


    
    _resize(e) {
        if (e.animationName === "an-bxd-init" && e.target.matches(this.S.q.frm) && this.init(e.target.closest(".bxd"))) {
            this.$frm = e.target;
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
            this.release(_el);
        }, (window.getComputedStyle(this.$el).transitionDuration.replace("s",""))*1000);

    }
    release(_el) {
        _el.style.removeProperty("--bxd-width");
        _el.style.removeProperty("--bxd-height");
        _el.style.removeProperty("--bxd-width");
        _el.style.removeProperty("--bxd-height");

        this.update("release");
    }
}

const bxd = new Bxd();
bxd.setup();



