class Mnu extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el                  : ".mnu",
            scope               : document,
            q                   : {
                n       : ":not(.mnu-n)",
                temp    : ".mnu-temp",
                keep    : ".mnu-keep",
                close   : ".mnu-close",
                area    : ".mnu-area"
            },
        };
        super(defaults);


    }
    /** Setup target */
    _build() {
        if (!this.D.$mnu_sb) {
            mnu.update("_build");
            let $mnu_sb = this.$el.querySelector(".mnu-sb"),
                $mnus = this.$el.closest(".mnus");
            $mnus.appendChild($mnu_sb);
            this.D.$mnus = $mnus;
            this.D.$mnu_sb = $mnu_sb;
            this.D.$mnus.style.width = this.D.$mnus.offsetWidth;
            this.D.$mnus.style.height = this.D.$mnus.offsetHeight;

        }

        this.D.$mnus.style.width = this.D.$mnu_sb.offsetWidth;
        this.D.$mnus.style.height = this.D.$mnu_sb.offsetHeight;

    }
    /**
     * setup Events
     */
    _setupEvents() {
        this._toggleBind                    = this._toggle.bind(this);

        this._events["click"]               = { fn: this._toggleBind, el: this.$.scope };

        this._addEvents();

    } 
    /**
     * all Events
     */

    _toggle(e) {
        if (this.status !== "open") {
            this._open(e);
        } else {
            this._close(e);
        }
    }
    _open(e) {
        if (this.status !== "open" && this.init(e)) {
            this.open();
        }
    }

    _close(e) {
        if (this.status == "open" && e.target.closest(this.$.q.close) || e.key == "Escape" || !(this.$mnu_sb === e.target.closest(this.$.q.keep) || this.$mnu_sb.contains(e.target.closest(this.$.q.keep)))) {
            this.close();
        }
    }

    toggle() {
        if (this.status === "close") {
            this.open();
        } else {
            this.close();
        }
    }
    open() {
        this.update("open");
    }
    close() {
        this.update("close");
    }
    
}
const mnu = Mnu.new({ el: ".mnu" });


