const fs = require("fs");
const { exec, copy } = require("@beelab/deployer/src/providers/ssh");
const { set, get } = require("@beelab/deployer/src/services/configuration");
const HttpError = require("../Error/HttpError");

module.exports = class Nginx {
    constructor(serviceName = 'nginx', workdir = '~/config/nginx', image = 'linuxserver/nginx') {
        this.workdir = workdir;
        this.serviceName = serviceName;
        this.image = image;
    }

    async init(server) {
        const { host, user, port } = server;

        set('SSH_HOST', host);
        set('SSH_USER', user);
        set('SSH_PORT', port);

        await exec('mkdir -p config/keys config/nginx/site-confs config/letsencrypt/acme', this.workdir);
    }

    async applyChallengeForConfiguration(configuration) {
        const { domain, instance } = configuration;
        const { server, port } = instance;
        const { host } = server;

        await this.init(server);

        const config =
`server {
    listen 80;
    server_name ${domain};

    location ~ /.well-known/acme-challenge {
        allow all;
        root /config/letsencrypt/acme;
    }
}
`;

        fs.writeFileSync(`/tmp/${domain}`, config);

        try {
            await copy(`/tmp/${domain}`, `${this.workdir}/config/nginx/site-confs`);
            await this.startService();
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async applyConfiguration(configuration) {
        const { domain, instance } = configuration;
        const { port, server } = instance;
        const { host } = server;

        await this.init(server);

        const config =
`server {
    listen 80;
    server_name ${domain};

    location / {
        rewrite ^ https://$server_name$request_uri? permanent;
    }
}

server {
    listen 443 ssl;
    server_name ${domain};

    ssl_certificate /config/keys/${domain}.crt;
    ssl_certificate_key /config/keys/${domain}.key;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Host $host;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_pass http://${host}:${port}/;
        proxy_redirect off;
    }
}
`;

        fs.writeFileSync(`/tmp/${domain}`, config);

        try {
            await copy(`/tmp/${domain}`, `${this.workdir}/config/nginx/site-confs`);
            await this.startService();
        } catch (error) {
            console.error(error);

            throw new HttpError(error, 500);
        }
    }

    async startService() {
        const dockerBinary = get('DOCKER_BIN', 'docker');

        try {
            await exec(`${dockerBinary} stop ${this.serviceName}`);
        } catch (e) {
            // Do nothing
        }

        await exec(`
            ${dockerBinary} run -d --rm \\
                --name ${this.serviceName} \\
                -v \\$(pwd)/config:/config \\
                -p 80:80 \\
                -p 443:443 \\
                -e PUID=\$(id -u) \\
                -e PGID=\$(id -g) \\
                ${this.image}
            `, this.workdir);
    }

    async removeConfiguration(configuration) {
        const { domain } = configuration;

        try {
            await exec(`rm -f ${this.workdir}/config/nginx/site-confs/${domain}`, this.workdir);
            await this.startService();
        } catch (e) {
            // Do nothing
        }
    }
}
