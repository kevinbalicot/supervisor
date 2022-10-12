import ServerFactory from './Server';

export default class InstanceFactory {
    static createFromData({
        _id,
        icon,
        name,
        repository,
        branch,
        server,
        port,
        env,
        volumes,
        ports,
        dockerfile,
        image,
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
            port,
            dockerfile,
            image,
            volumes,
            ports,
            env,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),

            toString() {
                return `${this.name} (${this.repository}:${this.branch})`;
            }
        }
    }
}
