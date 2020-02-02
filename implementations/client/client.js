const net = require('net')
const socket = net.createConnection({ host: 'irc.freenode.net', port: 6667 })

// const nick = 'Success';
const configuration = {};
const workspace = new Map;
const notes = new Map;
const expression = {
  message: /(?:(?<prefix>:[^\x20]+)\x20)?(?<command>(?:[a-z]+|[A-Z]+|[0-9]+))(?<params>(?:(?:\x20[^:\r\n\0\x20][\r\n\0\20]*)*[^\r\n\0]+))?(?<crlf>\r\n)/gim,
  params: /(?<middle>(?:\x20[^:\r\n\0\x20][^\r\n\0\x20]*)*)(?<trailing>\x20:[^\r\n\0]+)?/,
  middle: /(\x20[^:\r\n\0\x20][^\r\n\0\x20]*)/gim,
  nick: /[A-Za-z](?:[0-9]|[A-Z]|[a-z]|[\[\]\{\}\-\\\^\x60\x5C])+/ // // '-' | '[' | ']' | '\' | '`' | '^' | '{' | '}'
}

configuration.nick = 'Success';
configuration.manager = 'Failure';
configuration.host = 'irc.freenode.net';
configuration.port = 6667;
configuration.connection = { host: configuration.host, port: configuration.port };

async function write (it) {
  const result = socket.write(`${it}\r\n`);
  console.log(`> ${it}`);
  return result;
}

socket.on('connect', () => {
  write(`CAP LS`)
  write(`NICK Success`)
  write(`PASS password`);
  write('USER Jake Jake localhost :realname')
  socket.write('\r\n');
})

