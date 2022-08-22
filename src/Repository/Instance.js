const CRUDRepository = require("./CRUD");
const ServerRepository = require("./Server");

module.exports = class InstanceRepository extends CRUDRepository {
    constructor() {
        super('instances');

        this.serverRepository = new ServerRepository();
    }

    async get(id) {
        const instance = await super.get(id);
        instance.server = await this.serverRepository.get(instance.server);

        return instance;
    }

    async find(params = {}, limit = 10, skip = 0) {
        const instances = await super.find(params, limit, skip);

        return await Promise.all(instances.map(async instance => {
            instance.server = await this.serverRepository.get(instance.server);

            return instance;
        }));
    }
}
