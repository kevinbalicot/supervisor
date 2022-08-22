const CRUDRepository = require("./CRUD");
const InstanceRepository = require("./Instance");

module.exports = class ConfigurationRepository extends CRUDRepository {
    constructor() {
        super('configurations');

        this.instanceRepository = new InstanceRepository();
    }

    async get(id) {
        const configuration = await super.get(id);
        configuration.instance = await this.instanceRepository.get(configuration.instance);

        return configuration;
    }

    async find(params = {}, limit = 10, skip = 0) {
        const configurations = await super.find(params, limit, skip);

        return await Promise.all(configurations.map(async configuration => {
            configuration.instance = await this.instanceRepository.get(configuration.instance);

            return configuration;
        }));
    }
}
