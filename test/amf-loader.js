export const AmfLoader = {};
AmfLoader.load = async function(compact, fileName) {
  fileName = fileName || 'demo-api';
  const file = '/' + fileName + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/demo/'+ file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(data);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
