module.exports = {
    apps: [
    {
        name: 'mivoo-admin',
        script: '/usr/local/bin/yarn',
        args: 'dev',
        interpreter: 'none',
        env: {
            NODE_ENV: 'development'
        }
    }
    ],
};  