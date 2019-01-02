declare const require: any;
const packageJson = require('../../package.json');

export const environment = {
  appName: 'Conduit NGRX',
  envName: 'DEV',
  i18nPrefix: '',
  production: true,
  api_url: 'https://conduit.productionready.io/api',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
  }
};
