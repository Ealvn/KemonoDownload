// ==UserScript==
// @name            Kemono下载当前页面
// @description     Kemono下载当前页面的所有图片
// @version         1.0.3
// @author          Ealvn
// @license         MIT
// @match           https://kemono.su/*
// @icon            https://kemono.party/static/favicon.ico
// @grant           GM_download
// @grant           GM_getResourceText
// @grant           GM_info
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1377032
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
        <input type="text" id="filename" placeholder="文件名..." size="16">
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
            #filename {
                display: inline-block;
                height: 22px;
                opacity: 0.5;
                font-size: 13px;
                position:fixed;
                bottom:27px;
                right:12px;
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
            #filename {
                display: inline-block;
                height: 22px;
                opacity: 0.5;
                font-size: 13px;
                position:fixed;
                bottom:27px;
                right:12px;
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
    var text_input = document.getElementById("filename").value;
    for(var i = 0; i < download_list.length; i++){
        var download_url = ""
        try{
            download_url = download_list[i].querySelector("a.fileThumb").href;
        } catch (error) {
            download_url = download_list[i].querySelector("img").src;
        }finally {
            var url = download_url.toString().split("?f=")[0];
            var filename = decodeURI(document.querySelector("h1.post__title>span").innerHTML);
            if(text_input != ""){
                filename = text_input;
            }
            filename = filename + "_" + i.toString();
            // download image
            console.log(" " + i + " " + url)
            setTimeout(downloadImage(url, filename),500);
        };
    }
}

function downloadImage(url, name, retries = 3) {
    fetch(url, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
      .then(resp => {
          if (!resp.ok) {
              throw new Error(`HTTP error! status: ${resp.status}`);
          }
          return resp.blob();
      })
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
      .catch(error => {
          if (retries > 0) {
              console.warn(`Download failed for ${url}. Retrying... (${retries} attempts left)`);
              // Wait a short duration before retrying
              setTimeout(() => downloadImage(url, name, retries - 1), 1000);
          } else {
              console.error(`Download failed for ${url} after multiple retries:`, error);
              alert(`Failed to download ${name}`);
          }
      });
}
