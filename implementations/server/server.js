const net = require('net')
const server = new net.Server()

const nicks = new Set

// LS, LIST, REQ, ACK, NAK, and END.

server.on('connection', socket => {
  let nick;
  let messages_from_client = 0;

  console.log('connection')

  socket.on('close', () => {
    console.log('close')
  })

  socket.on('connect', () => {
    console.log('connect')

    const to = nick !== null && nick !== undefined ? nick : '*'
    socket.write(`:localhost NOTICE ${to} :***Checking client ID`)
    socket.write(`:localhost NOTICE ${to} :***JK Welcome to the Server!`)
  })

  socket.on('data', (data /*: Buffer | String */) => {
    messages_from_client++
    const parser = /(?<command>[A-Za-z]+|\d+)(?<parameters>(?: [^\r\n\0: ][^\r\n\0 ]*)*( \:[^\r\n\0]*)?)[\n\r\0]+/gy
    for (const match of getMatches(parser, data.toString('utf8'))) {
      const { command } = match.groups
      const parameters = match.groups.parameters.substring(1)

      const to = nick !== null && nick !== undefined ? nick : '*'

      if (command.toUpperCase() === 'capability'.substring(0, 3).toUpperCase()) {
        if (!/^(LS|LIST|REQ|ACK|NAK|END)/.exec(parameters)) {
          const errorenous_command = parameters.match(/[a-zA-Z]+ /)[0]
          socket.write(`:localhost 410 ${to} ${parameters} :CAP subcommand is not valid.\r\n`)
        }

        if (/^LS/.test(parameters)) {
          socket.write(`CAP ${to} LS :identify-msg\r\n`)
        }

        console.log('capability negotiation', parameters)
      }
      if (command.toUpperCase() === 'NICK') {
        if (nick !== null && nick !== undefined && !nicks.has(parameters)) {
          nicks.delete(nick)
        }
        if (!nicks.has(parameters)) {
          nicks.add(parameters)
          nick = parameters
          socket.write(`:localhost NOTICE ${to} :Nick shall now be ${nick}\r\n`)
        } else if (nicks.has(parameters) && nick === parameters) {
          socket.write(`:localhost NOTICE ${to} :${nick} already the current nick.\r\n`)
        } else {
          socket.write(`:localhost NOTICE ${to} :${nick} is already taken!\r\n`)
        }
      }

      console.log({command: match.groups.command, parameters: match.groups.parameters.substring(1)}, messages_from_client)
    }

    // console.log(parser.exec(data.toString('utf8')))
    process.stdout.write('data: ')
    process.stdout.write(data.toString('utf8').replace(/[\r\n]+/gim, `\n    : `))
    console.log('')
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
})
server.on('listening', (...them) => {
  console.log('listening', server.address())
})
server.listen(50557)


function * getMatches(expression, string) {
  let that;
  while ((that = expression.exec(string)) !== null && that !== undefined)
    yield that
}
