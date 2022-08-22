const { bootstrapServer } = require('@beelab/toolbox');

bootstrapServer({
    api: require('./config/api.json'),
    cache: false,
    pwa: true,
    localQuery: {
        instances: __dirname + '/data/instances.db',
        servers: __dirname + '/data/servers.db',
        configurations: __dirname + '/data/configurations.db',
    },
    publicDir: 'dist',
});
