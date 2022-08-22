const CRUDRepository = require("./CRUD");

module.exports = class ServerRepository extends CRUDRepository {
    constructor() {
        super('servers');
    }
}
