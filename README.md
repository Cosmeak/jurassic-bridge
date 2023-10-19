![Logo](docs/assets/jurassic-bridge-logo.png)

# JurassicBridge
JurassicBridge is a wrapper library in node.js for the Pterodactyl API V1. 

For now, you can use the client part of the API. This was principaly design to create a Discord bot and handle interaction between the Pterodactyl Panel and the bot.
However it can be used in every node.js project.

## Getting Started
```bash
npm i jurassic-bridge
```

```ts
import { Client } from "jurassic-bridge"

const client = new Client("host", "key")
const servers = client.servers()
console.log(servers) // Collection of Server class
```

## Example
This are simple example of how you can use the wrapper. If you need more details of available functions, please refer to the documentation.

For each example we will consider that you previously do the getting started.

### Start all servers
```ts
for (const server of servers) {
	if (server.isOffline) {
		server.start()
	}
}
```

### Send command 
```ts
server.sendCommand('say Hello world!')
```


### Create a new database for a server
```ts
const database = server.createDatabase({
	database: "database_name",
	remote: "%"
})
```
Or
```ts
import { ServerDatabase } from "jurassic-bridge"

const database = ServerDatabase.create(client.bridge, server.identifier, {
	database: "database_name",
	remote: "%"
})
```

## Contribute
The project respect the [conventional commits](https://www.conventionalcommits.org/fr/v1.0.0/), so follow the rules carefully.

In other hand, eslint check all code you write here, remember to check what you are doing with `npm run lint` and if you have some errors / warnings, it can be resolved with the `npm lint --fix` command to simplify your life.

Thanks to all contributors who help us with this project. 🙏

## License
This project is under the terms of [MIT License](LICENSE). 

Refer to the document if you want to know more about it.
