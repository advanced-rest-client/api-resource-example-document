const generator = require('@api-components/api-model-generator');

const files = new Map();
files.set('demo-api/demo-api.raml', 'RAML 1.0');
files.set('raml-types/raml-types.raml', 'RAML 1.0');

generator(files)
.then(() => console.log('Finito'));
