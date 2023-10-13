import { Server } from 'http';
import app from './app'
import config from './config/index'

async function bootstrap() {
  try {
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

bootstrap()
