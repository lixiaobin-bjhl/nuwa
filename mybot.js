const { Wechaty, Room } = require('wechaty')

var axios = require('axios')
var signal = '';  

Wechaty.instance()
	.on('scan', (url, code) => {
		if (!/201|200/.test(String(code))) {
			const loginUrl = url.replace(/\/qrcode\//, '/l/')
			require('qrcode-terminal').generate(loginUrl)
		}
		console.log(url)
	})

	.on('login', user => {
		console.log(`${user} login`)
	})

	.on('friend', async function (contact, request) {
		if (request) {
			await request.accept()
			console.log(`Contact: ${contact.name()} send request ${request.hello}`)
		}
	})

	.on('message', async function (m) {
		const contact = m.from()
		const content = m.content()
		const room = m.room()

		if (room) {
			console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
		} else {
			console.log(`Contact: ${contact.name()} Content: ${content}`)
		}
		console.log(content);

		if (content == 'charity') {
			signal = 'charity'
			console.log('signal on')
			return;
		} else if (content == 'off') {
			signal = ''
			console.log('signal off')
			return;
		}
		if (m.self()) {
			return
		}
		if (signal) {
			axios.post('http://www.tuling123.com/openapi/api', {
				key: 'd60c56cc36c244f0b6df88c5950a3f4d',
				info: content
			}).then((res)=> {
				m.say(res.data.text)
			})
			return;
		}
		
		if (/room/.test(content)) {
			let keyroom = await Room.find({ topic: "test" })
			if (keyroom) {
				await keyroom.add(contact)
				await keyroom.say("welcome!", contact)
			}
		}

		if (/out/.test(content)) {
			let keyroom = await Room.find({ topic: "test" })
			if (keyroom) {
				await keyroom.say("Remove from the room", contact)
				await keyroom.del(contact)
			}
		}
	})

	.init()