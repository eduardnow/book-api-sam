const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretsClient = new SecretsManagerClient();

const getSecret = async (secretName) => {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsClient.send(command);
    return JSON.parse(response.SecretString);
};

const authenticate = async (token) => {
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = decodedToken.split(':');

    const { username: validUsername, password: validPassword } = await getSecret('BasicAuthCredentials');

    if (username === validUsername && password === validPassword) {
        return true;
    } else {
        throw new Error('Unauthorized');
    }
};

module.exports = { authenticate };