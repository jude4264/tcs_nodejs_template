// 예시 1

// 1. Router 모듈을 불러준다.
import {Router} from "../../utils/router/router_utils";
import dayjs from "dayjs";      // 날짜 관련 모듈
// 2. Router를 생성한다.
const example1 = new Router()

// 3. URL을 만든다.
example1
    .setKey('example1')                     // 라우터 guid
    .setComment('이 것은 예시 입니다.')       // 라우터에 대한 주석
    .setMethod('get')                       // 라우터 HTTP 방식을 GET으로 설정
    // 예시 (http://localhost:8000/api/example1/:id/:name)
    .setUrl('/api/example1/:id/:name')        // URL 설정  : 이것이 붙어있는 것은 어떤 값이 들어오면 id = 값 형태로 변수에 들어온다.
    // 이벤트는 위에서 아래로 순서이며
    // next() 실행시키면 다음 이벤트로 넘어간다.
    // req는 요청 메세지에 관련되서 프론트엔트에서 준 데이터와 헤더가 담겨있습니다.
    // res는 서버에서 클라이언트로 보낼 때 데이터와 헤더를 어떻게 줄건지에 대한 겁니다.
    // next는 지금 이벤트에는 적용할 로직이 없어서 다음 이벤트로 넘어갑니다.
    // res는 단 한번만 보내고 return으로 함수를 종료시켜야 합니다. 두번 이상은 에러 뜹니다.
    .setEvent((req, res, next) => {
        // get 방식에는 req.params, req.query 를 사용할 수 있다.
        console.log(`${'========= Params Data ========='.magenta}`)
        console.log(req.params)
        console.log('==============================='.magenta)
        next()
    })
    .setEvent((req, res, next) => {
        console.log(`${'========= Query Data ========='.magenta}`)
        console.log(req.query)
        console.log('=============================='.magenta)
        next()
    })
    .setEvent((req, res, next) => {
        next()
    })
    .setEvent((req, res) => {
        res.send(JSON.stringify({
            success : true,
            message : '전송완료'
        }))
    })

// example1 을 예시로 브라우저에서 http://localhost:8000/api/example1/10/adsad?title=hello&pid=test 요청할 경우
// :id = 10
// :name = adsad
// ?title = hello
// ?pid = test

// 결과
// req.params => {id : 10, name : adsad}
// req.query => {title : 'hello', pid : 'test'}


// 4. req.body
const example2 = new Router();

example2
    .setKey('example2')
    .setComment('Post 방식으로 body 값 전송에 대한 예시')
    .setMethod('post')
    // http://localhost:8000/api/example2
    .setUrl('/api/example2')
    // Post 같은 경우는 클라이언트가 데이터를 비밀스럽게 전송 (주로 데이터생성 때 사용)
    .setEvent((req, res, next) => {
        const {title, desc, notData} = req.body
        console.log(`${'========= Body Data ========='.magenta}`)
        console.log(req.body)
        console.log(`title : ${title}`.green)
        console.log(`desc : ${desc}`.blue)
        // body Json에 안들어와 있어서 undefined 값
        console.log(`notData : ${notData}`.red)
        console.log('=============================='.magenta)
        // 오늘 날짜 req에 담기
        req['today'] = dayjs().format('YYYY-MM-DD HH:mm:SS')
        next()
    })
    .setEvent((req, res) => {
        // next 함수는 req에 저장된 값을 그대로 가지고 다음 함수를 실행합니다.
        console.log(`${'========= NEXT ========='.magenta}`)
        console.log(req['today'])
        console.log('=============================='.magenta)
        res.send(JSON.stringify({
            success : true,
            message : '전송완료'
        }))
    })

// example2 기반으로 http://localhost:8000/api/example2 에 {title :"title", desc : "desc"} 같이 보낼 경우
// req.body 값에 들어온다. title, desc 값이

// 다른 스크립트에서 사용할 수 있도록 설정
const exampleArray = [example1, example2]

export {
    exampleArray
}
