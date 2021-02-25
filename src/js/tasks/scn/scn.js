//  \__/ 
// (•-•)
//  ⊃🍕 


const callback = function (mutationsList, observer) {
    for (let mutation of mutations) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.', mutation);
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified to:', mutation);
        }
    }
};
new MutationObserver(callback).observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
});

class Scn extends Task {
    /**
     * @constructor 
     * @param {Object} settings 
     */
    constructor() {
        /** defaults */
        let defaults = {};
        super(defaults);
    }
    /** Update Status */
    _build() {
        P.CSS.TOP_INDEX++;
        if (!this.$scn) {
            this.$scn = document.createElement("div");
            this.$scn.classList.add("scn");
            this.$scn.setAttribute(this._sname_ + "-temp", "");            
            this.$el.parentNode.insertBefore(this.$scn, this.$el.nextSibling);
        }
        this.clickBind = this.click.bind(this);
        this.$scn.addEventListener("click", this.clickBind);
        
        this.ready = 1;
    }
    // events 
    click(e) {
        this.widget[this.widget.F[this._sname_].events.click](e);
    }


    // actions 
    open() {
        this.update("open");

        C.addTopZIndex(this.$scn);
        C.addTopZIndex(this.$el);
        C.animate(this.$scn, ["anm", "fd-in"]);

    }
    close() {
        this.update("close");
        C.animate(this.$scn, ["anm", "fd-out"], this.end.bind(this));

    }
    end() {
        this.update("end");
        C.removeZIndex(this.$scn);
        C.removeZIndex(this.$el);
    }
}