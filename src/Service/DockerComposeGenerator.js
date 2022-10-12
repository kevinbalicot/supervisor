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
                restart_policy: {
                    condition: 'on-failure',
                    delay: '5s',
                    max_attempts: 3,
                    window: '10s',
                },
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
