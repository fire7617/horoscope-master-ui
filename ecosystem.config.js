module.exports = {
    apps: [
    {
        name: 'mivoo-admin-dev',
        script: 'yarn',
        args: 'dev',
        interpreter: 'bash',
        env: {
            NODE_ENV: 'development'
        }
    }
    ],
};  