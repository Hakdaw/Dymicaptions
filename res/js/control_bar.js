//COPYRIGHT © 2022 Hakdaw. All Rights Reserved.

let dcObject = null;
let obsApi = null;
let ctrlApi = null;

let isLinkCaption = false;
let captionIndex = 0;

function buttonStyle(button, event) {
    switch (event) {
        case 'focus':
            button.style.boxShadow = '0 0 8px #2424E0';
            break;
        case 'click':
            break;
        case 'default':
            button.style.boxShadow = null;
            break;
        default:
            button.style.boxShadow = null;
            break;
    }
}

function changeDisplayMode(mode, displayCSS) {
    console.log('[INFO]Change Display Mode:' + mode);
    switch (mode) {
        case 'dark':
            displayCSS.href = 'res/css/dark.css';
            break;
        case 'light':
            displayCSS.href = 'res/css/light.css';
            break;
        default:
            displayCSS.href = 'res/css/dark.css';
            break;
    }
}

function linkCaption() {
    let data = {
        command: 'check_link',
        data: '0'
    };
    obsApi._send_data(dcObject._auth, data, 'command');
}

function opPushRemBtn(enable) {
    let dom = document.getElementById('btn_rem-caption');
    if(enable) {
        dom.className = 'primary-button';
        dom.disabled = false;
    }else {
        dom.className = 'disabled-button';
        dom.disabled = true;
    }

}

function pushCaption(caption, auth) {
    linkCaption();
    if(!isLinkCaption) {
        alert('无法连接Captions页面，请检查OBS是否正确添加Captions源后重试');
        return;
    }
    let data = {
        title: caption.title,
        subtitle: caption.subtitle,
        style: caption.style,
        delay: caption.delay,
        delay_time: caption.delayTime
    };
    obsApi._send_data(auth, data, 'caption');
}

function renameCaption(dom, name) {
    dom.innerText = name;
}

function removeCaption(id, esp_id) {
    document.getElementById('main_container').removeChild(document.getElementById(id));
    document.getElementById('main_container').removeChild(document.getElementById(esp_id));
}

function pushRemCaption() {
    opPushRemBtn(false);
    let data = {
        command: 'rem_caption',
        data: 0
    };
    obsApi._send_data('control', data, 'command');
}

function saveCaptions() {
    let name = prompt('保存当前字幕文件为（文件名）:', '字幕配置表');
    name = name + '.json';

    let doms = document.getElementsByClassName('caption-content-box');
    let captions = [];
    for(let i = 0; i < doms.length; ++i) {
        let dom = doms[i];
        let caption = new Caption(dom.getElementsByClassName('subtitle').item(0).innerText, dom.getElementsByTagName('select').item(0).value, dom.getElementsByTagName('input').item(0).value, dom.getElementsByTagName('input').item(1).value, dom.getElementsByTagName('input').item(2).checked, dom.getElementsByTagName('input').item(3).value);
        captions.push(caption);
    }
    if(!ctrlApi) {
        ctrlApi = new ControlApi();
    }
    ctrlApi.save_captions(captions, name);
}

