import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-bulma-components/src/index.sass';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
