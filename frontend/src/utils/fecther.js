import axios from "axios";

axios.defaults.baseURL = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`
axios.defaults.timeout = 3000;
/**
 * 서버와 HTTP 통신을 요청하는 함수
 * @param method {'get' | 'post' | 'put'| 'patch' | 'delete'}
 * @param url {string} URL 주소
 * @param rest
 * @return {Promise<*>}
 */
const fecther = async (method, url, ...rest) => {
    const res = await axios[method](url, ...rest)
    return res.data
}

export {
    fecther
}