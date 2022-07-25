//###################################################
// 제작 : HJ
// Redis DB 연동 유틸리티
// NoSQL 문으로써 Key 와 Value 값으로만 DB 이용한다.
// 필수 요구 사항 : Redis

// 캐시메모리를 이용하며 Redis 프로그램이 죽으면 Redis 로 저장한 데이터는 다 날아가니 중요 데이터는 mysql에 저장하고
// 적당히 필요한 데이터만 Redis 에 저장하는 것을 권장한다.

// 사용법
// import {RedisManager} from '이 파일 경로'

// 레디스에 데이터를 등록
// RedisManager.setHashData(key값, field값, value값, 유지 시간초 (-1 은 영구 기본값))

// 레디스에 여러개의 데이터 등록 (테스트 안해봄)
// 반환값은 true, false 반환
// RedisManager.setHashsData(key값, [
//  { fields : 필드값, message : 데이터 값}, { fields : ..., message : ... }
// ])

// 레디스 데이터 반환
// RedisManager.getHashData(key값, field값)
// 여러개 반환
// RedisManager.getHashsData(key값, [fields 값, fields 값 ...])

// 레디스에 필드 존재 여부
// RedisManager.hasHasData(key 값, field 값) 없으면 null
// 키 반환
// RedisManager.getKeysHashData(key 값 (기본값 전체키값))
// 키 삭제
// RedisManager.deleteKey(key 값)
//###################################################

// 필요 모듈
import {createClient} from 'redis'
import {fileLogger} from "../logger/filelogger";


