//  \__/ 
// (•-•)
//  ⊃🍕 

class Ovrly extends Feature {
    /**
     * @constructor 
     * @param {Object} settings 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: document.body,

        };
        super(defaults);
    }
    /** Update Status */
    _build() {
        P.CSS.TOP_INDEX++;
        if (!this.$el[this._sname_]) {
            this.$el[this._sname_] = {};
            this.$el[this._sname_].$ovrly = document.createElement("div");
            this.$el[this._sname_].$ovrly.$el = this.$el;
            this.$el[this._sname_].$ovrly.classList.add("ovrly");
            this.$el[this._sname_].$ovrly.setAttribute(this._sname_ + "-temp", "");
            this.$el.parentNode.insertBefore(this.$el[this._sname_].$ovrly, this.$el.nextSibling);
            this.clickBind = this.click.bind(this);
            this.$el[this._sname_].$ovrly.addEventListener("click", this.clickBind);
            this.ready = 1;
        }
    }
    // events 
    click(e) {
        this._build();
        this.widget.once(e.target.$el[this.widget.ID]);
        if (this.widget.status === this.config.actions.open) {
            this.widget[this.widget.F[this._sname_].events.close](e);
            this.close();
        }
    }


    // actions 
    open() {
        let $el = this.$el,
            $ovrly = this.$el[this._sname_].$ovrly;
        $ovrly.classList.add("anm");
        if (this.widget.status === this.config.actions.open) {
            this.of($el).update("open");
            C.addTopZIndex($ovrly);
            C.addTopZIndex($el);
            C.animate($ovrly, ["fd-in"]);
        }

    }
    close() {
        let $el = this.$el,
            $ovrly = this.$el[this._sname_].$ovrly;
        C.animate($ovrly, ["fd-out"], () => {
            if (this.widget.status === "end") {
                this.of($el).update("end");
                C.removeZIndex($ovrly);
                C.removeZIndex($el);
            }
        });
    }
}