"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_react.default);
console.log(_reactDom.default);

_reactDom.default.render(_react.default.createElement("h1", null, "Hello, world!"), document.getElementById('root'));
