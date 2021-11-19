import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'

// modules for server side rendering
import React from 'react'
import ReactDomServer from 'react-dom/server'
import {StaticRouter} from 'react-router-dom'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())

//enables CORS - Cross Origin Resource Sharing
app.use(cors())

// secure apps by setting various HTTP headers
app.use(helmet())
app.get('/',(req, res) => {
    res.status(200).send(Template())
})
// mount routes
app.use('/', userRoutes)
app.use('/', authRoutes)



//catch unauthorized errors
app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({"error" : err.name + ": " + err.message})
    } else if (err){
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
})

export default app