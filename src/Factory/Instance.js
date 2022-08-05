import ServerFactory from './Server';

export default class InstanceFactory {
    static createFromData({
        _id,
        icon,
        name,
        repository,
        branch,
        server,
        env,
        dockerfile,
        port,
        createdAt,
        updatedAt
    }) {
        return {
            _id,
            icon,
            name,
            repository,
            branch,
            server: ServerFactory.createFromData(server),
            dockerfile,
            port,
            env: env ? JSON.parse(String(env).trim()) : {},
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),

            toString() {
                return `${this.name} (${this.repository}:${this.branch})`;
            }
        }
    }
}
