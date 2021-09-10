export const imageFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'];    // 图片文件类型数组

export const audioFileTypes = ['audio/opus', 'audio/flac', 'audio/webm', 'audio/weba', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mp3', 'audio/oga', 'audio/mid', 'audio/amr', 'audio/aiff', 'audio/wma', 'audio/au', 'audio/aac',]; // 音频文件类型数组

export const videoFileTypes = ['video/ogm', 'video/wmv', 'video/mpg', 'video/webm', 'video/ogv', 'video/mov', 'video/asx', 'video/mpeg', 'video/mp4', 'video/m4v', 'video/avi',];   // 视频文件类型数组

/**
 * 检查文件类型
 * @param {File} file 文件对象
 * @param {string[]} fileTypes 文件类型数组
 * @returns {boolean} 是否属于文件类型数组
 */
export function validFileType(file, fileTypes) {
    console.log('file.type：' + file.type);
    return fileTypes.includes(file.type);
}

/**
 * 检查文件是否为图片
 * @param {File} file 文件对象
 * @returns {boolean} 是否属于图片类型
 */
export function validImageType(file) {
    return validFileType(file, imageFileTypes);
}

/**
 * 返回带单位的文件大小
 * @param {*} number 以字节为单位
 * @returns {string}
 */
export function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}

/**
 * 通过文件路径获取图片的宽高
 * @param {string} fileUrl 文件URL
 * @returns {Promise<HTMLImageElement>}
 */
export function getImage(fileUrl) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        let res = {}
        img.onload = () => {
            res = img;
            resolve(res)
        };
        img.onerror = () => {
            reject('图片加载失败')
        }
        img.src = fileUrl
    })
}

/**
 * 校验文件名是否合法
 * @param {string} fileName 
 * @returns {boolean}
 */
export function validateFileName(fileName) {
    var reg = new RegExp('[\\\\/:*?\"<>|]');
    if (reg.test(fileName)) {
        //"上传的文件名不能包含【\\\\/:*?\"<>|】这些非法字符,请修改后重新上传!";
        return false;
    }
    return true;
}

/**
 * 替换不合法的文件名中的字符
 * @param {string} fileName 
 * @param {string} replaceChar
 * @returns 
 */
export function correctingFileName(fileName, replaceChar = '-') {
    return fileName.replace(/[\\\/:*?"<>|]+/g, replaceChar);
}

/**
 * 获取文件后缀名（包括点号）
 * @param {string} fileName 
 * @returns 
 */
export function getExtName(fileName) {
    var p = fileName.lastIndexOf('.');
    if (p == -1) {  // 无后缀名
        return '';
    } else {
        return fileName.slice(p);   // 带有点号
    }
}

/**
 * 文件名拼接前后缀（文件名可能带有文件夹路径）
 * @param {string} fileName 
 * @param {string} [prefix] 前缀
 * @param {string} [suffix] 后缀
 * @returns 
 */
export function expandFileName(fileName, prefix = '', suffix = '') {
    let step1 = ''; // 先处理后缀
    let step2 = ''; // 再处理前缀
    if (!prefix) prefix = '';
    if (!suffix) suffix = '';
    var p = fileName.lastIndexOf('.');
    if (p == -1) step1 = fileName + suffix;
    else step1 = fileName.slice(0, p) + suffix + fileName.slice(p);
    var d = Math.max(step1.lastIndexOf('/'), step1.lastIndexOf('\\'));
    if (d == -1) step2 = prefix + step1;
    else step2 = step1.slice(0, d + 1) + suffix + step1.slice(d + 1);
    return step2;
}


/**
 * 获取字符串比特长度
 * @param {string} str 字符串
 * @returns {number} 长度
 */
export function getByteLength(str) {
    var length = 0;
    Array.from(str).map(function (char) {
        if (char.charCodeAt(0) > 255) {//字符编码大于255，说明是双字节字符
            length += 2;
        } else {
            length++;
        }
    });
    return length;
}

/**
 * 获取文本px宽度
 * @param font{String} 字体样式，相当于CSS的font
 * @param str{String} 要测量的字符串
 */
export function getPxWidth(font, str) {
    // re-use canvas object for better performance
    var canvas = getPxWidth.canvas || (getPxWidth.canvas = document.createElement("canvas")),
        context = canvas.getContext("2d");
    font && (context.font = font);
    var metrics = context.measureText(str);
    return metrics.width;
}

/**
* 使用 FileReader 读取该文件
* @param {File} f
* @returns {Promise} reslove 文件的dataUrl，或者 reject 错误原因
*/
export function readFile(f) {
    let promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            console.log('|| 读取到文件长度：%d', this.result.length);
            let res = this.result; // 'url(' + this.result + ')';
            // 返回 dataUrl
            resolve(res);
        }
        reader.onerror = function (e) {
            let err = "文件" + e.name + ', ' + e.size + ', ' + e.type + ' 加载出错！';
            console.log(err);
            reject(err);
        }
        reader.readAsDataURL(f);    // 读取成 图片src 可用的格式。Image的style.image 支持 dataUrl 格式
    });
    return promise;
}

