

import {Router} from "../../utils/router/router_utils";
import {DBManager} from "../../utils/database/database_utils";
import dayjs from "dayjs";
import {undefinedCheck} from "../../utils/typeCheck/undefinedCheck";

const mysql_select_example = new Router()

mysql_select_example
    .setKey('mysql_select')
    .setComment('mysql로 데이터 불러오기')
    // http://localhost:8000/api/dbload/select
    .setUrl('/api/dbload/select')
    .setMethod('get')
    .setEvent(async (req, res) => {
        // SQL 문 정의
        const db = DBManager.connect(async (con) => {
            return con.query(`select guid, ex_name as _name, ex_password as _pw, ex_refresh_token as _token, ex_email as _email, ex_create_time as _time FROM tutorials`)
        })

        // SQL 문 실행  _idx = 2
        const result = await db()

        // 클라이언트로 전송
        res.send(JSON.stringify({
            message : result,
            status : 'success'
        }))
    })

const mysql_insert_example = new Router()

mysql_insert_example
.setKey('insert_mysql')
// http://localhost:8000/api/dbload/insert
.setUrl('/api/dbload/insert')
.setMethod('post')
.setEvent(async (req, res) => {

    // 클라이언트에서 전송한 데이터 (body 값)
    const {name, password, token ,email} = req.body

    const check = undefinedCheck([name, password, token, email])

    // 4개의 값중에 undefine 값이 하나라도 있는 경우
    if(check > 0) {
        // 맨 밑에 한번더 실행 안되도록 리턴하여 함수를 종료
        res.send(JSON.stringify({
            message : [],
            status : '실패'
        }))
        return
    }

    // SQL 문 정의
    const db = DBManager.connect(async (con, _name, _password, _token, _email) => {
        // (sql문법, [? 값])
        // (?)가 3개 일 경우 [A,B,C]  => (?)왼쪽부터 A, 그다음 B, C 순으로 들어간다.
        return con.query(`INSERT INTO tutorials (ex_name, ex_password, ex_refresh_token, ex_email, ex_cretae_time) VALUES (?,?,?,?,?)`, [
            _name, _password, _token, _email, dayjs().format('YYYY-MM-DD HH:mm:ss')
        ])
    })

    // SQL 문 실행 \ _name = name, _password = password, _token = token, _email = email
    await db(name, password, token, email)

    // 클라이언트로 전송
    res.send(JSON.stringify({
        message : ['저장 성공'],
        status : '성공'
    }))
})

const mysql_update_example = new Router()

mysql_update_example
    .setKey('update_mysql')
    // http://localhost:8000/api/dbload/update
    .setUrl('/api/dbload/update')
    .setMethod('put')
    .setEvent(async (req, res) => {

        // 클라이언트에서 전송한 데이터 (body 값)
        const {guid, change_name} = req.body

        const check = undefinedCheck([guid, change_name])

        // 2개의 값중에 undefine 값이 하나라도 있는 경우
        if(check > 0) {
            // 맨 밑에 한번더 실행 안되도록 리턴하여 함수를 종료
            res.send(JSON.stringify({
                message : [],
                status : '실패'
            }))
            return
        }

        // SQL 문 정의
        const db = DBManager.connect(async (con, _guid, _name) => {
            // (sql문법, [? 값])
            // (?)가 3개 일 경우 [A,B,C]  => (?)왼쪽부터 A, 그다음 B, C 순으로 들어간다.
            return con.query(`UPDATE tutorials SET ex_name = (?) WHERE guid = (?) `, [_name, _guid])
        })

        // SQL 문 실행 \ _name = name, _password = password, _token = token, _email = email
        await db(guid, name)

        // 클라이언트로 전송
        res.send(JSON.stringify({
            message : ['업데이트 성공'],
            status : '성공'
        }))
    })

const mysql_delete_example = new Router()

mysql_delete_example
    .setKey('delete_mysql')
    // http://localhost:8000/api/dbload/delete
    .setUrl('/api/dbload/delete')
    .setMethod('delete')
    .setEvent(async (req, res) => {

        // 클라이언트에서 전송한 데이터 (body 값)
        const {guid} = req.body

        // Undefine 값 체크
        const check = undefinedCheck([guid])

        // N개의 값중에 undefine 값이 하나라도 있는 경우
        if(check > 0) {
            // 맨 밑에 한번더 실행 안되도록 리턴하여 함수를 종료
            res.send(JSON.stringify({
                message : [],
                status : '실패'
            }))
            return
        }

        // SQL 문 정의
        const db = DBManager.connect(async (con, _guid) => {
            // (sql문법, [? 값])
            // (?)가 3개 일 경우 [A,B,C]  => (?)왼쪽부터 A, 그다음 B, C 순으로 들어간다.
            return con.query(`DELETE FROM tutorials WHERE guid = (?) `, [_guid])
        })

        // SQL 문 실행 \ _name = name, _password = password, _token = token, _email = email
        await db(guid)

        // 클라이언트로 전송
        res.send(JSON.stringify({
            message : ['삭제 성공'],
            status : '성공'
        }))
    })

const mysqlArray = [mysql_select_example, mysql_insert_example, mysql_update_example, mysql_delete_example]
export {
    mysqlArray
}