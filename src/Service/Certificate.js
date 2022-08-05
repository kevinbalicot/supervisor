const { exec } = require("@beelab/deployer/src/providers/ssh");
const { set, get } = require("@beelab/deployer/src/services/configuration");
const HttpError = require("../Error/HttpError");

module.exports = class Certificate {
    constructor(serviceName = 'nginx', workdir = '~/config/nginx', image = 'certbot/certbot') {
        this.workdir = workdir;
        this.serviceName = serviceName;
        this.image = image;
    }

    async init(server) {
        const { host, user, port } = server;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        await exec('mkdir -p letsencrypt letsencrypt/var/lib letsencrypt/var/log/letsencrypt', this.workdir);
    }

    async generate(configuration) {
        const { instance, domain } = configuration;
        const { server } = instance;

        await this.init(server);

        const dockerBinary = get('DOCKER_BIN', 'docker');
        try {
            await exec(`
                ${dockerBinary} run --rm \\
                    -v \\$(pwd)/letsencrypt:/etc/letsencrypt \\
                    -v \\$(pwd)/letsencrypt/var/lib/letsencrypt:/var/lib/letsencrypt \\
                    -v \\$(pwd)/letsencrypt/var/log/letsencrypt:/var/log/letsencrypt \\
                    -v \\$(pwd)/config/letsencrypt/acme:/data/letsencrypt \\
                    -u \$(id -u):\$(id -g) \\
                    ${this.image} \\
                    certonly --webroot \\
                    --email kevinbalicot@gmail.com --agree-tos \\
                    --webroot-path=/data/letsencrypt \\
                    --non-interactive \\
                    -d ${domain}
            `, this.workdir);

            await exec(`cp -f "./letsencrypt/live/${domain}/privkey.pem" "./config/keys/${domain}.key"`, this.workdir);
            await exec(`cp -f "./letsencrypt/live/${domain}/fullchain.pem" "./config/keys/${domain}.crt"`, this.workdir);
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async removeCertificate(configuration) {
        const { domain } = configuration;

        try {
            await exec(`rm -rf ./letsencrypt/live/${domain} ./letsencrypt/archive/${domain}`, this.workdir);
        } catch (e) {
            // Do nothing
        }
    }
}
