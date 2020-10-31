const fs = require('fs');
const posthtml = require('posthtml');
const { hash } = require('posthtml-hash');
const htmlnano = require('htmlnano');

const plugins = [
  hash({ // Hashes `bundle.css` and `bundle.js` in `build/`
    path: 'build',
    hashLength: 6,
    pattern: new RegExp(/hash/g)
  }),
  htmlnano() // Minifies `build/index.html`
];


const target = fs.readFileSync('deploy.sh', 'utf-8')
  .match(/TARGET=[^\n]+/)[0]
  .split('=')
  .pop();
const url = `https://www.bt.no/spesial/${target}/`

function setBuildSourceAndSave (result) {
  const html = result.html.replace(/\"\//g, `"${url}`);
  fs.writeFileSync('build/index.html', html);
}

function renameSourceMap (result) {
  const match = result.html.match(/bundle.(\S*).js/);
  if (!match) return;
  const hash = match[1];
  fs.renameSync('./build/bundle.hash.js.map', `./build/bundle.${hash}.js.map`);
  return result;
}

const html = fs.readFileSync('build/index.html');
posthtml(plugins)
  .process(html)
  .then(renameSourceMap)
  .then(setBuildSourceAndSave);
