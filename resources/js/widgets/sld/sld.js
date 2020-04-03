//window.ResizeObserver = require('resize-observer-polyfill');
// يحتاج بعض التحسينات
class Sld extends Widget {
    /**
     * @constructor 
     */
    constructor() {
        /** settings */
        let defaults = {
            el: ".sld",
            scope: document,
            type: "auto",
            effect: "indctrs",// padding | indctrs تحتاج عمل
            q: {
                n: ":not(.sld-n)",
                temp: ".sld-temp",
                next: "[sld-next]",
                prev: "[sld-prev]",
                go: "[sld-go]",
                area: ".sld-area",
                stp: ".sld-stp"
            },
            onlyControle : false,
            defaultInMobile: true,
            //isPrivate: false, // DEV... نسيتها
            // stepX: false, // DEV... تم استبدالها
            // stepY: false, // DEV... تم استبدالها
            //canDrag: false, // تم التخطي
        };


        super(defaults);

    }
    /** Build */
    _build() {
        if (/* this.S.effect == "indctrs" && */ !this.$el.querySelector('.sld--indctrs')) {
            let group = document.createElement("div");
            let indctrs = "<span class='sld--indctr sld--indctr-top'></span><span class='sld--indctr sld--indctr-bottom'></span><span class='sld--indctr sld--indctr-left'></span><span class='sld--indctr sld--indctr-right'></span>";
            group.classList.add("sld--indctrs", ">");
            group.innerHTML = indctrs;
            this.$area.append(group);
        }
        this.D.$indctrs = this.$el.querySelector('.sld--indctrs') || indctrs;



    }
    /**
     * add Events
     */
    _setupEvents() {
        this._startBind = this._start.bind(this);
        this._moveBind = this._move.bind(this);
        this._endBind = this._end.bind(this);
        this._resizeObserverBind = this._resizeObserver.bind(this);

        this._events = {};

        if ('ontouchstart' in window) {
            this._events["touchstart"] = { fn: this._startBind, el: this.S.scope };
            this._events["touchmove"] = { fn: this._moveBind, el: document };
            this._events["touchend"] = { fn: this._endBind, el: document };
            this._events["touchcancel"] = { fn: this._endBind, el: document };
        } else {
            this._events["mousedown"] = { fn: this._startBind, el: this.S.scope };
            this._events["mousemove"] = { fn: this._moveBind, el: document };
            this._events["mouseup"] = { fn: this._endBind, el: window };
        }

        this.RO = new ResizeObserver(this._resizeObserverBind);

        this._addEvents();

    }
    _resizeObserver(entries) {
        this.$area.style.setProperty("--sld-stp-width", entries[0].target.offsetWidth + "px");
        this.$area.style.setProperty("--sld-stp-height", entries[0].target.offsetHeight + "px");
    }
    /**
     * all Events
     */
    _start(e) {
        if (this.init(e) && !this.S.onlyControle) {
            this.update("start");
            if (this.S.resizing) {
                this.RO.disconnect();
            }
            this.updateIndctr(this.$el);
            this._control(e);
            this.__log = {
                cx: (e.clientX || (e.touches ? e.touches[0].clientX : 0)),
                cy: (e.clientY || (e.touches ? e.touches[0].clientY : 0)),
                sx: this.$area.scrollLeft,
                sy: this.$area.scrollTop,
                sw: this.$area.scrollWidth,
                sh: this.$area.scrollHeight,
                maxx: (this.$area.scrollWidth - this.$area.offsetWidth) || 100,
                maxy: (this.$area.scrollHeight - this.$area.offsetHeight) || 100,
                dx: 0,
                dy: 0,
                speed:0, // dev...
            };
            //this.$stp = this.own(e,this.S.q.stp); 
            this.$stp = e.target.closest(this.S.q.stp);
        }
    }
    _move(e) {
        if (this.$el && (this.status === "start" || this.status === "move")) {

            if (this.S.type === "x" || this.S.type === "auto") {
                this._scroll(e, "x");
            }
            if (this.S.type === "y" || this.S.type === "auto") {
                this._scroll(e, "y");
            }
            this.__log.ex = this.$area.scrollLeft;
            this.__log.ey = this.$area.scrollTop;
            this.update("move");
        }
    }
    _scroll(e, type) {
        let clientXY = "client" + type.toLocaleUpperCase(),
            scrollWH = type == "x" ? "scrollWidth" : "scrollHeight",
            clientWH = type == "x" ? "offsetWidth" : "offsetHeight",
            scrollLT = type == "x" ? "scrollLeft" : "scrollTop";

        this.__log._min = this.$area[scrollLT] + this.__log["s" + type] + this.__log["c" + type] - (e[clientXY] || (e.touches ? e.touches[0][clientXY] : 0));

        if ((this.$area[scrollWH] - this.$area[clientWH]) > 5) {
            if ('ontouchstart' in window && this.S.defaultInMobile) {
                this.$area.classList.add("-ovr-a");
            } else {
                this.$area[scrollLT] = this.__log["s" + type] + (this.__log["c" + type] - (e[clientXY] || (e.touches ? e.touches[0][clientXY] : 0)));
            }
            if (this.$area[scrollLT] + this.__log["s" + type] + this.__log["c" + type] - (e[clientXY] || (e.touches ? e.touches[0][clientXY] : 0)) > 0) {
                this.$el.style.setProperty("--sld-" + (type === "x" ? "right" : "bottom"), Math.min(114, this.__log.maxy, this.__log._min));
                this.$el.style.setProperty("--sld-" + (type === "x" ? "left" : "top"), 0);

            } else {
                this.$el.style.setProperty("--sld-" + (type === "x" ? "left" : "top"), Math.min(114, this.__log.maxy, -(this.__log._min)));
                this.$el.style.setProperty("--sld-" + (type === "x" ? "right" : "bottom"), 0);
            }
        }
    }
    _control(e) {
        if (e.target.closest("[sld-next-x]")) {
            this.next(e.target.closest("[sld-next-x]").getAttribute("sld-next-x") || this.$area.offsetWidth, 0);
        }
        if (e.target.closest("[sld-next-y]")) {
            this.next(0, e.target.closest("[sld-next-y]").getAttribute("sld-next-y") || this.$area.offsetHeight);
        }
        if (e.target.closest("[sld-prev-x]")) {
            this.prev(e.target.closest("[sld-prev-x]").getAttribute("sld-prev-x") || this.$area.offsetWidth, 0);
        }
        if (e.target.closest("[sld-prev-y]")) {
            this.prev(0, e.target.closest("[sld-prev-y]").getAttribute("sld-prev-y") || this.$area.offsetHeight);
        }
    }
    _end(e) {
        if (this.status === "start" || this.status === "move") {
            this.update("end");
            if (this.$stp) {
                this._endStp(this.$area.scrollLeft);
            }
        }
    }
    _endStp(_scrollLeft) {
        setTimeout(() => {
            if (this.$area.scrollLeft != _scrollLeft) {
                return this._endStp(this.$area.scrollLeft);
            }
            let P = window.getComputedStyle(this.$area).direction === "rtl" ? "nextElementSibling" : "previousElementSibling",
                N = window.getComputedStyle(this.$area).direction === "rtl" ? "previousElementSibling" : "nextElementSibling",
                x_nextOrPrev = this.__log.sx - this.$area.scrollLeft > 0 ? P : N,
                y_nextOrPrev = this.__log.sy - this.$area.scrollTop > 0 ? "previousElementSibling" : "nextElementSibling",
                _stp = this.$stp;


            if ((this.$area.scrollWidth - this.$area.offsetWidth) && this.S.type === "x" || this.S.type === "auto") {
                _stp = this.getStopStp(this.$stp, this.__log.sx - this.$area.scrollLeft, x_nextOrPrev, "x");
            }

            this.select(_stp);

            // dev.........
            C.animate(this.$indctrs, this._hideIndctrs.bind(this));
        }, 200);
    }
    _hideIndctrs() {
        if (this.status === "end") {
            this.$indctrs.classList.add("-d-n");
        }
    }

