const generator = require('@api-components/api-model-generator');

const files = new Map();
files.set('exchange-experience-api/exchange-experience-api.raml', 'RAML 0.8');

generator(files)
.then(() => console.log('Finito'));
