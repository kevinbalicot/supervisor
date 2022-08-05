const yaml = require('js-yaml');

class DockerComposeGenerator {
    static generate(instance) {
        const services = {};

        instance.forEach(({ name, dockerfile, port }) => {
            services[name] = {
                build: {
                    context: `./${name}/release`,
                    dockerfile: dockerfile,
                },
                env_file: [
                    `./${name}/shared/.env`
                ],
                ports: [
                    `${port}:8080`
                ],
                volumes: [
                    '~/.ssh:/home/user/.ssh',
                    `~/storage/${name}:/home/app/data`
                ]
            };
        });

        return yaml.dump({ services });
    }
}

module.exports = DockerComposeGenerator;
