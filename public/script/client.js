const irc = require('irc')

class Destination {}

console.log('hi')

const navigationElement = document.createElement('nav')
const mainElement = document.createElement('main')

const connections = {
	'localhost': [ '#chat' ] }

const servers = new Map

for (const [server, channels] of Object.entries(connections)) {
	servers.set(server, new Map)

	for (const channel of channels)
		servers.get(server).set(channel, new Set)
}

function hashify (it) {
	return it
	.replace(/\./g, '-dot-')
	.replace(/\#/g, '-hashtag-')
	.replace(/\-+/g, '-')
	.replace(/(^\-+|\-+$)/g, '')
}

function getConnection (server) {
	const client = new irc.Client(server, 'yaclient')
	const channels = servers.get(server)
	const hashifiedServer = hashify(server)
	const messageElements = new Map

	console.log(channels)

	const serverNavigationElement = document.createElement('section')
	const serverMessagesElement = document.createElement('section')

	client.on('registered', onRegistered)
	client.on('message', onMessage)
	// client.on('selfMessage', onSelfMessage)
	client.on('join', onJoin)

	function onRegistered (message/*:string*/)/*: void */ {
		const serverAnchorElement = document.createElement('a')
		const serverAnchorTextNode = document.createTextNode(server)

		serverMessagesElement.setAttribute('id', `messages-${hashifiedServer}`)
		serverMessagesElement.classList.add('server-messages')

		serverAnchorElement.setAttribute('href', `#${hashifiedServer}`)
		serverNavigationElement.setAttribute('id', hashifiedServer)

		serverAnchorElement.appendChild(serverAnchorTextNode)

		navigationElement.appendChild(serverAnchorElement)
		navigationElement.appendChild(serverNavigationElement)

		mainElement.appendChild(serverMessagesElement)

		for (const [channel] of channels)
			client.join(channel)
	}

	function onJoin (channel, nick, message) {
		if (!messageElements.has(channel))
			setMessageDestination(channel)
		setNavigationDestination(channel)
	}

	function onMessage (nick/*:string*/, to/*:string*/, text/*:string*/, message)/*:void*/ {
		if (!messageElements.has(to)) {
			setMessageDestination(to)
			setNavigationDestination(to)
		}

		if (!servers.get(server).has(to))
			servers.get(server).set(to, new Set)

		const who = nick
		const when = new Date()
		const where = to
		const what = text

		servers.get(server).get(to).add({ who, what, when, where })

		addMessage({ who, what, when, where })
	}

	function addMessage ({ who, what, when, where }) {
		const containerElement = messageElements.get(where)

		const messageElement = document.createElement('article')
		const fromAddressElement = document.createElement('address')
		const toAddressElement = document.createElement('address')
		const headerElement = document.createElement('header')
		const footerElement = document.createElement('footer')
		const contentElement = document.createElement('p')
		const senderElement = document.createElement('a')
		const destinationElement = document.createElement('a')
		const timeElement = document.createElement('time')

		const contentTextNode = document.createTextNode(what)
		const senderTextNode = document.createTextNode(who)
		const destinationTextNode = document.createTextNode(where)

		timeElement.setAttribute('datetime', when.toISOString())

		headerElement.appendChild(toAddressElement)
		footerElement.appendChild(timeElement)

		contentElement.appendChild(contentTextNode)
		senderElement.appendChild(senderTextNode)
		destinationElement.appendChild(destinationTextNode)
		fromAddressElement.appendChild(senderElement)
		toAddressElement.appendChild(destinationElement)

		messageElement.appendChild(headerElement)
		messageElement.appendChild(fromAddressElement)
		messageElement.appendChild(contentElement)
		messageElement.appendChild(footerElement)

		containerElement.appendChild(messageElement)

		return messageElement
	}

	function setMessageDestination (messageDestination) {
		const hashifiedMessageDestination = hashify(messageDestination)

		const destinationElement = document.createElement('section')

		destinationElement.classList.add('messages')
		destinationElement.setAttribute('id', `#messages-${hashifiedServer}-${hashifiedMessageDestination}`)
		serverMessagesElement.appendChild(destinationElement)
		messageElements.set(messageDestination, destinationElement)

		return destinationElement
	}

	function setNavigationDestination (navigationDestination) {
		const hashifiedNavigationDestination = hashify(navigationDestination)

		const destinationAnchorElement = document.createElement('a')
		const destinationAnchorTextNode = document.createTextNode(navigationDestination)

		destinationAnchorElement.setAttribute('href', `#${hashifiedServer}-${navigationDestination}`)

		destinationAnchorElement.appendChild(destinationAnchorTextNode)
		serverNavigationElement.appendChild(destinationAnchorElement)

		return destinationAnchorElement
	}
}

// function onMessage (nick/*:string*/, to/*:string*/, text/*:string*/, message)/*:void*/ {
// 	if (!servers.get('localhost').has(to)) servers.get('localhost').set(to, new Set)
// 	console.log(to, nick, text)
// 	servers.get('localhost').get(to).add({ nick, text, message })
// 	console.log(servers)
// }
//
// function onSelfMessage (to/*:string*/, text/*:string*/)/*:void*/ {
// 	if (!servers.get('localhost').has(to)) servers.get('localhost').set(to, new Set)
// 	console.log(to, null, text)
// 	servers.get('localhost').get(to).add({ text })
// }

document.addEventListener('DOMContentLoaded', function () {
	document.body.appendChild(navigationElement)
	document.body.appendChild(mainElement)

	for (const [server] of servers) getConnection(server)

	document.forms.message.addEventListener('submit', formEvent => { formEvent.preventDefault(); return false })
})
