import styled from "@emotion/styled";
import {css} from "@emotion/react";

// css Style 지정
const testStyle = () => css`
  width: 200px;
  height: 200px;
`

// DIV 태그의 리액트 컴포넌트 생성
// 리액트 컴포넌트는 무조건 앞글자 대문자 와야한다.
const TestContainer = styled.div`
  // css Style 적용
  ${testStyle}
`

// 이 컴포넌트를 다른 자바스크립트에서 사용
// 사용하려면 import {TestContainer} from '이 파일 경로';
export {
    TestContainer
}