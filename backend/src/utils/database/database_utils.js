//###################################################
// 제작 : HJ
// MySQL DB 연동 유틸리티
// 사용법
// import {DBManager} from '이 파일 경로';
// const query = DBManager.connect(async (con, user_number) => {
//      const result = await con.query(`SELECT * from user WHERE guid = (?)`, [user_number])
//      return result
// })
// ==========================
// async function 인 경우
// guid 가 19인 데이터를 받아온다.
// const result = await query(19);
// ==========================
// function 인 경우
// guid 가 19인 데이터를 받아론다
// query(19)
//      .then (result => {
//          // 성공 로직
//      })
//      .catch (err => {
//          // 에러 로직
//      })
// ==========================
//###################################################

// 필요한 모듈
import promiseMysql from 'promise-mysql'
import {fileLogger} from "../logger/filelogger";

/**
 * 데이터베이스 매니저
 * @type {{getOption: DBManager.getOption, connect: (function(*): function(...[*]): Promise<*|*[]|undefined>), transaction: (function(*): function(...[*]=): Promise<*|*[]|undefined>), setting: DBManager.setting}}
 */
const DBManager = (function () {
    let pool = null
    let options = null

    return {
        /**
         * DB 옵션 설정
         * @param dbOption
         */
        setting : (dbOption) => {
            try
            {
                pool = promiseMysql.createPool({
                    ...dbOption, dataString : 'date'
                })
                options = {...dbOption, dataString : 'date'}
                fileLogger.Logger().debug('DataBase Connect')
            }
            catch (err)
            {
                console.log(err)
            }

        },
        /**
         * 데이터베이스 연결하여 Query 문 실행
         * 단일 Query 문 실행할 때 좋으며 다중으로 실행할 때는 transaction 을 이용하는 것이 좋다.
         * @param fn
         * @return {(function(...[*]): Promise<*|*[]|undefined>)|*}
         */
        connect : fn => async (...args) => {
            const con = await (await pool).getConnection()
            try
            {
                const result = await fn(con, ...args).catch(err => {
                    con.connection.release()
                    throw err
                })

                con.connection.release()
                return result
            }
            catch (err)
            {
                const result = []
                con.connection.release()
                return result
            }
        },
        /**
         * 데이터 베이스 연결하여 Query 문 여러개 실행
         * 실패시 Query 문 반영이 안되고 롤백 된다.
         * 여러개 Query 문 사용하려면 이것을 이용하면 된다.
         * @param fn
         * @return {(function(...[*]=): Promise<*|*[]|undefined>)|*}
         */
        transaction : fn => async (...args) => {
            const con = await (await pool).getConnection()

            try
            {
                await con.connection.beginTransaction()

                const result = await fn(con, args).catch(async (err) => {
                    await con.rollback()
                    con.connection().release()
                    throw err
                })

                await con.commit()
                con.connection.release()
                return result
            }
            catch (err)
            {
                const result = []
                con.connection.rollback()
                con.connection.release()
                return result
            }
            // 트렌젝션 시작

        },
        /**
         * 재연결 안 쓰는 것을 권장한다.
         */
        getOption : () => {
            try
            {
                pool.release()
                pool.end()

            }
            catch (err)
            {
                fileLogger.Logger().error('ReConnection Error')
            }
            finally {
                if (options === null)
                    options = promiseMysql.createPool({

                        host : process.env.DATABASE_HOST || "127.0.0.1",
                        port : process.env.DATABASE_PORT || 3306,
                        user : process.env.DATABASE_USER || 'root',
                        password : process.env.DATABASE_PASSWORD || "fJ9<nX@%5Xj6d}MT",
                        database : process.env.DATABASE_NAME || 'tlc',
                        dataString : 'date'
                    })

                pool = promiseMysql.createPool(options)
                fileLogger.Logger().debug('ReConnection')
            }


        }
    }
})()

// 수출
export {
    DBManager
}