    /** control  */
    next(x = this.$area.offsetWidth, y = this.$area.offsetHeight) {
        this.go({ x: x, y: y }, {
            fromX: this.$area.scrollLeft,
            fromY: this.$area.scrollTop
        });
    }
    prev(x = this.$area.offsetWidth, y = this.$area.offsetHeight) {
        this.go({ x: x, y: y }, {
            fromX: this.$area.scrollLeft,
            fromY: this.$area.scrollTop,
            rX: -1,
            rY: -1,
        });
    }
    go(to, _options = {}) {
        let options = _options,
            dir = window.getComputedStyle(this.$area, null).getPropertyValue("direction") === "rtl" ? -1 : 1,
            _top = 0,
            _left = 0,
            _toX = (to.x || to),
            _toY = (to.y || to);
        options.behavior = options.behavior || 'smooth';
        options.fromX = options.fromX || 0;
        options.fromY = options.fromY || 0;
        options.rX = options.rX || 1;
        options.rY = options.rY || 1;
        options.type = options.type || this.S.type;
        if (_toX && typeof _toX === 'string' && _toX.indexOf("%") !== -1) {
            _toX = -(this.$area.scrollWidth - this.$area.offsetWidth) / 100 * Number(_toX.replace("%", ""));
        }
        if (_toY && typeof _toY === 'string' && _toY.indexOf("%") !== -1) {
            _toY = -(this.$area.scrollHeight - this.$area.offsetHeight) / 100 * Number(_toY.replace("%", ""));
        }

        this.$area.scrollTo({
            top: (_toY + options.fromY) * options.rY,
            left: (_toX * dir + options.fromX) * options.rX,
            behavior: options.behavior
        });
    }
    updateIndctr(_el) {
        let _area = _el[this._name_].$area;
        _el.style.setProperty("--sld-width", _area.offsetWidth);
        _el.style.setProperty("--sld-height", _area.offsetHeight);
        _el.style.setProperty("--sld-scroll-width", _area.scrollWidth);
        _el.style.setProperty("--sld-scroll-height", _area.scrollHeight);
        _el.style.setProperty("--sld-scroll-x", _area.scrollWidth - _area.offsetWidth + _area.scrollLeft);
        _el.style.setProperty("--sld-scroll-y", _area.scrollHeight - _area.offsetHeight + _area.scrollTop);
        this.$indctrs.classList.remove("-d-n");
    }
    getStopStp(_stp, _pos, _np, _xy) {
        let offsetWH = _xy === "x" ? "offsetWidth" : "offsetHeight";
        if (Math.abs(_pos) > _stp[offsetWH] * 1.4 && _stp[_np]) {
            return this.getStopStp(_stp[_np], Math.abs(_pos) - _stp[offsetWH], _np, _xy);
        } else {
            if (_stp[_np] && Math.abs(_pos) > _stp[_np][offsetWH] * 0.45) {
                return _stp[_np];
            } else {
                return _stp;
            }
        }
    }
    select(_el, _axis = this.S.type) {
        let dir = window.getComputedStyle(this.$area).direction === "rtl" ? -1 : 1;

        if (_el instanceof String) {
            _el = this.$el.querySelector(_el);
        }
        this.$area.scroll({
            top: (_axis === "y" || _axis === "auto") ? _el.offsetTop : this.$area.scrollTop,
            left: (_axis === "x" || _axis === "auto") ? _el.offsetLeft * dir : this.$area.scrollLeft * dir,
            behavior: 'smooth'
        });
        this.$stp = _el;
        if (this.S.resizing) {
            this.RO.observe(this.$stp);
        }
    }
}

window.sld = new Sld();
sld.setup();



