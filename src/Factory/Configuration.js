import InstanceFactory from "./Instance";

export default class ConfigurationFactory {
    static createFromData({ _id, icon, name, domain, instance, createdAt, updatedAt }) {
        return {
            _id,
            icon,
            name,
            domain,
            instance: InstanceFactory.createFromData(instance),
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
        };
    }
}
