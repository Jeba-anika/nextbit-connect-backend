import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'

import globalErrorHandler from './app/middlewares/globalErrorHandler'
import cookieParser from 'cookie-parser'
import httpStatus from 'http-status'
import router from './app/routes'

const app: Application = express()
const corsOptions = {
  origin: ['https://nextbit-connect-frontend.vercel.app', 'http://localhost:3000'], // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/', router)

app.get('/', (req, res) => {
  res.send('Welcome to NextBit Connect')
})
app.use(globalErrorHandler)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});


export default app
