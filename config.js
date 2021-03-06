const fs = require('fs');

/**
 * 获取 application.config.json
 * @returns {{
 * port: number,
 * env: string,
 * staticPath: string,
 * frontAddress: string, 
 * logDirectory: string,
 * exampleMode: boolean,
 * tokenSecret: string,
 * tokenExpires: number,
 * wechatTokenFile: string,
 * }}
 */
exports.application = function () {
    try {
        return JSON.parse(fs.readFileSync('./config/application.config.json'));
    } catch (_) {
        return {};
    }
}

/**
 * 获取 database.config.json
 * @returns {{}}
 */
exports.database = function () {
    try {
        return JSON.parse(fs.readFileSync('./config/database.config.json'));
    } catch (_) {
        return {};
    }
}

/**
 * 
 * @returns {{
 *  appid: string, 
 *  appsecret: string,
 * }}
 */
exports.token = function () {
    try {
        return JSON.parse(fs.readFileSync('./config/test.wechat.config.json'));
    } catch (_) {
        return {};
    }
}