socket.on('data', (data /*: Buffer | String */) => {
  const message = data.toString('utf8')
  const messages = [...getMatches(expression.message, message)];

  if (messages.length > 0) {

  }

  const parsedMessages = messages.map(match => {
    const properties = {};

    if (match.groups && match.groups.params) {
      const $params = match.groups.params.match(expression.params);

      properties.middle = ($params.groups && $params.groups.middle) ? [...getMatches(expression.middle, $params.groups.middle)].map(it => it[0]) : [];
      properties.trailing = ($params.groups && $params.groups.trailing) ? $params.groups.trailing.trim().substring(1) : '';

      properties.params = [ ...properties.middle, properties.trailing ].map(it => it.trim());
    }
    if (match.groups && match.groups.prefix) {
      properties.prefix = match.groups.prefix;
    }
    if (match.groups && match.groups.command) {
      properties.command = match.groups.command;

      if (/^\d+$/.test(properties.command)) {
        properties.command = Number.parseInt(properties.command, 10);
      }
    }
    const matchArray = [];
    for (let i = 0; i < match.length; i++) {
      matchArray[i] = match[i]
    }
    return { match: { array: matchArray.slice(0), index: match.index, groups: match.groups, text: matchArray[0] }, properties };
    // return { match: [ ...match ], properties };
  })

  // console.log()
  
  parsedMessages.forEach(({ match, properties }) => {
    const { command, params, trailing, middle, prefix } = properties;
    if (typeof command === 'string') {
      if (/CAP/.test(command)) {
        if (/LS/.test(params[1])) {
          write(`CAP REQ :${trailing}`);
        }
        if (/ACK/.test(params[1])) {
          write(`CAP END`);
        }
  
      }
      if (/PING/.test(command)) {
        write(`PONG`);
      }
      if (/PRIVMSG/.test(command)) {
        const source = prefix.substring(1);
        const destination = params[0];
        const content = params[1];
        
        let that0;

        console.log({ source, destination, content });

        // function reply (content) {
        //   write(`PRIVMSG`)
        // }

        if (destination === configuration.nick && expression.nick.test(source) && (that0 = expression.nick.exec(source))[0] === configuration.manager) {
          function reply (content) {
            write(`PRIVMSG ${that0[0]} :${content}`);
          }
          let $that1;
          if (($that1 = content.match(/remember (.+)/))) {
            let $that2;
            if (($that2 = $that1[1].match(/me/))) {
              reply(`I will remember you, ${that0[0]}`);
            }
            if (($that2 = $that1[1].match(/that(?: (my|your))? (.+) (?:means|is) (.+)/))) {
              reply(`Okay, I will remember that "${$that2[1]}" as ${$that2[2]}`)
            }
            // if (($that2 = $that1[1].match(/to (.+)/))) {}
          }
          else if (($that1 = content.match(/(\d+|[a-z])\s*([\+\-\/\*])\s*(\d+|[a-z])(?:\s*\=\s*(\d+|[a-z]))?/))) {
            reply(`solving (${$that1[2]} ${$that1[1]} ${$that1[3]})`);
            const $operator = $that1[2];
            const $a = $that1[1];
            const $b = $that1[3];
            const $c = $that1[4];

            const isNumber$a = /^\d$/.test($a);
            const isNumber$b = /^\d$/.test($b);
            const isNumber$c = $c && /^\d$/.test($c);

            const isNumber = {
              a: isNumber$a,
              b: isNumber$b,
              c: isNumber$c
            };

            const isVariable$a = /^[a-z]$/.test($a);
            const isVariable$b = /^[a-z]$/.test($a);
            const isVariable$c = $c && /^[a-z]$/.test($a);
            const isVariable = {
              a: isVariable$a,
              b: isVariable$b,
              c: isVariable$c
            };

            const operation = $operator === '+' ? 'add' : $operator === '-' ? 'subtract' : $operator === '*' ? 'multiply' : $operator === '/' ? 'divide' : 'unknown';

            console.log({ operation, $a, $b, $c, isNumber, isVariable });
            
            // if ($operator === '+') console.log('subtract');
            // if ($operator === '-') console.log('add');
            // if ($operator === '*') console.log('multiply');
            // if ($operator === '/') console.log('divide');
            // if ($that1[4]) {
            //   reply(`verifying (${$that1[2]} ${$that1[1]} ${$that1[3]}) is ${$that1[4]}`);
            // }
          } else {

            // if (($that1 = content.match(/recall (.+)/))) {
              //   let $that2;
          //   // if (($that2 = $that1[1].match(/me/))) {}
          //   // if (($that2 = $that1[1].match(/that (.+) (means|is) (.+)/))) {}
          //   // if (($that2 = $that1[1].match(/to (.+)/))) {}
          // }
            write(`PRIVMSG ${that0[0]} :${content}`)
          }
        }
        // try {
        //   console.log('nick', expression.nick.exec(params[0]));
        //   console.log('nick', expression.nick.exec(prefix));
        // } catch (exception) { console.warn('error', exception); }
        // console.log(properties);
      }
    }
    if (typeof command === 'number') {
      if (!notes.has(command))
        notes.set(command, new Set);
      notes.get(command).add(match.text);
      if (command === 376) {
        write('PRIVMSG Failure :Hello!')
        write('JOIN ##Success');  
      }
    }
    
    console.log(match.text.trim())
  })
})

socket.on('drain', () => {
  console.log('drain')
})
socket.on('end', () => {
  console.log('end')
})
socket.on('error', (error /*: Error */) => {
  console.log('error', error)
})
socket.on('lookup', (error/*: Error | null */, address/*: String */, family/*: String | null */, host/*: String */) => {
  console.log('lookup', { error, address, family, host })
})
socket.on('ready', () => {
  console.log('ready')
})
socket.on('timeout', () => {
  console.log('timeout')
})

socket.on('close', () => {
  console.log('close')
})

// function * getMatches(expression, string) {
//   let that;
//   while ((that = expression.exec(string)) !== null && that !== undefined)
//     yield that
// }

function* getMatches (pattern, string) {
    const expression = addRegularExpressionFlags(pattern, 'g')

    let that

    while (exists(that = expression.exec(string)))
        yield that

    function addRegularExpressionFlags (regularExpression, original) {
        const filter = (a, b, c) => c.indexOf(a) === b
        const flags = (regularExpression.flags + original).split('').filter(filter).join('')
        const expression = new RegExp(regularExpression.source, flags)

        return expression
    }
    
    function exists (it) { return it !== undefined && it !== null }
}