function addCaption(idIndex,caption) {

    let cb_caption_content_html = `
    <div class="content-bar">
        <div class="content-bar-key">
            样式
        </div>
        <div class="content-bar-value">
            <select name="btn_select_style" class="default-select" onmouseenter="buttonStyle(this, 'focus');" onmouseleave="buttonStyle(this, 'default');">
                <option value='0'>默认样式</option>
                <option value='1'>体育节样式</option>
            </select>
        </div>
    </div>
    <div class="content-bar">
        <div class="content-bar-key">
            标题
        </div>
        <div class="content-bar-value">
            <input name="input_title" type="text" class="default-input" onmouseenter="buttonStyle(this, 'focus');" onmouseleave="buttonStyle(this, 'default');" />
        </div>
    </div>
    <div class="content-bar">
        <div class="content-bar-key">
            副标题
        </div>
        <div class="content-bar-value">
            <input name="input_subtitle" type="text" class="default-input" onmouseenter="buttonStyle(this, 'focus');" onmouseleave="buttonStyle(this, 'default');" />
        </div>
    </div>
    <div class="content-bar">
        <div class="content-bar-key">
            延迟退场
        </div>
    <div class="content-bar-value" style="display: flex;">
        <input name="btn_check_delay" type="checkbox" class="default-checkbox" />
        <input name="input_delay" type="number" class="default-input" style="width: 160px;" min="0" value="3.0" onmouseenter="buttonStyle(this, 'focus');" onmouseleave="buttonStyle(this, 'default');" />&emsp;秒
    </div>
    </div>

    <div class="content-bar">
        <input name="btn_push_caption" type="button" class="primary-button" value="推送" onmouseenter="buttonStyle(this, 'focus');" onmouseleave="buttonStyle(this, 'default');" />
        <div style="width: 8px;"></div>
        <input name="btn_delete" type="button" class="import-button" value="删除" onmouseenter="buttonStyle(this, 'focus');" onmouseleave="buttonStyle(this, 'default');" />
    </div>
`;

    let e_cb = document.createElement('div');
    let e_st = document.createElement('div');
    let e_st_icon = document.createElement('div');
    let e_st_t = document.createElement('div');
    let e_con = document.createElement('div');
    let e_space = document.createElement('div');

    e_st.className = 'subtitle_bar';
    e_st_icon.className = 'icon';
    e_st_t.className = 'subtitle';
    e_st_t.style.cssText = 'padding-left: 8px;cursor: pointer;';
    e_st_icon.innerText = '\u25C6';
    e_st_t.innerText = caption.name;
    e_st_t.onclick =function () {
        let name = prompt('重命名 \"' + e_st_t.innerText + '\":', e_st_t.innerText);
        if(name) {
            renameCaption(e_st_t, name);
        }
    }

    e_con.innerHTML = cb_caption_content_html;

    e_st.appendChild(e_st_icon);
    e_st.appendChild(e_st_t);

    e_space.style.height = '8px';
    let e_sp_id = 'cb_space-' + idIndex
    e_space.id = e_sp_id;

    let e_cb_id = 'cb_caption-' + idIndex
    e_cb.id = e_cb_id;
    e_cb.name = 'con-caption-box';
    e_cb.className = 'caption-content-box';
    e_cb.appendChild(e_st);
    e_cb.appendChild(e_con);

    e_cb.getElementsByTagName('select').item(0).value = caption.style;
    e_cb.getElementsByTagName('input').item(0).value = caption.title;
    e_cb.getElementsByTagName('input').item(1).value = caption.subtitle;
    e_cb.getElementsByTagName('input').item(2).checked = caption.delay;
    e_cb.getElementsByTagName('input').item(3).value = caption.delayTime;
    e_cb.getElementsByClassName('primary-button').item(0).onclick = function () {
        let dom = document.getElementById(e_cb_id);
        let caption = new Caption(dom.getElementsByClassName('subtitle').item(0).innerText, dom.getElementsByTagName('select').item(0).value, dom.getElementsByTagName('input').item(0).value, dom.getElementsByTagName('input').item(1).value, dom.getElementsByTagName('input').item(2).checked, dom.getElementsByTagName('input').item(3).value);
        opPushRemBtn(false);
        pushCaption(caption, 'control');
    };

    e_cb.getElementsByClassName('import-button').item(0).onclick = function () {
        removeCaption(e_cb_id, e_sp_id);
    };

    document.getElementById('main_container').appendChild(e_space);
    document.getElementById('main_container').appendChild(e_cb);

}

function addDefaultCaption() {
    let default_caption = new Caption('字幕'+captionIndex, 0, '', '', false, 3);
    addCaption(captionIndex, default_caption);
    ++captionIndex;
}

function opPushBtn(enable) {
    let doms = document.getElementsByName('btn_push_caption');
    let dom_len = doms.length
    if(enable) {
        for(let i = 0; i < dom_len; ++i) {
            doms[i].className = 'primary-button';
            doms[i].disabled = false;
        }
    }else{
        for(let i = 0; i < dom_len; ++i) {
            doms[i].className = 'disabled-button';
            doms[i].disabled = true;
        }
    }
}

function cmd_caption_callback(data) {
    let cdata = data['data'];
    let action = cdata['action'];


    let auto_remove = false;
    switch (action) {
        case 'display':
            let style_id = cdata['style_id'];
            auto_remove = cdata['auto_remove'];
            opPushBtn(false);
            opPushRemBtn(false);
            break;
        case 'anime-end':
            if(!cdata['wait']){
                opPushRemBtn(true);
            }
            break;
        case 'caption-end':
            opPushBtn(true);
            opPushRemBtn(false);
            break;
    }
}

function op_command(data) {
    let cmd = data['command'];
    let cdata = data['data'];

    switch (cmd) {
        case 're-check_link':
            isLinkCaption = true;
            break;

        case 'callback-caption':
            cmd_caption_callback(data);
            break;
    }
}

function getData(data) {
    let dataObj = JSON.parse(data);
    let auth = dataObj['auth'];
    if(auth !== 'receive') {
        return;
    }
    let opera = dataObj['op'];
    switch (opera) {
        case 'command':
            op_command(dataObj);
            break;
        default:
            console.error('[CONTROL]Unknown Operation.')
            break;
    }
}

function init() {
    dcObject = new DynamicCaptions('control');
    obsApi = new OBSApi(function (ev) {
        console.log(ev.data);
        getData(ev.data);
    });

    ctrlApi = new ControlApi();

    obsApi.init();

    linkCaption();

    let default_caption = new Caption('字幕'+captionIndex, 0, '', '', false, 3);
    addCaption(captionIndex, default_caption);
    ++captionIndex;
}

init();