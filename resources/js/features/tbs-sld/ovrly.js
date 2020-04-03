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
        if (!this.$ovrly) {
            this.$ovrly = document.createElement("div");
            this.$ovrly.classList.add("ovrly");
            this.$ovrly.setAttribute(this._sname_ + "-temp", "");            
            this.$el.parentNode.insertBefore(this.$ovrly, this.$el.nextSibling);
        }
        this.clickBind = this.click.bind(this);
        this.$ovrly.addEventListener("click", this.clickBind);
        
        this.ready = 1;
    }
    // events 
    click(e) {
        this.close();
        this.widget[this.widget.F[this._sname_].events.close](e);
    }


    // actions 
    open() {
        this.update("open");

        C.addTopZIndex(this.$ovrly);
        C.addTopZIndex(this.$el);
        C.animate(this.$ovrly, ["anm", "fd-in"]);

    }
    close() {
        this.update("close");
        C.animate(this.$ovrly, ["anm", "fd-out"], this.end.bind(this));

    }
    end() {
        if (this.status === "close") {
            this.update("end");
            C.removeZIndex(this.$ovrly);
            C.removeZIndex(this.$el);
        }
    }
}