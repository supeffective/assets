import path from 'node:path'
import fs from 'node:fs'

import bodyParser from 'body-parser'
import cors from 'cors'
import express, { type Express, type Request, type Response } from 'express'

const projectRoot = path.resolve(process.cwd(), '..')

const config = {
  port: process.env.PORT ?? '3999',
  assetsPath: process.env.ASSETS_PATH ?? path.join(projectRoot, 'assets'),
}

if (!fs.existsSync(config.assetsPath) || !fs.lstatSync(config.assetsPath).isDirectory()) {
  throw new Error(`Assets path '${config.assetsPath}' does not exist or is not a directory`)
}

const app: Express = express()
const { port, assetsPath } = config

app.use(cors())

// parse application/x-www-form-urlencoded requests
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json requests
app.use(bodyParser.json())

// root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.send('Assets Server is Running')
})

// serve static content under /assets
app.use('/assets', express.static(assetsPath))

// TODO add CRUD endpoints for the data, refactoring admin and datalayer accordingly

app.listen(port, () => {
  console.log(`⚡️[assets-server]: Server is running at http://localhost:${port}`)
})
