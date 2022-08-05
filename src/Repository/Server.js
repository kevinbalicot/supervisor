const CRUDRepository = require("./CRUD");

module.exports = class ServerRepository extends CRUDRepository {
    constructor(requester) {
        super(requester, 'servers');
    }
}
