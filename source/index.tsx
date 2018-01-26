import * as irc from 'irc';
import moment from 'moment';
import $ from 'jquery';
import commonmark from 'commonmark'
import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify';

const SERVER = 'localhost';
const CHANNEL = '#chat';
const USERNAME = 'Failure'

let initialization: Date;
let client: irc.Client;

let channel: { [propName: string]: any }

channel = {}

initialization = new Date();

console.debug('executing', initialization)

function markdown(what: string) {
  let reader;
  let writer;

  let dom;

  let $document;
  let $window;

  let purify;
  let node;
  let clean;
  let safe;

  let ALLOWED_TAGS;
  let ALLOWED_ATTR;

  let parsed;
  let result;

  reader = new commonmark.Parser();
  writer = new commonmark.HtmlRenderer();

  dom = new JSDOM('');

  $document = dom.document
  $window = dom.window;

  purify = createDOMPurify($window);

  ALLOWED_TAGS = [
    'b',
    'i',
    'a',
    'pre',
    'code',
    'span',
    'strike',
    'strong',
    'q',
    'small',
    'sup',
    'sub',
    's',
    'address',
    'acronym',
    'abbr',
    'big',
    'em',
    'p',
    'time',
    '#text'
  ]

  ALLOWED_ATTR = [
    'href',
    'class'
  ]

  node = {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    RETURN_DOM_FRAGMENT: true,
    RETURN_DOM_IMPORT: true
  }

  clean = {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  }

  parsed = reader.parse(what);
  result = writer.render(parsed);

  safe = purify.sanitize(result, node);

  return safe;
}

