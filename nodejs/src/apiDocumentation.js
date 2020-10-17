module.exports = {
    openapi: '3.0.1',
    info: {
        version: '1.3.0',
        title: 'Auth Module',
        description: 'Athentication server',
        termsOfService: 'http://api_url/terms/',
        contact: {
            name: 'Bitdistrict',
            email: 'alexalejandroem@gmail.com',
            url: 'https://www.bitdistrict.com/'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Local server'
        },
        {
            url: 'https://api_url_testing',
            description: 'Testing server'
        },
        {
            url: 'https://api_url_production',
            description: 'Production server'
        }
    ],
    security: [
        {
            Bearer: []
        }
    ],
    paths: {
        '/api': {
            get: {
                tags: ['Home'],
                description: 'Home',
                operationId: 'home',
                parameters: [],
                responses: {
                    '401': {
                        description: 'Token was not found',
                        content: {
                            'application/json': {
                                message: "Token not found"
                            }
                        }
                    },
                    '200': {
                        description: 'Welcome endpoint succesfully reached',
                        content: {
                            'application/json': {
                                message: 'Welcome to aplifit backend'
                            }
                        }
                    }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth operations'],
                description: 'Authenticate on the app',
                operationId: 'auth_login',
                parameters: [],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User'
                            },
                            example: {
                                username: 'alejandroem',
                                password: '123456'
                            }
                        }
                    },
                    required: true
                },
                responses: {
                    '401': {
                        description: 'Invalid user'
                    },
                    '400': {
                        description: 'Invalid parameters',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Login'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        securitySchemes: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                bearerFormat: 'JWT'
            },
        },
        schemas: {
            username: {
                type: 'string',
                example: 'alejandroem'
            },
            password: {
                type: 'string',
                example: '123456'
            },
            User: {
                type: 'object',
                properties: {
                    username: {
                        $ref: '#/components/schemas/username'
                    },
                    password: {
                        $ref: '#/components/schemas/password'
                    },
                }
            },
            Login: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    },
                    internal_code: {
                        type: 'string'
                    }
                }
            }
        }
    }
};
