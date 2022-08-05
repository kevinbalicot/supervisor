require('dotenv').config();

const { bootstrapServer } = require('@beelab/toolbox');
const { createApp, createServer } = require('yion');
const bodyParser = require('yion-body-parser');
const Requester = require('./src/Service/Requester');

const app = createApp();
app.use((req, res, next) => {
    if (!app.requester) {
        app.requester = new Requester({
            instances: __dirname + '/data/instances.db',
            servers: __dirname + '/data/servers.db',
            configurations: __dirname + '/data/configurations.db',
        });
    }

    next();
});

bootstrapServer(app, {
    api: require('./config/api.json'),
    cache: false,
    pwa: true,
    localQuery: true,
    publicDir: 'dist'
});

const { NODE_PORT = 8080 } = process.env;
const httpServer = createServer(app, [bodyParser]);

httpServer.listen(NODE_PORT);
httpServer.on('listening', () => console.log(`🌏  Server start on port ${NODE_PORT}`));
