const fs = require("fs");
const DockerComposeGenerator = require("./DockerComposeGenerator");

const { get, set } = require("@beelab/deployer/src/services/configuration");
const { exec, copy } = require("@beelab/deployer/src/providers/ssh");
const { init, prepareRelease, prepareShared, release, cleanRelease } = require("@beelab/deployer/src/tasks/deployer");
const { gitClone } = require("@beelab/deployer/src/tasks/git");
const { dockerComposeUp } = require("@beelab/deployer/src/tasks/docker");
const HttpError = require("../Error/HttpError");

module.exports = class Deployer {
    constructor(workdir = '~/docker-sources') {
        this.workdir = workdir;
    }

    async env (envs) {
        const releasePath = get('RELEASE_PATH');
        await exec('cp .env.dist .env', releasePath);

        for (const key in envs) {
            await exec(`grep -q '^${key}' .env  && sed -i 's/^${key}.*/${key}=${envs[key]}/' .env || echo '${key}=${envs[key]}' >> .env`, releasePath);
        }
    };

    async deploy(instance) {
        const now = new Date();
        const { host, user, port } = instance.server;
        const { name, env, repository, branch } = instance;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);
        set('RELEASE_ORIGIN', `${this.workdir}/${name}`);
        set('RELEASE_NUMBER', `${('0' + now.getDate()).slice(-2)}${('0' + (now.getMonth() + 1)).slice(-2)}${now.getFullYear()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`);
        set('GIT_REPOSITORY', repository);
        set('GIT_REFERENCE', branch);
        set('RELEASE_SHARED_FILES', ['.env']);

        try {
            await init();
            await prepareRelease();
            await gitClone();
            await this.env(env ? JSON.parse(env) : {});
            await prepareShared();
            await dockerComposeUp(name, this.workdir);
            await release();
            await cleanRelease();
        } catch (error) {
            console.error(error);
            await cleanRelease();

            throw new HttpError(error, 500);
        }
    }

    async start(instance) {
        const { host, user, port } = instance.server;
        const { name } = instance;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        const dockerComposeBinary = get('DOCKER_COMPOSE_BIN', 'docker compose');

        try {
            await exec(`${dockerComposeBinary} start ${name}`, this.workdir);
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async restart(instance) {
        const { host, user, port } = instance.server;
        const { name } = instance;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        const dockerComposeBinary = get('DOCKER_COMPOSE_BIN', 'docker compose');

        try {
            await exec(`${dockerComposeBinary} restart ${name}`, this.workdir);
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async stop(instance) {
        const { host, user, port } = instance.server;
        const { name } = instance;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        const dockerComposeBinary = get('DOCKER_COMPOSE_BIN', 'docker compose');

        try {
            await exec(`${dockerComposeBinary} stop ${name}`, this.workdir);
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async remove(instance) {
        const { host, user, port } = instance.server;
        const { name } = instance;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        const dockerComposeBinary = get('DOCKER_COMPOSE_BIN', 'docker compose');

        try {
            await exec(`${dockerComposeBinary} rm -sf ${name}`, this.workdir);
            await exec(`rm -rf ${name}`, this.workdir);
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async inspect(instance) {
        const { host, user, port } = instance.server;
        const { name } = instance;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        const dockerComposeBinary = get('DOCKER_COMPOSE_BIN', 'docker compose');
        const dockerBinary = get('DOCKER_BIN', 'docker');
        const format = '{\\"container\\":\\"{{ .Container }}\\",\\"memory\\":{\\"raw\\":\\"{{ .MemUsage }}\\",\\"percent\\":\\"{{ .MemPerc }}\\"},\\"cpu\\":\\"{{ .CPUPerc }}\\",\\"net\\":\\"{{ .NetIO }}\\",\\"block\\":\\"{{ .BlockIO }}\\"}';

        try {
            const data = await exec(`${dockerBinary} stats --no-stream --format '${format}' \\$(${dockerComposeBinary} ps -q ${name})`, this.workdir);

            return JSON.parse(data);
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async getStatus(instance) {
        const { host, user, port } = instance.server;
        const { name } = instance;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        const dockerComposeBinary = get('DOCKER_COMPOSE_BIN', 'docker compose');
        const dockerBinary = get('DOCKER_BIN', 'docker');

        try {
            const data = await exec(`${dockerBinary} inspect \\$(${dockerComposeBinary} ps -q ${name})`, this.workdir);
            const { State } = JSON.parse(data)[0];

            return State;
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async syncDockerCompose(instances) {
        const servers = {};

        for (let instance of instances) {
            if (!servers[instance.server._id]) {
                servers[instance.server._id] = { ...instance.server, instances: [] };
            }

            servers[instance.server._id].instances.push(instance);
        }

        for (let key in servers) {
            const { host, user, port, instances } = servers[key];

            set('SSH_HOST', host);
            set('SSH_USER', user);
            set('SSH_PORT', port);

            fs.writeFileSync(`/tmp/${key}.yaml`, DockerComposeGenerator.generate(instances));

            try {
                await copy(`/tmp/${key}.yaml`, `${this.workdir}/docker-compose.yaml`);
            } catch (error) {
                console.error(error);

                throw new HttpError(error, 500);
            }
        }

        return Promise.resolve();
    };
}
