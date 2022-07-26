// 다른 자바스크립트 라이브러리 불러오기
import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import http from 'http'
import https from 'https'
import color from 'colors';
import fs from 'fs';
import {fileLogger} from "./utils/logger/filelogger";
import cors from 'cors';
import {RouterManager} from "./utils/router/router_utils";
import './api'
import {DBManager} from "./utils/database/database_utils";
import {RedisManager} from "./utils/database/redis_utils";
// 웹 서버 (즉시실행함수)
const WebServer = (function(){
    // root 위치 (__dirname은 현재 이 파일의 경로)
    let rootDir = path.join(__dirname, '..', '..')

    // 환경변수 설정
    dotenv.config({
        path : path.join(__dirname, '..', 'config', '.env')
    })

    // 환경변수 값 변수에 대입
    const env = {
        node : {
            env : process.env.NODE_ENV,
            host : process.env.NODE_HOST,
            port : Number(process.env.NODE_PORT),
            https : process.env.NODE_HTTPS
        },
        db : {
            isUse : process.env.DATABASE_USE,
            host : process.env.DATABASE_HOST,
            port : Number(process.env.DATABASE_PORT),
            user : process.env.DATABASE_USER,
            password : process.env.DATABASE_PASSWORD,
            name : process.env.DATABASE_NAME,
            connection : Number(process.env.DATABASE_MAX_CONNECTION)
        },
        redis : {
            isUse : process.env.REDIS_USE,
            host : process.env.REDIS_HOST,
            port : Number(process.env.REDIS_PORT),
            password : process.env.REDIS_PASSWORD,
            db : Number(process.env.REDIS_DATABSE)
        },
        secret : {
            jwtAccessKey : process.env.JWT_SECRET_ACCESS_TOKEN_KEY,
            jwtRefreshKey : process.env.JWT_SECRET_REFRESH_TOKEN_KEY,
            cookieKey : process.env.COOKIE_SECRET,
            saltKey : process.env.SALT_SECRET
        }
    }

    // Express Server
    const expressServer = express()

    let httpServer;
    let isHttps = false
    let isDB = false
    let isRedis = false

    return {
        init : () => {
            // 파일로그 설정
            fileLogger.initLogger(rootDir);
            fileLogger.LoggerSetting();

            // HTTPS 작동여부
            if(env.node.https === 'true')
            {
                // Https 적용 (SSL 인증키 필요)
                const options = {
                    key : fs.readFileSync(path.join(rootDir, 'https_key', 'server.no.key')),
                    cert : fs.readFileSync(path.join(rootDir, 'https_key', 'server.crt')),
                    passphrase : '1234',     // SSL 비밀번호
                    // 허가되지 않은 보안 인증을 reject 할 건지 에 대한 옵션
                    agent : false
                };
                isHttps = true
                httpServer = https.createServer(options, expressServer)

            }
            else
            {
                // Http1.1
                httpServer = http.createServer(expressServer)
            }

            // JSON 최대 용량 설정
            expressServer.use(express.json({
                limit : '50mb'
            }));

            // URL 인코딩 설정
            expressServer.use(express.urlencoded({
                extended : false
            }));

            // CORS 정책 설정
            expressServer.use(cors({
                preflightContinue : true,
                credentials : true
            }   ))

            // URL 적용되는 공유 폴더 생성
            expressServer.use('/public', express.static(path.join(__dirname, 'public')))

        },
        /**
         * 라우터 셋팅
         */
        routerSetting : () => {
            // API 라우터 셋팅
            // console.log(RouterManager.getRouter())
            RouterManager.getRouter().forEach((router, key) => {
                router.Events.forEach(event => {
                    expressServer[router.Method](router.Url, event)
                })
            })
        },
        /**
         * 데이터베이스 셋팅
         */
        dbSetting : () => {
            if(env.db.isUse === 'false')
            {
                isDB = false
                return
            }

            // 데이터 베이스 셋팅
            DBManager.setting({
                host : env.db.host,
                port : env.db.port,
                user : env.db.user,
                password : env.db.password,
                database : env.db.name,
                connectionLimit : env.db.connection
            })
            console.log('Database Connect'.bgWhite.red)
            isDB = true

        },
        redisSetting : async () => {
          if(env.redis.isUse === "false")
          {
              isRedis = false
              return
          }
          try
          {
              await RedisManager.connect({
                  host : env.redis.host,
                  port : env.redis.port,
                  password : env.redis.password,
                  database : env.redis.db
              })
              console.log('Redis Connect'.bgWhite.red)
          }
          catch (err)
          {
              console.error(err)
          }

        },
        listen : () => {
            httpServer.listen(env.node.port, () => {
                let str = `${isHttps ? 'https' : 'http'}://localhost:${env.node.port}`
                console.log(`${isHttps ? 'HTTPS'.cyan : "HTTP".blue} ${'App Started Listening'.magenta.bold} [${str}]`)
            })
        }
    }
})()


// 서버 실행
WebServer.init()
WebServer.routerSetting()
WebServer.dbSetting()
WebServer.redisSetting().then(_ => {
    WebServer.listen()
})

