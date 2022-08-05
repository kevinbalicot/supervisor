const { send } = require("@tamia-web/tamia/modules/common/services/controller");

const ConfigurationRepository = require("../Repository/Configuration");
const Nginx = require("../Service/Nginx");
const Certificate = require("../Service/Certificate");

module.exports = {
    async getConfiguration(req, res) {
        const repository = new ConfigurationRepository(req.requester);
        try {
            send(req, res, await repository.get(req.params.id));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async countConfigurations(req, res) {
        const repository = new ConfigurationRepository(req.requester);

        if (req.query.search) {
            const target = req.query.searchTarget || 'name';
            req.query[target] = new RegExp(req.query.search, 'i');

            delete req.query.search;
            delete req.query.searchTarget;
        }

        send(req, res, await repository.count(req.query));
    },

    async findConfigurations(req, res) {
        const repository = new ConfigurationRepository(req.requester);

        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);

        delete req.query.limit;
        delete req.query.skip;

        if (req.query.search) {
            const target = req.query.searchTarget || 'name';
            req.query[target] = new RegExp(req.query.search, 'i');

            delete req.query.search;
            delete req.query.searchTarget;
        }

        send(req, res, await repository.find(req.query, limit, skip));
    },

    async createConfiguration(req, res) {
        const repository = new ConfigurationRepository(req.requester);
        send(req, res, await repository.create(req.body));
    },

    async editConfiguration(req, res) {
        const repository = new ConfigurationRepository(req.requester);
        try {
            send(req, res, await repository.edit(req.params.id, req.body));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async removeConfiguration(req, res) {
        const repository = new ConfigurationRepository(req.requester);
        const nginx = new Nginx();
        const certificate = new Certificate();

        try {
            const configuration = await repository.get(req.params.id);
            await certificate.removeCertificate(configuration);
            await nginx.removeConfiguration(configuration);

            send(req, res, await repository.remove(req.params.id));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async generateCertificate(req, res) {
        const repository = new ConfigurationRepository(req.requester);
        const nginx = new Nginx();
        const certificate = new Certificate();

        try {
            const configuration = await repository.get(req.params.id);
            await nginx.applyChallengeForConfiguration(configuration);
            await certificate.generate(configuration);
            await nginx.applyConfiguration(configuration);

            send(req, res, null, 204);
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },
}
