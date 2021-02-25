
class Physia {
    /**
    * @constructor
    */
    constructor(based) {
        this._B_ = based[0].toLocaleUpperCase();
        this._Nid_ = Date.now();
        this._name_ = this.constructor.name || this.name;
        this._id_ = this._name_ + "_" + this._Nid_;
        this._sname_ = this._name_.toLocaleLowerCase();
        this._logname_ = this._sname_;
        this._data_ = this._name_ + "_D_" + this._Nid_;
    }

    /** registe  */ // DEV...
    registe() {
        if (window[this._B_]) {
            if (window[this._B_][this._sname_]) {
                window[this._B_][this._sname_].list[this._id_] = this;
                window[this._name_] = window[this._name_] || this.constructor;
            } else {
                window[this._B_][this._sname_] = {
                    enabled: true, // In dev...
                    list: [],
                    class: this.constructor,
                };
                this.registe();
            }
        } else {
            window[this._B_] = {};
            this.registe();
        }
    }
    // DEV...
    static disable(_status = "disable") {
        if (window[this._B_]) {
            if (window[this._B_][this._name_]) {
                window[this._B_][this._name_].count = window[this._B_][this._name_].count == undefined ? 0 : window[this._B_][this._name_].count++;
                window[this._B_][this._name_].rippleCount = window[this._B_][this._name_].rippleCount == undefined ? 0 : window[this._B_][this._name_].rippleCount++;
            } else {
                window[this._B_][this._name_] = {};
                this.registe();
            }
        } else {
            window[this._B_] = {};
            this.registe();
        }
    }

    //
    by(id, b = this._B_) {
        return window[this._B_][id] || undefined;
    }


}

