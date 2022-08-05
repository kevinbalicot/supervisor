const { send } = require("@tamia-web/tamia/modules/common/services/controller");
const InstanceRepository = require("../Repository/Instance");
const Deployer = require("../Service/Deployer");

module.exports = {
    async countInstances(req, res) {
        const repository = new InstanceRepository(req.requester);

        if (req.query.search) {
            const target = req.query.searchTarget || 'name';
            req.query[target] = new RegExp(req.query.search, 'i');

            delete req.query.search;
            delete req.query.searchTarget;
        }

        send(req, res, await repository.count(req.query));
    },

    async findInstances(req, res) {
        const repository = new InstanceRepository(req.requester);

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

    async createInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        send(req, res, await repository.create(req.body));

        await deployer.syncDockerCompose(await repository.find({} , 1000));
    },

    async editInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            send(req, res, await repository.edit(req.params.id, req.body));

            await deployer.syncDockerCompose(await repository.find({} , 1000));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async removeInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            await deployer.remove(await repository.get(req.params.id));
        } catch (e) {
            // Do nothing
        }

        try {
            await repository.remove(req.params.id);

            send(req, res, null, 204);

            await deployer.syncDockerCompose(await repository.find({} , 1000));
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async getStatusInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            const data = await deployer.getStatus(await repository.get(req.params.id));
            send(req, res, data);
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async inspectInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            const data = await deployer.inspect(await repository.get(req.params.id));
            send(req, res, data);
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async deployInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            await deployer.deploy(await repository.get(req.params.id));
            send(req, res, null, 204);
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async startInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            await deployer.start(await repository.get(req.params.id));
            send(req, res, null, 204);
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async restartInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            await deployer.restart(await repository.get(req.params.id));
            send(req, res, null, 204);
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },

    async stopInstance(req, res) {
        const repository = new InstanceRepository(req.requester);
        const deployer = new Deployer();

        try {
            await deployer.stop(await repository.get(req.params.id));
            send(req, res, null, 204);
        } catch ({ message, code }) {
            send(req, res, { code, message }, code);
        }
    },
}
