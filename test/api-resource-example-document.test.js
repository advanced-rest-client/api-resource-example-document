import { fixture, assert, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { AmfLoader } from './amf-loader.js';
import '../api-resource-example-document.js';

describe('<api-resource-example-document>', () => {
  async function basicFixture() {
    return (await fixture(`<api-resource-example-document></api-resource-example-document>`));
  }

  async function jsonFixture() {
    return (await fixture(`
      <api-resource-example-document mediatype="application/json"></api-resource-example-document>`));
  }


  function clearTableStorage() {
    localStorage.removeItem('jsonTableEnabled');
  }

  function getStorageValue() {
    return localStorage.jsonTableEnabled;
  }


  describe('_tableChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      clearTableStorage();
    });

    it('Does noting when state is undefined', () => {
      const spy = sinon.spy(element, '_dispatchTableState');
      element._tableChanged();
      assert.isFalse(spy.called);
    });

    it('Updates state of the local storage', () => {
      element._tableChanged(true);
      let result = getStorageValue();
      assert.equal(result, 'true');
      element._tableChanged(false);
      result = getStorageValue();
      assert.equal(result, 'false');
    });

    it('Calles _dispatchTableState()', () => {
      const spy = sinon.spy(element, '_dispatchTableState');
      element._tableChanged(false);
      assert.isTrue(spy.called);
    });
  });

  describe('_dispatchTableState()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches the event', () => {
      const spy = sinon.spy();
      element.addEventListener('json-table-state-changed', spy);
      element._dispatchTableState(true);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const result = element._dispatchTableState(true);
      assert.typeOf(result, 'customevent');
    });

    it('Event is not cancelable', () => {
      const result = element._dispatchTableState(true);
      assert.isFalse(result.cancelable);
    });

    it('Event bubbles', () => {
      const result = element._dispatchTableState(true);
      assert.isTrue(result.bubbles);
    });

    it('Event is composed', () => {
      const result = element._dispatchTableState(true);
      if (result.composed !== undefined) {
        assert.isTrue(result.composed);
      }
    });

    it('Has the sate on detail object', () => {
      const result = element._dispatchTableState(true);
      assert.isTrue(result.detail.enabled);
    });
  });

  describe('_onStorageChanged()', () => {
    let element;
    beforeEach(async () => {
      clearTableStorage();
      element = await basicFixture();
    });

    it('Does nothing when key is not jsonTableEnabled', () => {
      element._onStorageChanged({
        key: 'test'
      });
      assert.isFalse(element.table);
    });

    it('Does nothing when newValue is not set', () => {
      element._onStorageChanged({
        key: 'jsonTableEnabled'
      });
      assert.isFalse(element.table);
    });

    it('Updates table state', () => {
      element._onStorageChanged({
        key: 'jsonTableEnabled',
        newValue: 'true'
      });
      assert.isTrue(element.table);
    });
  });

  describe('_localStorageValueToBoolean()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when no argument', () => {
      const result = element._localStorageValueToBoolean();
      assert.isFalse(result);
    });

    it('Returns false', () => {
      const result = element._localStorageValueToBoolean('false');
      assert.isFalse(result);
    });

    it('Returns `true`', () => {
      const result = element._localStorageValueToBoolean('true');
      assert.isTrue(result);
    });
  });

  describe('_onJsonTableStateChanged()', () => {
    let element;
    beforeEach(async () => {
      clearTableStorage();
      element = await basicFixture();
    });

    it('Does nothing when dispatched by self', () => {
      element._onJsonTableStateChanged({
        composedPath: () => [element],
        detail: {
          enabled: true
        }
      });
      assert.isFalse(element.table);
    });

    it('Does nothing when represents the same value', () => {
      element._onJsonTableStateChanged({
        composedPath: () => [],
        detail: {
          enabled: false
        }
      });
      assert.isFalse(element.table);
    });

    it('Updates "table" value', () => {
      element._onJsonTableStateChanged({
        composedPath: () => [],
        detail: {
          enabled: true
        }
      });
      assert.isTrue(element.table);
    });
  });

  describe('_computeExamples()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets _examplesDebouncer property', () => {
      element._computeExamples();
      assert.isTrue(element._examplesDebouncer);
    });

    it('Eventually calls __computeExamples()', (done) => {
      element._computeExamples();
      const spy = sinon.spy(element, '__computeExamples');
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });

    it('Clears _examplesDebouncer property', (done) => {
      element._computeExamples();
      setTimeout(() => {
        assert.isFalse(element._examplesDebouncer);
        done();
      });
    });
  });

  describe('_computeEffectiveTable()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns true when table and JSON', () => {
      const result = element._computeEffectiveTable(true, true);
      assert.isTrue(result);
    });

    it('Returns false when not a JSON', () => {
      const result = element._computeEffectiveTable(true, false);
      assert.isFalse(result);
    });

    it('Returns false when not table', () => {
      const result = element._computeEffectiveTable(false, true);
      assert.isFalse(result);
    });

    it('Returns false when not table and not JSON', () => {
      const result = element._computeEffectiveTable(false, false);
      assert.isFalse(result);
    });
  });

  describe('_computeIsJson()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when no type', () => {
      const result = element._computeIsJson();
      assert.isFalse(result);
    });

    it('Returns false for non-json media type', () => {
      const result = element._computeIsJson('application/xml');
      assert.isFalse(result);
    });

    it('Returns true for json media type', () => {
      const result = element._computeIsJson('application/json');
      assert.isTrue(result);
    });

    it('Returns true for other json media type', () => {
      const result = element._computeIsJson('application/x-json');
      assert.isTrue(result);
    });
  });

  function getPayloads(element, amf, endpoint) {
    const webApi = element._computeWebApi(amf);
    const endPoint = element._computeEndpointByPath(webApi, endpoint);
    const opKey = element._getAmfKey(element.ns.aml.vocabularies.apiContract.supportedOperation);
    return element._ensureArray(endPoint[opKey]);
  }

  function getPayload(element, amf, endpoint, method) {
    const ops = getPayloads(element, amf, endpoint);
    const op = ops.find((item) => element._getValue(item, element.ns.aml.vocabularies.apiContract.method) === method);
    const expects = element._computeExpects(op);
    return element._ensureArray(element._computePayload(expects));
  }

  function getPayloadSchema(element, amf, endpoint, method, payloadIndex) {
    if (!payloadIndex) {
      payloadIndex = 0;
    }
    const payload = getPayload(element, amf, endpoint, method)[payloadIndex];
    const sKey = element._getAmfKey(element.ns.aml.vocabularies.shapes.schema);
    let schema = payload[sKey];
    if (schema instanceof Array) {
      schema = schema[0];
    }
    return element._resolve(schema);
  }

  function computeExamples(element, amf, endpoint, method, payloadIndex) {
    const schema = getPayloadSchema(element, amf, endpoint, method, payloadIndex);
    const key = element._getAmfKey(element.ns.aml.vocabularies.apiContract.examples);
    return element._ensureArray(schema[key]);
  }

  describe('__computeExamples()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let amf;
        before(async () => {computeExamples
          amf = await AmfLoader.load(item[1]);
        });

        let element;
        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await nextFrame();
        });

        it('Clears _renderedExamples when no examples', () => {
          element._renderedExamples = [{
            value: '{}',
            hasTitle: false
          }];
          element.__computeExamples();
          assert.isUndefined(element._renderedExamples);
        });

        it('Clears _renderedExamples when examples empty', () => {
          element._renderedExamples = [{
            value: '{}',
            hasTitle: false
          }];
          element.__computeExamples([]);
          assert.isUndefined(element._renderedExamples);
        });

        it('Clears _renderedExamples when no media type', () => {
          element._renderedExamples = [{
            value: '{}',
            hasTitle: false
          }];
          element.__computeExamples([{}]);
          assert.isUndefined(element._renderedExamples);
        });

        it('Computes examples from array of Payloads', () => {
          const payloads = getPayload(element, amf, '/IncludedInType', 'post');
          element.__computeExamples(payloads, 'application/json');
          assert.typeOf(element._renderedExamples, 'array');
          assert.lengthOf(element._renderedExamples, 1);
        });

        it('Computes examples from a single payload', () => {
          const payloads = getPayload(element, amf, '/IncludedInType', 'post');
          element.__computeExamples(payloads[0], 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 1);
        });

        it('Computes examples from a payload\'s schema', () => {
          const payload = getPayload(element, amf, '/IncludedInType', 'post')[0];
          const id = payload['@id'];
          const sKey = element._getAmfKey(element.ns.aml.vocabularies.shapes.schema);
          let schema = payload[sKey];
          if (schema instanceof Array) {
            schema = schema[0];
          }
          element.__computeExamples(schema, 'application/json', false, undefined, id);
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 1);
        });

        it('Computes payload from an Example', () => {
          const examples = computeExamples(element, amf, '/IncludedInType', 'post', 0);
          element.__computeExamples(examples[0], 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 1);
        });

        it('Computes payload from multiple Examples', () => {
          const examples = computeExamples(element, amf, '/IncludedInType', 'post', 0);
          element.__computeExamples(examples, 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 2);
        });

        it('Ignores unknown array items', () => {
          const examples = computeExamples(element, amf, '/IncludedInType', 'post', 0);
          examples.push({});
          element.__computeExamples(examples, 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 2);
        });

        it('Ignores unknown shapes', () => {
          element.__computeExamples({}, 'application/json');
          assert.isUndefined(element.renderedExamples);
        });
      });
    });
  });

  describe('General tests', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(item[0], () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let element;
        beforeEach(async () => {
          element = await jsonFixture();
          element.amf = amf;
          await nextFrame();
        });

        it('Sets hasexamples attribute when examples are generated', (done) => {
          const payloads = getPayload(element, amf, '/IncludedInType', 'post');
          element.examples = payloads;
          element.addEventListener('has-examples-changed', function f(e) {
            if (!e.detail.value) {
              return;
            }
            element.removeEventListener('has-examples-changed', f);
            setTimeout(() => {
              assert.isTrue(element.hasAttribute('hasexamples'));
              done();
            });
          });
        });

        it('Renders api-example-render for each example', (done) => {
          const payloads = getPayload(element, amf, '/IncludedInline', 'post');
          element.examples = payloads;
          element.addEventListener('has-examples-changed', function f(e) {
            if (!e.detail.value) {
              return;
            }
            element.removeEventListener('has-examples-changed', f);
            setTimeout(() => {
              const nodes = element.shadowRoot.querySelectorAll('api-example-render');
              assert.lengthOf(nodes, 2);
              done();
            });
          });
        });
      });
    });
  });

  describe('a11y', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      element = await jsonFixture();
      element.amf = amf;
    });

    async function resolveWhenReady(element, amf, path, method) {
      return new Promise((resolve) => {
        const payloads = getPayload(element, amf, path, method);
        element.examples = payloads;
        element.addEventListener('has-examples-changed', function f(e) {
          if (!e.detail.value) {
            return;
          }
          element.removeEventListener('has-examples-changed', f);
          setTimeout(() => resolve());
        });
      });
    }

    it('passes accessibility test', async () => {
      await resolveWhenReady(element, amf, '/IncludedInType', 'post');
      await assert.isAccessible(element, {
        // ignoredRules: ['color-contrast']
      });
    });
  });
});
