class Wv extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** defaults */
        let defaults = {
            el: ".btn,.wv",
            scope: document,
            overflow: "hidden",
            q: {
                n: ":not(.wv-n)",
                temp: ".wv-temp",
                circle: ".wv-c",
                area: ".wv-area",
                fld: ".wv-fld",
                ripples: ".wv-ripples",
                ripple: ".wv-ripple",
            },
            clean: true,// dev
            mode: "normal", // dev
            content: false, // dev
        };
        super(defaults);


    }
    /** Setup target */
    _build() {
        let $ripples = this.getTempChild(this.Q("ripples"));
        if (!$ripples) {
            this.D.$ripples = this.$area.querySelector(this.Q("ripples")) || document.createElement("div");
            this.D.$ripples.classList.add("wv--ripples", "wv-temp", "-o-h", "u-f", "abs", ".r", ".t", "-r-i", "-pe-n");
            this.$area.prepend(this.D.$ripples);
        }

    }
    /**
     * setup Events
     */
    _setupEvents() {
        this._startEventBind = this._startEvent.bind(this);
        this._endEventBind = this._endEvent.bind(this);

        if ('ontouchstart' in window) {
            this._events["touchstart"] = { fn: this._startEventBind, el: this.S.scope };
            this._events["touchend"] = { fn: this._endEventBind, el: this.S.scope };
            this._events["touchcancel"] = { fn: this._endEventBind, el: document };
        } else {
            this._events["mousedown"] = { fn: this._startEventBind, el: this.S.scope };
            this._events["dragend"] = { fn: this._endEventBind, el: document };
            this._events["mouseup"] = { fn: this._endEventBind, el: document };
        }
        this._events["blur"] = { fn: this._endEventBind, el: document };

        this._addEvents();

    }
    /**
     * all Events
     */
    _startEvent(e) {
        this.init(e, () => {
            let $ripples = this.D.$ripples,
                $ripple = this.D.$ripple = document.createElement("span"),
                _areaRect = this.$area.getBoundingClientRect(),
                _clientX = (e.clientX || e.touches[0].clientX),
                _clientY = (e.clientY || e.touches[0].clientY);

            $ripple.classList.add("wv--ripple", "anm");
            $ripple.style.setProperty("--wv-diameter",
                Math.sqrt(
                    Math.pow(
                        Math.max(
                            _clientX - _areaRect.left, _areaRect.width - (_clientX - _areaRect.left)
                        ), 2
                    ) +
                    Math.pow(
                        Math.max(
                            _clientY - _areaRect.top, _areaRect.height - (_clientY - _areaRect.top)
                        ), 2
                    )
                ) * 2
            );

            $ripple.style.setProperty("--wv-x", _clientX - _areaRect.x);
            $ripple.style.setProperty("--wv-y", _clientY - _areaRect.y);

            $ripples.appendChild($ripple);

            C.animate($ripple, ["wv--ripple-in"], () => {
                if (this.status === "end") {
                    C.animate($ripple, ["wv--ripple-out"], () => {
                        $ripple.remove();
                    }, 0);
                } else {
                    this.on("end", () => {
                        C.animate($ripple, ["wv--ripple-out"], () => {
                            $ripple.remove();
                        }, 0);
                    }, { once: true });
                }
            },0);
        }, "start");
    }
    _endEvent(e) {
        this.update("end");
    }

}

Wv.new({ el: ".unt,.wv" });


