"use strict";

var irc = _interopRequireWildcard(require("irc"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var initialization;
var client;
var channel;
channel = {};
initialization = new Date();
document.addEventListener('DOMContentLoaded', function () {
  var menuElement;
  var mainElement;
  var inputElement;
  var messageContainerElement;
  client = new irc.Client('localhost', 'Announcement');
  client.addListener('registered', function () {
    console.log('registered at ', Date.now() - initialization.getTime());
    client.join('#bot');
  });
  client.addListener('join', function (where, who, what) {
    var time;
    var when;
    var containerElement;
    time = new Date();
    when = time.toISOString();
    containerElement = getMessageContainerElement(where);
    console.log('join', where, who, what);
    channel['#bot'] = {
      name: '#bot',
      users: {},
      when: new Date(),
      messages: []
    };
  });
  client.addListener('names', function (where, nicks) {
    var containerElement;
    var who;
    var asideElement;
    var listElement;
    containerElement = getMessageContainerElement(where);
    asideElement = containerElement.querySelector('aside');
    listElement = asideElement.querySelector('ol');
    console.log('names', where, nicks);
    channel[where].users = nicks;

    for (who in nicks) {
      listElement.appendChild(function _li(li) {
        li.appendChild(document.createTextNode(who));
        return li;
      }(document.createElement('li')));
    }
  });
  client.addListener('part', function (where, who, reason, message) {
    if (channel[where].users.hasOwnProperty(who)) {
      delete channel[where].users[who];
    }

    console.log('part', where, who, reason, message);
  });
  document.addEventListener('click', function () {
    var styles;
    var style;
    var href;
    var parts;
    styles = document.head.getElementsByTagName('link');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = styles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        style = _step.value;

        if (style.hasAttribute('rel') && style.getAttribute('rel') === 'stylesheet') {
          href = style.getAttribute('href');
          parts = href.split('#');
          console.log(parts);
          parts[1] = Date.now().toString(16);
          style.setAttribute('href', parts.join('#'));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
  console.log('DOMContentLoaded at ', Date.now() - initialization.getTime());
  menuElement = document.querySelector('menu');
  mainElement = document.querySelector('main');
  inputElement = document.querySelector('input');
  messageContainerElement = {};

  function createMessage(_ref) {
    var who = _ref.who,
        what = _ref.what,
        when = _ref.when;
    return function _article(article) {
      article.appendChild(function _header(header) {
        header.appendChild(function _span(span) {
          span.appendChild(document.createTextNode(who));
          return span;
        }(document.createElement('span')));
        return header;
      }(document.createElement('header')));
      article.appendChild(function _p(p) {
        p.appendChild(document.createTextNode(what));
        return p;
      }(document.createElement('p')));
      article.appendChild(function _footer(footer) {
        footer.appendChild(function _time(time) {
          time.setAttribute('datetime', when);
          return time;
        }(document.createElement('time')));
        return footer;
      }(document.createElement('footer')));
      return article;
    }(document.createElement('article'));
  }

  function getMessageContainerElement(where) {
    var sectionElement;

    if (!messageContainerElement.hasOwnProperty(where)) {
      sectionElement = function _section(section) {
        section.appendChild(function _aside(aside) {
          aside.appendChild(function _h1(h1) {
            h1.appendChild(document.createTextNode(where));
            return h1;
          }(document.createElement('h1')));
          aside.appendChild(function _ol(ol) {
            return ol;
          }(document.createElement('ol')));
          return aside;
        }(document.createElement('aside')));
        return section;
      }(document.createElement('section'));

      messageContainerElement[where] = sectionElement;
      mainElement.appendChild(sectionElement);
    }

    return messageContainerElement[where];
  }

  client.addListener('error', function (message) {
    console.log('error: ', message);
  });
  client.addListener('message', function (who, where, what) {
    var time;
    var when;
    var messageElement;
    var containerElement;
    time = new Date();
    when = time.toISOString();
    messageElement = createMessage({
      who: who,
      what: what,
      when: when
    });
    containerElement = getMessageContainerElement(where);
    containerElement.appendChild(messageElement);
  });
});
