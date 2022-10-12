const yaml = require('js-yaml');

class DockerComposeGenerator {
    static generate(instance) {
        const services = {};

        instance.forEach(({ name, dockerfile, image, volumes, ports }) => {
            const configVolumes = [];
            const configPorts = [];
            for (let key in volumes) {
                configVolumes.push(`${key}:${volumes[key]}`);
            }

            for (let key in ports) {
                configPorts.push(`${key}:${ports[key]}`);
            }

            const config = {
                env_file: [
                    `./${name}/shared/.env`
                ],
                ports: [
                    ...configPorts
                ],
                deploy: {
                    restart_policy: {
                        condition: 'on-failure',
                        delay: '5s',
                        max_attempts: 3,
                        window: '10s',
                    },
                },
                volumes: [
                    '~/.ssh:/home/user/.ssh',
                    ...configVolumes
                ]
            };

            if (dockerfile) {
                config.build = {
                    context: `./${name}/release`,
                    dockerfile: dockerfile,
                };
            } else if (image) {
                config.image = image;
            } else {
                config.image = 'node:latest';
            }

            services[name] = config;
        });

        return yaml.dump({ services });
    }
}

module.exports = DockerComposeGenerator;
