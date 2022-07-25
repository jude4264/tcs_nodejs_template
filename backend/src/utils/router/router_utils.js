//###################################################
// 제작 : HJ
// 라우터 관리 함수
// URL 관리하는 함수라고 생각하면 된다.
// 사용법
//###################################################
// import color from 'colors';

class Router
{
    /**
     * 라우터 생성
     * @param _debug {boolean} 디버깅 여부
     */
    constructor(_debug = false) {
        // 키
        this.key = ''

        // 주석
        this.comment = ''

        // URL
        this.url = ''

        // 디버깅 여부
        this.debuging = _debug

        // 요청 메서드
        this.method = 'get'

        // 이벤트 목록
        this.events = []
    }

    /**
     * 라우터 구분짓기 위해 만든 키
     * 키가 중복되면 라우터가 덮어진다.
     * @param _key {string}
     * @return {Router}
     */
    setKey(_key)
    {
        this.key = _key
        return this
    }

    /**
     * 이 라우터가 무엇을 의미하는지 주석을 적는 함수
     * @param _comment {string}
     * @return {Router}
     */
    setComment(_comment)
    {
        this.comment = _comment
        return this
    }

    /**
     * HTTP 메서드 방식 설정
     * get -> params, query 로 리소스를 읽는 요청
     * post -> body 값으로 리소스를 새로 생성
     * put -> body 값으로 리소스 새로 업데이트
     * patch -> body 값으로 리소스 부분 업데이트
     * delete -> 리소스 제거
     * @param _http {'get' | 'post' | 'put' | 'patch' | 'delete'}
     * @return {Router}
     */
    setMethod(_http)
    {
        this.method = _http
        return this
    }

    /**
     * URL 등록
     * @param _url {string}
     * @return {Router}
     */
    setUrl(_url)
    {
        this.url = _url
        return this
    }
    /**
     * 이벤트를 등록합니다.
     * 등록하는 방법은 아래와 같습니다.
     * req -> 요청
     * res -> 응답
     * next -> 다음 이벤트 진횅
     * setEvent((req, res, next) => {
     *     함수로직
     * })
     * @param _event {function (Request, Response, NextFunction)}
     * @return {Router}
     */
    setEvent(_event)
    {
        this.events.push(_event)
        return this
    }


    get Key(){return this.key}
    get Url(){return this.url}
    get Method(){return this.method}
    get Comment(){return this.comment}
    get Events(){return this.events}
}


const RouterManager = (function (){
    // 라우터 맵
    const routerMap = new Map()

    return {
        /**
         * 라우터를 등록합니다.
         * @param routerData {Router}
         * @return {boolean} 성공시 true, 실패시 false
         */
        addRouter : (routerData) => {
            if(typeof routerData['key'] === 'undefined' || routerData['key'] === '')
            {
                console.error('Key값이 없습니다. \nRouter 등록 실패'.red)
                return false
            }

            if(routerData['url'] === '')
            {
                console.error('URL이 없습니다. \nRouter 등록 실패'.red)
                return false
            }

            // 등록
            routerMap.set(routerData['key'], routerData)
            return true
        },

        /**
         * 라우터 연속으로 등록합니다.
         * @param routerDataArr {Array<Router>} 배열형태의 라우터 입니다.
         * @return {boolean}
         */
        addArrayRouter : (routerDataArr) => {
            let fail = 0
            if(!Array.isArray(routerDataArr))
            {
                console.error('값이 배열이 아닙니다. \nRouter 연속 등록 실패'.red)
                return false
            }

            for(let i = 0; i < routerDataArr.length; i++)
            {
                if(typeof routerDataArr[i]['key'] === 'undefined' || routerDataArr[i]['key'] === '')
                {
                    ++fail;
                    continue
                }
                if(routerDataArr[i]['url'] === '')
                {
                    ++fail;
                    continue
                }

                // 등록
                routerMap.set(routerDataArr[i]['key'], routerDataArr[i])
            }

            if(fail > 0)
            {
                console.error(`${fail}개의 라우터 등록에 실패했습니다.`.red)
            }
            return true
        },
        /**
         * 라우터 맵을 반환합니다.
         * @return {Map<any, any>}
         */
        getRouter : () => {
            return routerMap
        }
    }


})()


export {
    Router,
    RouterManager
}