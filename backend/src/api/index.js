

import {exampleArray} from "./example/example1";
import {RouterManager} from "../utils/router/router_utils";
import {mysqlArray} from "./example/db_example";
import {redisRouterArray} from "./example/redis_example";


// 등록
RouterManager.addArrayRouter(exampleArray)
RouterManager.addArrayRouter(mysqlArray)
RouterManager.addArrayRouter(redisRouterArray)

export {}