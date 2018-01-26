"use strict";

var irc = _interopRequireWildcard(require("irc"));

var _moment = _interopRequireDefault(require("moment"));

var _commonmark = _interopRequireDefault(require("commonmark"));

var _jsdom = require("jsdom");

var _dompurify = _interopRequireDefault(require("dompurify"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

var SERVER = 'localhost';
var CHANNEL = '#chat';
var USERNAME = 'Failure';
var initialization;
var client;
var channel;
channel = {};
initialization = new Date();
console.debug('executing', initialization);

function markdown(what) {
  var reader;
  var writer;
  var dom;
  var $document;
  var $window;
  var purify;
  var node;
  var clean;
  var safe;
  var ALLOWED_TAGS;
  var ALLOWED_ATTR;
  var parsed;
  var result;
  reader = new _commonmark.default.Parser();
  writer = new _commonmark.default.HtmlRenderer();
  dom = new _jsdom.JSDOM('');
  $document = dom.document;
  $window = dom.window;
  purify = (0, _dompurify.default)($window);
  ALLOWED_TAGS = ['b', 'i', 'a', 'pre', 'code', 'span', 'strike', 'strong', 'q', 'small', 'sup', 'sub', 's', 'address', 'acronym', 'abbr', 'big', 'em', 'p', 'time', '#text'];
  ALLOWED_ATTR = ['href', 'class'];
  node = {
    ALLOWED_TAGS: ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTR,
    RETURN_DOM_FRAGMENT: true,
    RETURN_DOM_IMPORT: true
  };
  clean = {
    ALLOWED_TAGS: ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTR
  };
  parsed = reader.parse(what);
  result = writer.render(parsed);
  safe = purify.sanitize(result, node);
  return safe;
}

document.addEventListener('DOMContentLoaded', function () {
  var navElement;
  var mainElement;
  var inputElement;
  var asideElement;
  var titleElement;
  var messageContainerElement;
  console.debug('DOMContentLoaded');
  navElement = document.querySelector('nav');
  mainElement = document.querySelector('main');
  inputElement = document.querySelector('input');
  titleElement = document.head.getElementsByTagName('title')[0];
  asideElement = document.querySelector('aside');
  messageContainerElement = {};
  client = new irc.Client(SERVER, USERNAME);
  titleElement.textContent = "Connecting to ".concat(SERVER);
  client.addListener('registered', function () {
    var a = document.querySelector('section.server span.server');
    a.textContent = SERVER;
    titleElement.textContent = USERNAME;
    client.join(CHANNEL);
  });

  function empty(it) {
    return it === undefined || it === null;
  }

  function initializeChannel(where) {
    if (!channel.hasOwnProperty('where')) {
      channel[where] = {};
    }

    if (empty(channel[where].name)) {
      channel[where].name = where;
    }

    if (empty(channel[where].users)) {
      channel[where].users = {};
    }

    if (empty(channel[where].when)) {
      channel[where].when = new Date();
    }

    if (empty(channel[where].messages)) {
      channel[where].messages = [];
    }
  }

  function selectChannel(where) {
    initializeChannel(where);
    var b = document.querySelector('section.channel span.channel');
    b.textContent = where;
    updateChannelUsers(where);
  }

  function updateChannelUsers(where) {
    var nicks;
    var who;
    var flags;
    var sorted;
    var listElement;
    nicks = channel[where].users;

    while (asideElement.lastElementChild) {
      asideElement.removeChild(asideElement.lastElementChild);
    }

    asideElement.appendChild(function _ol(ol) {
      return ol;
    }(document.createElement('ol')));
    listElement = asideElement.querySelector('ol');
    sorted = Object.entries(nicks).sort(function (_ref, _ref2) {
      var _ref3 = _slicedToArray(_ref, 2),
          a1 = _ref3[0],
          b1 = _ref3[1];

      var _ref4 = _slicedToArray(_ref2, 2),
          a2 = _ref4[0],
          b2 = _ref4[1];

      return (b2 === b1 ? 0 : b2 > b1 ? 2 : 0) + (a2 === a1 ? 0 : a2 < a1 ? 1 : -1);
    });
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = sorted[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _ref5 = _step.value;

        var _ref6 = _slicedToArray(_ref5, 2),
            who = _ref6[0],
            flags = _ref6[1];

        listElement.appendChild(function _li(li) {
          li.appendChild(function _a(a) {
            a.appendChild(document.createTextNode(who));
            return a;
          }(document.createElement('a')));
          li.appendChild(function _i(i) {
            i.appendChild(document.createTextNode(flags));
            return i;
          }(document.createElement('i')));
          return li;
        }(document.createElement('li')));
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
  }

  client.addListener('join', function (where, who, what) {
    var time;
    var when;
    var containerElement;
    time = new Date();
    when = time.toISOString();
    containerElement = getMessageContainerElement(where);
    initializeChannel(where);
    selectChannel(where); // console.log(where, who, what);
    // channel[where].users[who] = ''
    // updateChannelUsers(where)
  });
  client.addListener('selfMessage', function (where, what) {
    var time;
    var when;
    var messageElement;
    var containerElement;
    var who;
    time = new Date();
    when = time.toISOString();
    who = USERNAME;
    messageElement = createMessage({
      who: who,
      what: what,
      when: when
    });
    containerElement = getMessageContainerElement(where);
    containerElement.appendChild(messageElement);
    bot({
      who: who,
      what: what,
      where: where
    });
  });
  client.addListener('names', function (where, nicks) {
    console.log('names', where, nicks);
    initializeChannel(where);

    var _arr2 = Object.entries(nicks);

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
      var _ref7 = _arr2[_i2];

      var _ref8 = _slicedToArray(_ref7, 2);

      var k = _ref8[0];
      var v = _ref8[1];
      console.log(k, v);
      channel[where].users[k] = v;
    }

    updateChannelUsers(where);
  });
  client.addListener('part', function (where, who, reason, message) {
    if (channel[where].users.hasOwnProperty(who)) {
      delete channel[where].users[who];
    }

    console.log('part', where, who, reason, message);
  });
  document.forms.message.addEventListener('submit', function (e) {
    client.say(CHANNEL, inputElement.value);
    inputElement.value = '';
    e.preventDefault();
    return false;
  });
  document.addEventListener('dblclick', function () {
    var styles;
    var style;
    var href;
    var parts;
    styles = document.head.getElementsByTagName('link');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = styles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        style = _step2.value;

        if (style.hasAttribute('rel') && style.getAttribute('rel') === 'stylesheet') {
          href = style.getAttribute('href');
          parts = href.split('#');
          console.log(parts);
          parts[1] = Date.now().toString(16);
          style.setAttribute('href', parts.join('#'));
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });

  function createMessage(_ref9) {
    var who = _ref9.who,
        what = _ref9.what,
        when = _ref9.when;
    return function _article(article) {
      var template;
      var fragment;
      var child;
      var innerHTML;
      template = document.createElement('template');
      fragment = markdown(what);
      innerHTML = '';
      article.appendChild(function _header(header) {
        header.appendChild(function _span(span) {
          span.appendChild(document.createTextNode(who));
          return span;
        }(document.createElement('span')));
        return header;
      }(document.createElement('header')));

      try {
        // while (child = fragment.firstChild) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = fragment.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            child = _step3.value;
            article.innerHTML += child.outerHTML;
          } // template.content.innerHTML = innerHTML;
          // article.appendChild(template.content);

        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      } catch (exception) {
        console.log(exception, child);
      } // console.log(fragment, fragment.firstChild.outerHTML);
      // article.appendChild(fragment.firstChild)
      // article.appendChild((function markdown(p) {
      //   p.appendChild(document.createTextNode(what));
      //   return p
      // })(document.createElement('p')));


      article.appendChild(function _footer(footer) {
        footer.appendChild(function _time(time) {
          var timer;
          time.setAttribute('datetime', when);

          try {
            time.textContent = (0, _moment.default)(when).fromNow();
          } catch (exception) {
            console.log(exception);
          }

          article.addEventListener('mouseover', function () {
            time.textContent = (0, _moment.default)(when).fromNow();
          });
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
        var name = where.replace(/#/g, 'hashtag-');
        section.setAttribute('id', (where.indexOf('#') === 0 ? 'channel-' : 'sender-') + name);
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
    containerElement = getMessageContainerElement(where);
    messageElement = createMessage({
      who: who,
      what: what,
      when: when
    });
    containerElement.appendChild(messageElement);
    bot({
      who: who,
      what: what,
      where: where
    });
  });

  function bot(_ref10) {
    var who = _ref10.who,
        what = _ref10.what,
        where = _ref10.where;
    var that;
    setTimeout(function () {// if (/^pong$/.test(what)){
      //   client.say(where, '$ping')
      // }
      // if (that = /^say,?\s*(.+)$/.exec(what)) {
      //   client.say(where, that[1])
      // }
      // if (/^feedback$/.test(what)) {
      //   client.say(where, '$say feedback')
      // }
    }, 500);
  }
});