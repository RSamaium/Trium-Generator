"use strict";

class Shortcut {
    
    static get list() {
        return Shortcut._list || {};
    }
    
    static set list(val) {
        if (!Shortcut._list) Shortcut._list = {};
        Shortcut._list = val;
    }
    
    static add(name, fn) {
        Shortcut.list[name] = fn;
    }
    
    static trigger(name, data) {
        if (Shortcut.list[name]) {
            Shortcut.list[name](data);
        }
    }

}

module.exports = Shortcut;