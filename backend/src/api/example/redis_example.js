
import {Router} from "../../utils/router/router_utils";
import {undefinedCheck} from "../../utils/typeCheck/undefinedCheck";
import {RedisManager} from "../../utils/database/redis_utils";

const create_redis_example = new Router()
const update_redis_example = new Router()
const delete_redis_example = new Router()

create_redis_example.setKey('Redis_create')
    .setComment('Redis 데이터 생성')
    .setUrl('/api/redis/create')
    .setMethod('post')
    .setEvent(async (req, res) => {
        const {key, field, value} = req.body

        const check = undefinedCheck([key, field, value])
        if(check > 0)
        {
            res.send(JSON.stringify({
                message : [],
                status : '생성 실패'
            }))
            return
        }

        // 레디스 데이터 삽입
        await RedisManager.setHashData(key, field, value)

        // 데이터 삽입된 거 반환
        const message = await RedisManager.getHashData(key, field)

        res.send(JSON.stringify({
            message : message,
            status : '생성 완료'
        }))
    })

update_redis_example.setKey('Redis_update')
    .setComment('Redis 데이터 업데이트')
    .setUrl('/api/redis/update')
    .setMethod('put')
    .setEvent(async (req, res) => {
        const {key, field, value} = req.body

        const check = undefinedCheck([key, field, value])
        if(check > 0)
        {
            res.send(JSON.stringify({
                message : [],
                status : '업데이트 실패'
            }))
            return
        }

        // 레디스 데이터 삽입
        await RedisManager.setHashData(key, field, value)

        // 데이터 삽입된 거 반환
        const message = await RedisManager.getHashData(key, field)

        res.send(JSON.stringify({
            message : message,
            status : '업데이트 완료'
        }))
    })

delete_redis_example.setKey('Redis_delete')
    .setComment('Redis 데이터 업데이트')
    .setUrl('/api/redis/delete')
    .setMethod('delete')
    .setEvent(async (req, res) => {
        const {key} = req.body

        const check = undefinedCheck([key])
        if(check > 0)
        {
            res.send(JSON.stringify({
                message : [],
                status : '삭제 실패'
            }))
            return
        }

        // 레디스 데이터 키 제거
        await RedisManager.deleteKey(key)

        res.send(JSON.stringify({
            message : 'Success',
            status : '삭제 완료'
        }))
    })

const redisRouterArray = [create_redis_example, update_redis_example, delete_redis_example]
export {redisRouterArray}