document.addEventListener('DOMContentLoaded', function () {
  let navElement: HTMLElement;
  let mainElement: HTMLElement;
  let inputElement: HTMLInputElement;
  let asideElement: HTMLElement;
  let titleElement: HTMLTitleElement;
  let messageContainerElement: { [propName: string]: HTMLElement };

  console.debug('DOMContentLoaded')

  navElement = document.querySelector('nav') as HTMLElement;
  mainElement = document.querySelector('main') as HTMLMainElement;
  inputElement = document.querySelector('input') as HTMLInputElement;
  titleElement = document.head.getElementsByTagName('title')[0] as HTMLTitleElement;
  asideElement = document.querySelector('aside') as HTMLInputElement;


  messageContainerElement = {};

  client = new irc.Client(SERVER, USERNAME);
  titleElement.textContent = `Connecting to ${SERVER}`

  client.addListener('registered', function () {
    let a = document.querySelector('section.server span.server') as HTMLElement;

    a.textContent = SERVER;
    titleElement.textContent = USERNAME

    client.join(CHANNEL)
  })

  function empty(it: any): boolean {
    return it === undefined || it === null
  }

  function initializeChannel(where: string) {
    if (!channel.hasOwnProperty('where')) {
      channel[where] = {}
    }

    if (empty(channel[where].name)) {
      channel[where].name = where
    }

    if (empty(channel[where].users)) {
      channel[where].users = {}
    }

    if (empty(channel[where].when)) {
      channel[where].when = new Date()
    }

    if (empty(channel[where].messages)) {
      channel[where].messages = [];
    }
  }
  function selectChannel(where: string) {
    initializeChannel(where);

    let b = document.querySelector('section.channel span.channel') as HTMLElement;
    b.textContent = where;

    updateChannelUsers(where);
  }

  function updateChannelUsers(where: string) {
    let nicks: any;
    let who: string;
    let flags: string;
    let sorted: string[][];

    let listElement;

    nicks = channel[where].users

    while (asideElement.lastElementChild) {
      asideElement.removeChild(asideElement.lastElementChild as Node);
    }

    asideElement.appendChild((function _ol(ol) {
      return ol;
    })(document.createElement('ol')))

    listElement = asideElement.querySelector('ol') as HTMLElement

    sorted = Object.entries(nicks).sort(([a1, b1], [a2, b2]) => {
      return (b2 === b1 ? 0 : b2 > b1 ? 2 : 0) + (a2 === a1 ? 0 : a2 < a1 ? 1 : -1);
    })

    for ([who, flags] of sorted) {
      listElement.appendChild((function _li(li): HTMLElement {
        li.appendChild((function _a(a) {
          a.appendChild(document.createTextNode(who));
          return a;
        })(document.createElement('a')))

        li.appendChild((function _i(i) {
          i.appendChild(document.createTextNode(flags));
          return i;
        })(document.createElement('i')));

        return li;
      })(document.createElement('li')))
    }
  }

  client.addListener('join', function (where: string, who: string, what: string) {
    let time: Date;
    let when: string;
    let containerElement: HTMLElement;

    time = new Date();
    when = time.toISOString();
    containerElement = getMessageContainerElement(where);

    initializeChannel(where);
    selectChannel(where)

    // console.log(where, who, what);

    // channel[where].users[who] = ''

    // updateChannelUsers(where)
  });

  client.addListener('selfMessage', function (where: string, what: string): void {
    let time: Date;
    let when: string;
    let messageElement: HTMLElement;
    let containerElement: HTMLElement;
    let who: string;

    time = new Date();
    when = time.toISOString();
    who = USERNAME;

    messageElement = createMessage({ who, what, when });
    containerElement = getMessageContainerElement(where);

    containerElement.appendChild(messageElement);
    bot({ who, what, where });
  })

  client.addListener('names', function (where: string, nicks: { [propName: string]: string }): void {
    console.log('names', where, nicks);

    initializeChannel(where);

    for (let [k, v] of Object.entries(nicks)) {
      console.log(k, v)
      channel[where].users[k] = v;
    }

    updateChannelUsers(where);
  })

  client.addListener('part', function (where: string, who: string, reason: string, message: string) {
    if (channel[where].users.hasOwnProperty(who)) {
      delete channel[where].users[who]
    }

    console.log('part', where, who, reason, message);
  })

  document.forms.message.addEventListener('submit', function (e: GlobalEvent) {
    client.say(CHANNEL, inputElement.value);
    inputElement.value = '';
    e.preventDefault();
    return false;
  })

  document.addEventListener('dblclick', function () {
    let styles: NodeListOf<HTMLStyleElement>;
    let style: HTMLStyleElement;
    let href: string;
    let parts: string[];

    styles = document.head.getElementsByTagName('link');

    for (style of styles) {
      if (style.hasAttribute('rel') && style.getAttribute('rel') === 'stylesheet') {
        href = style.getAttribute('href') as string;
        parts = href.split('#')
        console.log(parts)
        parts[1] = Date.now().toString(16);

        style.setAttribute('href', parts.join('#'));
      }
    }
  })

  function createMessage({ who, what, when }: { who: string, what: string, when: string }): HTMLElement {
    return (function _article(article: HTMLElement) {
      let template;
      let fragment;
      let child;
      let innerHTML;

      template = document.createElement('template');
      fragment = markdown(what);
      innerHTML = ''

      article.appendChild((function _header(header) {
        header.appendChild((function _span(span) {
          span.appendChild(document.createTextNode(who))

          return span;
        })(document.createElement('span')));

        return header;
      })(document.createElement('header')));
      try {
        // while (child = fragment.firstChild) {
        for (child of fragment.children) {
          article.innerHTML += child.outerHTML;
        }
        // template.content.innerHTML = innerHTML;
        // article.appendChild(template.content);
      } catch (exception) {
        console.log(exception, child)
      }

      // console.log(fragment, fragment.firstChild.outerHTML);

      // article.appendChild(fragment.firstChild)

      // article.appendChild((function markdown(p) {
      //   p.appendChild(document.createTextNode(what));

      //   return p
      // })(document.createElement('p')));

      article.appendChild((function _footer(footer) {
        footer.appendChild((function _time(time) {
          let timer: number;

          time.setAttribute('datetime', when);

          try {
            time.textContent = moment(when).fromNow()
          } catch (exception) {
            console.log(exception)
          }

          article.addEventListener('mouseover', function () {
            time.textContent = moment(when).fromNow()
          })
          return time;
        })(document.createElement('time')))

        return footer;
      })(document.createElement('footer')));

      return article;
    })(document.createElement('article'))
  }

  function getMessageContainerElement(where: string): HTMLElement {
    let sectionElement: HTMLElement;

    if (!messageContainerElement.hasOwnProperty(where)) {
      sectionElement = (function _section(section): HTMLElement {
        let name: string = where.replace(/#/g, 'hashtag-')
        section.setAttribute('id', (where.indexOf('#') === 0 ? 'channel-' : 'sender-') + name)
        return section
      })(document.createElement('section'));

      messageContainerElement[where] = sectionElement

      mainElement.appendChild(sectionElement);
    }

    return messageContainerElement[where];
  }

  client.addListener('error', function (message: string) {
    console.log('error: ', message);
  });

  client.addListener('message', function (who: string, where: string, what: string): void {
    let time: Date;
    let when: string;
    let messageElement: HTMLElement;
    let containerElement: HTMLElement;

    time = new Date();
    when = time.toISOString();

    containerElement = getMessageContainerElement(where);
    messageElement = createMessage({ who, what, when });

    containerElement.appendChild(messageElement);

    bot({ who, what, where });
  });

  function bot({ who, what, where }: { who: string, where: string, what: string }) {
    let that: RegExpExecArray | null;

    setTimeout(function () {
      // if (/^pong$/.test(what)){
      //   client.say(where, '$ping')
      // }

      // if (that = /^say,?\s*(.+)$/.exec(what)) {
      //   client.say(where, that[1])
      // }

      // if (/^feedback$/.test(what)) {
      //   client.say(where, '$say feedback')
      // }
    }, 500)

  }
})