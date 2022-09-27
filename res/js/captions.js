//COPYRIGHT © 2022 Hakdaw. All Rights Reserved.

let dcObject = null;
let obsApi = null;

function anime_0(data) {
    let title = data['title'];
    let dom = document.getElementById('caption_box_style-0');
    dom.innerText = title;
    dom.style.width = '780px';

}

function anime_1(data, opera) {
    let e = document.getElementById('caption_style-1');
    let e0 = document.getElementById('caption_style-1_element-0-0');
    let e1 = document.getElementById('caption_style-1_element-0-1');
    let et = document.getElementById('caption_style-1_element-title');
    let est = document.getElementById('caption_style-1_element-subtitle');

    switch (opera) {
        case 'display':
            et.innerText = data['title'];
            est.innerText = data['subtitle'];

            e.style.opacity = '1';
            e0.style.transform = 'skewX(30deg)';
            setTimeout(function () {
                e1.style.transform = 'skewX(30deg)';
                setTimeout(function () {
                    e1.style.width = '72%';
                    setTimeout(function () {
                        et.style.opacity = '1';
                        est.style.opacity = '1';
                        let delay_time = data['delay_time'];
                        let need_wait = data['delay'] && delay_time > 0;

                        let jdata_data = {
                            action: "anime-end",
                            wait: need_wait
                        };
                        let jdata = {
                            command: "callback-caption",
                            data: jdata_data
                        };

                        setTimeout(function () {
                            obsApi._send_data(dcObject._auth, jdata, 'command');
                        }, 600);

                        if(need_wait) {
                            setTimeout(function () {
                                anime_1(null, 'remove');

                                jdata_data = {
                                    action: "caption-end",
                                    retcode: 0
                                };
                                jdata = {
                                    command: "callback-caption",
                                    data: jdata_data
                                };

                                obsApi._send_data(dcObject._auth, jdata, 'command');
                            }, delay_time * 1000);
                        }

                    },300);
                }, 800);
            }, 180);

            break;

        case 'remove':
            et.style.opacity = '0';
            est.style.opacity = '0';
            e1.style.width = '40px';
            setTimeout(function () {
                e0.style.transform = 'skewX(30deg) translateY(-80px)';
                setTimeout(function () {
                    e1.style.transform = 'skewX(30deg) translateY(-80px)';
                    e.style.opacity = '0';
                }, 180);
            }, 800);
            break;
    }

}

function callAnime_1(data, opera, callback) {
    switch (opera) {
        case 'display':
            anime_1(data, opera);
            setTimeout(callback, 1880);
            break;
        case 'remove':
            anime_1(data, opera);
            setTimeout(callback, 1780);
            break;
    }
}

function playCaption(data) {
    let style_id = data['style'];

    let jdata_data = {
        action: "display",
        style_id : style_id,
        auto_remove: data['delay']
    };
    let jdata = {
        command: "callback-caption",
        data: jdata_data
    };

    obsApi._send_data(dcObject._auth, jdata, 'command');
    switch (style_id) {
        case '0':
            anime_1(data, 'display');
            break;

        case '1':

            break;
    }
}

function remCaption() {
    callAnime_1(null, 'remove', function () {
        let jdata_data = {
            action: "caption-end",
            retcode: 0
        };
        let jdata = {
            command: "callback-caption",
            data: jdata_data
        };

        obsApi._send_data(dcObject._auth, jdata, 'command');
    });
}

function cmd_check_link(data) {
    let jdata = {
        command: "re-check_link",
        data: data
    };
    obsApi._send_data(dcObject._auth, jdata, 'command');
}

function op_command(data) {
    let cmd = data['command'];
    let cdata = data['data'];

    switch (cmd) {
        case 'check_link':
            cmd_check_link(cdata);
            break;
        case 'rem_caption':
            remCaption();
            break;
    }
}

function getData(data) {
    let dataObj = JSON.parse(data);
    let auth = dataObj['auth'];
    if(auth !== 'control') {
        return;
    }
    let opera = dataObj['op'];
    switch (opera) {
        case 'command':
            op_command(dataObj);
            break;
        case 'caption':
            playCaption(dataObj);
            break;
        default:
            console.error('[CAPTION]Unknown Operation.')
            break;
    }
}

function init() {
    dcObject = new DynamicCaptions('receive');
    obsApi = new OBSApi(function (ev) {
        console.log(ev.data);
        getData(ev.data);
    });

    obsApi.init();
}

init();