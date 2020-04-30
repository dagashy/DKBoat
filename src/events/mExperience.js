const fs = require('fs').promises
const docs = new Map()

module.exports = {
	name: 'mExperience',
	description: 'get experience by message',
	usage: 'send message and gain experience',
	execute: async (message) => {
		const rankRP = require('../docs/ranks/rankRP.json')
		const rankInvite = require('../docs/ranks/rankInvites.json')
		const docsFiles = await fs.readdir('src/docs/sheets')
		for (const file of docsFiles) {
			const document2 = require(`../docs/sheets/${file}`);
			docs.set(document2.server.id, document2);
		}

		const autorId = message.author.id
		let document
		let reply = `Message ammout ++ to ${message.author.username}`
		if (docs.get(autorId)) {

			document = docs.get(autorId)
			document.server.messages.xp++
			document.server.messages.amount++

		} else {
			try {
				document = docs.get('template')
				document.server.id = autorId
				document.server.username = message.author.username
				document.server.discriminator = message.author.discriminator
				document.server.messages.xp = 1
				document.server.messages.amount = 1
				if(!rankRP.users[autorId]) {
					rankInvites.users.total++
					rankRP.users.total++
				}
				rankRP.users[autorId] = {}
				rankRP.users[autorId].level = 1
				rankRP.users[autorId].name = document.server.username
				rankRP.users[autorId].rank = rankRP.users.total
				rankInvite.users[autorId] = {}
				rankInvite.users[autorId].level = 1
				rankInvite.users[autorId].name = document.server.username
				rankInvite.users[autorId].rank = rankRP.users.total
				

				const data = JSON.stringify(rankRP)
				await fs.writeFile('src/docs/ranks/rankRP.json', data)
					.then(console.log(`rankRP of ${message.author.username} gotcha`))
					.catch(err => console.log(err))

				const data2 = JSON.stringify(rankInvite)
				await fs.writeFile('src/docs/ranks/rankInvites.json', data2)
					.then(console.log(`rankInvites of ${message.author.username} gotcha`))
					.catch(err => console.log(err))
			} catch (err) {
				console.log(err)
			}
		}
		const level = document.server.messages.level
		const need = (level * (15 + level))
		if(document.server.messages.xp >= need) {
			document.server.messages.level++
			document.server.messages.xp = 0

			try {
				message.guild.channels.cache.get('698941586377277453')
					.send(`<@${message.author.id}> novo level: ${level + 1}`)
			} catch(err) {
				console.log(err)
			}
			reply = `Level message UP to ${message.author.username}`
		}

		const data = JSON.stringify(document)
		await fs.writeFile(`src/docs/sheets/${autorId}.json`, data)
			.then(console.log(reply))
			.catch(err => console.log(err))

	},
}