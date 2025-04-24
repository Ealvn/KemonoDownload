// ==UserScript==
// @name            Kemono下载当前页面
// @description     Kemono下载当前页面
// @author          Ealvn
// @license         MIT
// @match           https://kemono.su/*
// @icon            https://kemono.party/static/favicon.ico
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// ==/UserScript==


(function () {

    // const language = navigator.language || navigator.userLanguage;

    // var openInNew = GM_getValue('OpenInNew', false);

    // let openInNewId = GM_registerMenuCommand(`[${openInNew ? "✔" : "✖"}]新建标签页打开`, openInNew_callback);

    // function openInNew_callback() {
    //     GM_unregisterMenuCommand(openInNewId);
    //     openInNew = !openInNew;
    //     GM_setValue('OpenInNew', openInNew);
    //     openInNewId = GM_registerMenuCommand(`[${openInNew ? "✔" : "✖"}]新建标签页打开`, openInNew_callback);
    // }

    // var domain = GM_getValue('Domain', 'kemono.party');

    // let domainId = GM_registerMenuCommand(`当前域名：${domain}`, domain_callback);

    // function domain_callback() {
    //     var result = prompt(language === 'zh-CN' ? '请输入域名, 例如kemono.su' : 'Please enter the domain name, for example kemono.su', domain);
    //     if (!result) return;
    //     domain = result;
    //     GM_setValue('Domain', domain);
    //     GM_unregisterMenuCommand(domainId);
    //     domainId = GM_registerMenuCommand(`当前域名：${domain}`, domain_callback);
    // }



    //创建容器
    const item = document.createElement('item');
    item.id = 'SIR';
    item.innerHTML = `
        <button class="SIR-button">一键下载当前页面</button>
        `;

    document.body.append(item)

    //创建样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* Light mode */
        @media (prefers-color-scheme: light) {
            #SIR * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }
            #SIR .SIR-button {
                display: inline-block;
                height: 22px;
                margin-right: 10px;
                opacity: 0.5;
                background: white;
                font-size: 13px;
                padding:0 5px;
                position:fixed;
                bottom:2px;
                right:2px;
                border: solid 2px black;
                z-index: 9999;
            }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            #SIR * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }
            #SIR .SIR-button {
                display: inline-block;
                height: 22px;
                margin-right: 10px;
                opacity: 0.5;
                font-size: 13px;
                padding:0 5px;
                position:fixed;
                bottom:2px;
                right:2px;
                border: solid 2px white;
                z-index: 9999;
            }
        }
        
        `;

    const button = item.querySelector('.SIR-button')
    button.onclick = async () => {
        await DownloadAll();
    }

    document.head.append(style)
})();

async function DownloadAll() {
    
    var download_list = document.querySelectorAll("div.post__thumbnail");
    for(var i = 0; i < download_list.length; i++){
        var download_url = download_list[i].querySelector("a.fileThumb").href;
        var url = download_url.toString().split("?f=")[0];
        var filename = url.split("/").pop();
        // download image
        await downloadImage(url, filename);
    }
}

async function downloadImage(url, name){
    fetch(url)
      .then(resp => resp.blob())
      .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          // the filename you want
          a.download = name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('An error sorry'));
}