/**
 * 判断浏览器类型，神奇的是都有Safari，但有先后顺序可排序，可能是兼容版本的意思。
 * @returns {string} 浏览器名称
 */
export function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.toLocaleLowerCase().indexOf("micromessenger") != -1) {
        return "micromessenger";
    }
    if (userAgent.indexOf("Opera") > -1) {
        return "Opera";
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器（苹果机上的edge也被识别为Safari）
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
    if (userAgent.indexOf("Trident") > -1) {
        return "Edge";
    } //判断是否Edge浏览器
}

/**
 * 是否在微信浏览器中
 * @return {boolean}
 */
export function isInWeChat() {
    return 'micromessenger' == myBrowser();
}

/**
 * 判断设备类型
 * @returns 
 */
export function deviceType() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var isWindows = u.indexOf('Windows') > -1;  //windows
    if (isIOS) {
        return 1;
    }
    if (isAndroid) {
        return 2;
    }
    if (isWindows) {
        return 3;
    }
}

/**
 * 获取窗口实际宽度
 * @returns {number} 窗口宽度
 */
export function getWindowWidth() {
    let winWidth;
    // 获取窗口宽度
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    console.log('|| winWidth: %O', winWidth);
    return winWidth;
}

/**
 * 获取窗口实际宽度
 * @returns {number} 窗口宽度
 */
export function getWindowHeight() {
    let winHeight;
    // 获取窗口宽度
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    console.log('|| winHeight: %O', winHeight);
    return winHeight;
}

function findFirstPositive(b, a, i, c) {
    c = (d, e) => e >= d ? (a = d + (e - d) / 2, 0 < b(a) && (a == d || 0 >= b(a - 1)) ? a : 0 >= b(a) ? c(a + 1, e) : c(d, a - 1)) : -1
    for (i = 1; 0 >= b(i);) i *= 2
    return c(i / 2, i) | 0
}

export function getDpi() {
    // 导致 ios edge 卡死
    const dpi = findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches)
    return dpi;
}

/**
 * 根据秒数得到格式化的时长 mm:ss 或 hh:mm:ss
 * @param {number} seconds 
 */
export function formatDuration(seconds) {
    if (seconds == 0) return '00:00';
    let sign = seconds < 0 ? '-' : '';
    let d = Math.abs(seconds);
    let s = d % 60;
    let ss = s.toFixed();
    if (s < 10) ss = '0' + ss;
    d = Math.floor(d / 60);
    if (d == 0)
        return sign + '00:' + ss;

    let m = d % 60;
    let mm = m.toFixed();
    if (m < 10) mm = '0' + mm;
    d = Math.floor(d / 60);
    if (d == 0)
        return sign + mm + ':' + ss;

    let h = d.toFixed();
    return sign + h + ':' + mm + ':' + ss;
}