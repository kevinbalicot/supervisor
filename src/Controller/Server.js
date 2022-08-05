const { send } = require("@tamia-web/tamia/modules/common/services/controller");

const ServerRepository = require("../Repository/Server");

module.exports = {
    async getServer(req, res) {
        const repository = new ServerRepository(req.requester);
        try {
            send(req, res, await repository.get(req.params.id));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async countServers(req, res) {
        const repository = new ServerRepository(req.requester);

        if (req.query.search) {
            const target = req.query.searchTarget || 'name';
            req.query[target] = new RegExp(req.query.search, 'i');

            delete req.query.search;
            delete req.query.searchTarget;
        }

        send(req, res, await repository.count(req.query));
    },

    async findServers(req, res) {
        const repository = new ServerRepository(req.requester);

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

    async createServer(req, res) {
        const repository = new ServerRepository(req.requester);
        send(req, res, await repository.create(req.body));
    },

    async editServer(req, res) {
        const repository = new ServerRepository(req.requester);
        try {
            send(req, res, await repository.edit(req.params.id, req.body));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async removeServer(req, res) {
        const repository = new ServerRepository(req.requester);
        try {
            send(req, res, await repository.remove(req.params.id));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },
}
