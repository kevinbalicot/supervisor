export default class ServerFactory {
    static createFromData({ _id, icon, name, host, port, user, createdAt, updatedAt }) {
        return {
            _id,
            icon,
            name,
            host,
            port,
            user,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),

            toString() {
                return `${this.name} (${this.user}@${this.host}:${this.port})`;
            }
        }
    }
}
