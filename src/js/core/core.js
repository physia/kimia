
window.P = {
    CSS: {
        TOP_INDEX: 1000
    },
    MO: []
};
class C {
    /**
    * @constructor
    */
    constructor() {

        document.documentElement.classList.remove(":loaded");
        document.addEventListener('DOMContentLoaded', function () {
            document.documentElement.classList.add(":loaded");
        });
        this.P = window.P;
    }

    static addTopZIndex(el) {
        P.CSS.TOP_INDEX++;
        el.style.setProperty("z-index", P.CSS.TOP_INDEX);
    }

    static removeZIndex(el) {
        P.CSS.TOP_INDEX++;
        el.style.removeProperty("z-index");
    }


    static addClasses(_el, _classes) {
        if (_classes instanceof Array) {
            _classes.forEach(_class => {
                _el.classList.add(_class);
            });
        } else {
            _el.classList.add(_classes);
        }
    }

    static removeClasses(_el, _classes) {
        if (_classes instanceof Array) {
            _classes.forEach(_class => {
                _el.classList.remove(_class);
            });
        } else {
            _el.classList.remove(_classes);
        }
    }
    static getAnimationDuration(_el) {
        return window.getComputedStyle(_el).animationDuration.replace("s", "") * 1000;
    }
    static getTransitionDuration(_el) {
        return window.getComputedStyle(_el).transitionDuration.replace("s", "") * 1000;
    }
    static animate(_el, _animations, _onEnd = function (e) { }, endByEvent = false) {
        if (_animations instanceof Function) {
            let _duration = C.getAnimationDuration(_el);
            return setTimeout(() => {
                _animations();
            }, _duration);
        }
        C.addClasses(_el, _animations);
        let onEnd = function (e) {
            //let isIn = _animations instanceof Array ? _animations.includes(e.animationName.replace("anm-", "")) : _animations == e.animationName;
            //if (isIn && e.target == _el) {
            C.removeClasses(_el, _animations);
            if (endByEvent) {
                _el.removeEventListener('animationend', onEnd);
            }
            _onEnd(e);
            //}
        }
        if (endByEvent) {
            _el.addEventListener('animationend', onEnd);
        } else {
            let _duration = C.getAnimationDuration(_el);
            return setTimeout(() => {
                onEnd();
            }, _duration);
        }
    }

    static moveAfter(_el, _ref) {
        _el.parentNode.insertBefore(_ref, _el.nextSibling);
    }

    static asList(_string, _split = " ") {
        return typeof _string === "string" && _string.trim() != "" ? _string.trim().replace(_split + _split, _split).split(" ") : [];
    }

}


window.C = C;

class MO {
    constructor(options) {
        this.observer = new MutationObserver(this.callback);
        this.options = options || { childList: true, subtree: true };
    }

    callback(records) {
        records.forEach(function (record) {
            var list = record.addedNodes;
            var i = list.length - 1;

            for (; i > -1; i--) {
                for (let item in MO.newList) {
                    if (MO.newList.hasOwnProperty(item) && list[i].matches(MO.newList[item])) {
                        window.W[item].class.init(list[i]);
                    }
                }
            }
        });
    }
    on() {
        this.observer.observe(document.body, { childList: true, subtree: true });
    }
    off() {
        this.observer.disconnect();
    }
}
window.MO = MO;
window.MO.newList = {};

