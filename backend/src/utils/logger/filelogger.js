//##################################################################################
// 제작 : HJ
// 파일로그
// 서버에 기록을 남기는 유틸리티
// 사용법
// import {fileLogger} from '이 파일 경로';
// fileLogger.Logger().info('Message')      info 로그 생성
// fileLogger.Logger().debug('Message')     debug 로그 생성
// fileLogger.Logger().http('Message')      http 로그 생성
// fileLogger.Logger().error('Message')     error 로그 생성
//##################################################################################
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import path from 'path';

const fileLogger = (function (){
    let logDir = 'logs'
    let logger = undefined

    const {combine, timestamp, label, printf} = winston.format

    const logFormat = printf(({level, message, label, timestamp}) => {
        return `${timestamp} [${label}] ${level} : ${message}`
    })
    return {
        initLogger : (pwd) => {
            logDir = path.join(pwd, 'log', 'server_log')
        },
        LoggerSetting : () => {
            logger = winston.createLogger({
                format : combine(
                    label({
                        label : 'Server'
                    }),
                    timestamp({
                        format : 'YYYY-MM-DD HH:mm:ss'
                    }),
                    logFormat
                ),
                transports : [
                    new winstonDaily({
                        // info 레벨 로그 저장할 파일 설정
                        level : 'info',
                        datePattern : 'YYYY-MM-DD',
                        dirname : logDir,
                        filename : `%DATE%.log`,
                        maxFiles : 30, // 최대 30일치 까지만 저장
                        zippedArchive : true
                    }),
                    new winstonDaily({
                        // info 레벨 로그 저장할 파일 설정
                        level : 'debug',
                        datePattern : 'YYYY-MM-DD',
                        dirname : path.join(logDir, 'debug'),
                        filename : `%DATE%.debug.log`,
                        maxFiles : 30, // 최대 30일치 까지만 저장
                        zippedArchive : true
                    }),
                    new winstonDaily({
                        // Http 로그 저장
                        level : 'http',
                        datePattern : 'YYYY-MM-DD',
                        dirname : path.join(logDir, 'http'),
                        filename : `%DATE%.request.log`,
                        maxFiles : 30,
                        zippedArchive : true
                    }),
                    new winstonDaily({
                        // 에러 로그 저장
                        level : 'error',
                        datePattern : 'YYYY-MM-DD',
                        dirname : path.join(logDir, 'error'),
                        filename: `%DATE%.error.log`,
                        maxFiles : 30,
                        zippedArchive : true
                    })
                ],
                exceptionHandlers : [
                    // 에러 발생시
                    new winstonDaily({
                        level : 'error',
                        datePattern : 'YYYY-MM-DD',
                        dirname : path.join(logDir, 'exception'),
                        filename : `%DATE%.exception.log`
                    })
                ]

            })
            if(process.env.NODE_ENV !== 'production')
            {
                logger.add(new winston.transports.Console({
                    format : winston.format.combine(
                        winston.format.colorize(), // 색상 넣어서 출력
                        winston.format.simple()
                    )
                }))
            }
        },
        Logger : () => logger



    }
})()
export {
    fileLogger
}