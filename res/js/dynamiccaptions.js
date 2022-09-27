//COPYRIGHT © 2022 Hakdaw. All Rights Reserved.

class DynamicCaptions {
    constructor(auth) {
        this._auth = auth;
        this._c_captions = [new Caption('字幕',0 ,'', '', false, 3)];
    }
}

class Caption {
    constructor(name, styleid, title, subtitle, delay, delayTime) {
        this.name = name;
        this.style = styleid;
        this.title = title;
        this.subtitle = subtitle;
        this.delay = delay;
        this.delayTime = delayTime;
    }
}