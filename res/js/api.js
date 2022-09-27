//COPYRIGHT © 2022 Hakdaw. All Rights Reserved.

class OBSApi {
    constructor(bc_callback) {
        this._bc = new BroadcastChannel('obs_dc');
        this._bc.onmessage = function (ev) {
            bc_callback(ev);
        }
        let _build_broadcast_channel = function () {

        }

        this.init = function() {
            if(this._bc) {
                console.log('[OBSApi]Broadcast Channel has been initialized.')
                return;
            }else {
                this._bc = new BroadcastChannel('obs_dc');
            }
            _build_broadcast_channel();
        }
        this._send_channel_massage = function (msg) {
            if(!this._bc) {
                alert('错误，未初始化');
                console.error('[OBSApi]Api is not initialized.')
                return;
            }
            this._bc.postMessage(msg);
        }
        this._send_data = function (auth, dataObj, operation) {
            dataObj['auth'] = auth;
            dataObj['op'] = operation;
            let data = JSON.stringify(dataObj);
            this._send_channel_massage(data);
        }
        
    }
}

class ControlApi {
    constructor() {
        this._save_file = function(data, fileName) {
            let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, fileName);
        }
        this.save_captions = function (captionsArray, cname) {

            if(captionsArray.length === 0) {
                return;
            }
            let data = [];
            for(let i = 0; i < captionsArray.length; ++i) {
                let caption = captionsArray[i];
                let cdata = {
                    name: caption.name,
                    title: caption.title,
                    subtitle: caption.subtitle,
                    style: caption.style,
                    delay: caption.delay,
                    delay_time: caption.delayTime
                }
                data.push(cdata);
            }
            let jdata = {
                name: cname,
                captions: data
            }
            let json = JSON.stringify(jdata);
            this._save_file(json, cname);

        }
    }
}