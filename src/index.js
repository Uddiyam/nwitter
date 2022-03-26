import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

ReactDOM.render(
  <React.StrictMode > {/* console.log 함수를 2번 호출하게하여 오류를 쉽게 포착*/}
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);