const fs = require('fs');
const path = require('path');

module.exports = {
  engines: {
    js: {
      compile: (src, options) => (context) => {
        const layoutPath = path.join(__dirname, '..', 'public', 'layout.html');
        const layout = fs.readFileSync(layoutPath, 'utf8');

        const view = options.filename.slice(options.filename.lastIndexOf('/') + 1);
        const component = view.slice(0, view.lastIndexOf('.'));

        const templated = layout
          .replace(/\$component\$/g, component)
          .replace(/\$opts\$/, JSON.stringify(context.props));

        return templated;
      }
    }
  },
  relativeTo: __dirname,
  path: '../public/tags'
};