const RedisManager = (function(){
    let redisClient = null
    let connectOption = null
    let isRedis = false

    //#region Handler
    /**
     * 준비상태
     * @private
     */
    function _handlerReady(){
        fileLogger.debug('Redis Ready')
        console.log('Redis Ready');
    }

    /**
     * 연결상태
     * @private
     */
    function _handlerConnect(){
        fileLogger.info('Redis Connect')
        console.log('Redis Connect');
    }

    /**
     * 재연결상태
     * @private
     */
    function _handlerReConnect(){
        fileLogger.info('Redis ReConnect')
        console.log('Redis ReConnect');
    }

    /**
     * 에러상태
     * @param err
     * @private
     */
    function _handlerError(err){
        fileLogger.info(`Redis Error ${err}`)
        console.log(err);
    }
    //#endregion

    /**
     * Redis DB 연결
     * @param _connectionOptions
     * @return {Promise<void>}
     * @private
     */
    async function _connect(_connectionOptions)
    {
        if(redisClient === null)
        {
            redisClient = createClient(_connectionOptions)

        }
        else {
            redisClient.disconnect()
            redisClient = null
            redisClient = createClient(_connectionOptions)
        }
        connectOption = _connectionOptions
        isRedis = true
        await redisClient.connect()

        // 모든 테이블 초기화 (주석처리)
        // await redisClient.flushAll()

        redisClient.on('ready', () => {
            // redis server와 연결이 확정되고 클라이언트가 준비 상태 되었을 때 이벤트 발생
            _handlerReady()
        })
        redisClient.on('connect', () => {
            // redis Server와 Connection을 맺을 때 이벤트 발생
            _handlerConnect()
        })
        redisClient.on('reconnecting', () => {
            // 재연결
            _handlerReConnect()
        })
        redisClient.on('error', (err) => {
            _handlerError(err)
        })
    }

    /**
     * 데이터 타입 체크
     * @param _data
     * @return {Promise<string|string>}
     * @private
     */
    async function _objectCheck(_data)
    {
        if(typeof _data === 'string')
            return 'string'

        if(typeof _data === 'number')
            return 'number'

        if(typeof _data === 'object')
        {
            const constructorName = _data.constructor.name.toLowerCase()
            if(constructorName === 'array')
                return 'array'
            if(constructorName === 'object')
                return 'object'
            if(constructorName === 'map')
                return 'map'
            if(constructorName === 'set')
                return 'set'
        }
    }

    /**
     * 해당 키 값에 유효시간 설정
     * @param _key
     * @param _expire
     * @return {Promise<boolean>}
     * @private
     */
    async function _expireSetting(_key, _expire = -1)
    {
        if(_expire <= -1)
            return false

        try
        {
            await redisClient.expire(_key, _expire)
        }
        catch (err)
        {
            console.log(err)
            return false
        }
    }

    /**
     * 해시테이블 데이터 삽입
     * @param key
     * @param field
     * @param message
     * @param expire
     * @return {Promise<boolean>}
     * @private
     */
    async function _setHashData(key, field, message, expire)
    {
        if(field === undefined || message === undefined || expire === undefined) return false
        try {
            const dataType = await _objectCheck(message)

            if(dataType === 'string' || dataType === 'number')
            {
                let type = '[type=str]'
                redisClient.hSet(key, field, type.concat(message));
                await _expireSetting(key, expire);
                return true
            }

            if(dataType === 'array')
            {
                let type = '[type=arr]'
                const arr = []
                if(message.length <= 0)
                {
                    arr.push('null')
                }
                else
                {
                    for(let i = 0; i < message.length; i++)
                        arr.push(message[i])
                }

                redisClient.hSet(key, field, type.concat(arr.join('=')))
                await _expireSetting(key, expire);
                return true
            }

            if(dataType === 'object')
            {
                let type = '[type=obj]'
                const json = JSON.stringify(message)
                redisClient.hSet(key, field, type.concat(json))
                await _expireSetting(key, expire);
                return true
            }

            if(dataType === 'map')
            {
                let type ='[type=map]'
                const data = Object.fromEntries(message)
                const json = JSON.stringify(data)
                redisClient.hSet(key, field, type.concat(json))
                await _expireSetting(key, expire);
                return true
            }

            if(dataType === 'set')
            {
                let type ='[type=set]'
                let arr
                if(message.size > 0)
                    arr = Array
                        .from(message)
                        .map(item => {
                            if(item === undefined)
                                return 'null'
                            else
                                return item
                        })
                else
                    arr = ['null']

                redisClient.hSet(key, field, type.concat(
                    arr.join('=')
                ))
                await _expireSetting(key, expire);
                return true
            }
        }
        catch (err)
        {
            console.log(err)
            fileLogger.Logger.error(`Redis Set Hash Error ${key} : ${field}`)
            return false
        }

        return true

    }

    /**
     * 해시테이블 데이터 반환
     * @param key
     * @param field
     * @return {Promise<Map<any, any>|Set<any>|null|any>}
     * @private
     */
    async function _getHashData(key, field)
    {
        const result = await redisClient.hGet(key, field)

        if (result === null) return null

        const typeName = result
            .substr(0, 10)
            .replace(/[\[\]']+/g, '').split('=')[1]
        const parsing = result.slice(10)


        if (typeName === 'arr') {
            return parsing.split('=').filter(i => i !== 'null')
        }

        if(typeName === 'set')
        {
            const data = new Set()

            parsing.split('=').forEach(i => {
                if(i !== 'null')
                    data.add(i)
            })
            console.log(data);
            return data
        }

        if (typeName === 'obj') {
            return JSON.parse(parsing)
        }

        if(typeName === 'map'){
            const parse = JSON.parse(parsing)
            const map = new Map()

            for (const [key, value] of Object.entries(parse))
            {
                map.set(key, value)
            }

            return map
        }

        return parsing
    }

    return {
        /**
         * 연결 시킨다.
         * @param _connectionOptions {{
         *     host : string,
         *     port : number,
         *     password : string,
         *     database : number
         * }}
         */
        connect : async (_connectionOptions) => {
            await _connect(_connectionOptions)
            return true
        },

        /**
         * 레디스 해시테이블에 등록
         * @param key {string} 키값
         * @param field {string} 필드명
         * @param message {object | array | string}
         * @param expire {number} 키 유효시간 -1은 영구, 10입력시 10초
         * @return {Promise<void>}
         */
        setHashData : async (key, field, message, expire = -1) => {
            if(redisClient === null)
                await _connect(connectOption)

            await _setHashData(key, field, message, expire)

            return this
        },
        /**
         * 레디스 해시테이블 여러개 데이터 등록
         * @param key {string}
         * @param _array {[{fields : string, message : object | array | string}]}
         * @param _expire {number} expire 는 -1로 해야 영구 적용이다.
         * @return {Promise<boolean>}
         */
        setHashsData : async (key, _array = [], _expire = -1) => {
            if(redisClient === null)
                await _connect(connectOption)

            if(_array.length <= 0) return false


            try
            {
                await redisClient.multi()

                for(let i = 0 ; i < _array.length; i++)
                {
                    if(i === _array.length - 1)
                    {
                        await _setHashData(key, _array[i].fields, _array[i].message, _expire)
                    }
                    else
                    {
                        await _setHashData(key, _array[i].fields, _array[i].message, -1)
                    }

                }

                await redisClient.exec()
            }
            catch (err)
            {
                await redisClient.discard()
                return false
            }
            return true
        },
        /**
         * 레디스 헤시테이블 값 반환
         * @param key {string} 키
         * @param field {string} 필드
         * @return {Promise<null|any>}
         */
        getHashData : async (key, field) => {
            if (redisClient === null)
                await _connect(connectOption)
            return await _getHashData(key, field)
        },
        /**
         * 레디스 해시테이블 여러개 데이터 값 반환
         * @param key
         * @param fields
         * @return {Promise<null|boolean|*[]>}
         */
        getHashsData : async (key, fields = []) => {
            if (redisClient === null)
                await _connect(connectOption)

            if (fields.length <= 0) return null


            const result = []
            try
            {
                await redisClient.multi()
                for(let i = 0 ; i < fields.length; i++)
                {
                    result.push(await _getHashData(key, fields[i]))
                }
                await redisClient.exec()
            }
            catch (err)
            {
                await redisClient.discard()
                return false
            }

            return result
        },
        /**
         * 레디스 헤시테이블 필드 여부
         * @param key
         * @param field
         * @return {Promise<*>}
         */
        hasHashData : async (key, field) => {
            if (redisClient === null)
                await _connect(connectOption)
            return await redisClient.hExists(key, field)
        },
        /**
         * 키 반환
         * @param key
         * @return {Promise<*>}
         */
        getKeysHashData : async (key = '*') => {
            if (redisClient === null)
                await _connect(connectOption)

            if(key === '*')
            {
                const arr =[]
                await redisClient.hKeys(key, function(err, keys){
                    if(err) return []

                    for(let i = 0, len = keys.length; i < len; i++)
                    {
                        arr.push(keys[i])
                    }
                    return arr
                })
                return arr
            }

            return await redisClient.hKeys(key)
        },
        /**
         * 키 삭제
         * @param key
         * @return {Promise<null|boolean>}
         */
        deleteKey : async (key = null) => {
            if (redisClient === null)
                await _connect(connectOption)

            if(key === null) return null

            await redisClient.del(key)
            return true
        },
        /**
         * 모든 데이터를 지웁니다.
         * @return {Promise<boolean>}
         */
        allDelete : async () => {
            if (redisClient === null)
                await _connect(connectOption)

            await redisClient.flushAll()
            return true
        }
    }
})()

export {
    RedisManager
}