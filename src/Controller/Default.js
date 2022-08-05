const { send } = require("@tamia-web/tamia/modules/common/services/controller");
const { version, name } = require('../../package.json');
const { NODE_ENV = 'dev', LOCALE = 'en' } = process.env;

module.exports = {
    getApplicationInfo(req, res) {
        return send(req, res, { locale: LOCALE, env: NODE_ENV, allowAnonymous: true, version, name });
    }
}
