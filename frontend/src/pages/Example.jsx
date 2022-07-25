
// 모든 컴포넌트는 맨앞에 대문자가 와야 한다.


import {useEffect, useState} from "react";
import {fecther} from "../utils/fecther";

// css module file 불러오기 .module 붙여야한다.
import style from './Example.module.css'


const ExampleHome = () => {

    // State형 변수 선언
    // userData로 값 변경 절대 금지
    // userData 값 변경하고 싶으면 setUserData(값) 으로 변경해야 한다.
    const [userData, setUserData] = useState([])

    // 서버에서 데이터 요청
    async function loadUser(){
        const result = await fecther('get', '/api/dbload/select')
        console.log(result.message)
        if(result.message.length <= 0)
        {
            // userData에 빈 배열 삽입
            setUserData([])
        }
        else
        {
            // userData에 디비에서 받아온 값 삽입
            setUserData(result.message)
        }
    }

    useEffect(() => {
        // 이 컴포넌트가 랜더링 되면 실행
        loadUser().catch(err => {
            console.error(err)
        })
    }, [])

    return <>
        {/* 여기선 class 가 아닌 className 써야한다. */}
        <div className={style.container}>
            <table className={style.table}>
                <thead>
                <tr>
                    <th>이름</th>
                    <th>비밀번호</th>
                    <th>토큰</th>
                    <th>이메일</th>
                    <th>생성시간</th>
                </tr>
                </thead>
                <tbody>
                {
                    // UserData 빈 배열이 아닌 경우
                    userData.length > 0 ?
                        userData.map((item, index) => {
                            // 반복문 사용할 시 key 값 필수 안하면 경고창 발생
                            return <tr key={`item_${index}`}>
                                <td>{item._name}</td>
                                <td>{item._pw}</td>
                                <td>{item._token}</td>
                                <td>{item._email}</td>
                                <td>{item._time}</td>
                            </tr>
                        }) :
                        // 빈배열인 경우 빈값 삽입
                        <></>
                }
                </tbody>
            </table>
        </div>

    </>
}

export {
    ExampleHome
}