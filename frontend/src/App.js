import { Routes, Route } from 'react-router-dom';
import {ExampleHome} from "./pages/Example";

function App() {
    return (
        <>
            <Routes>
                <Route path={'/test'} element={<ExampleHome/>}/>
                {/*<Route path={'/home'} element={<Home/>}/>*/}
                {/*<Route path={'/display'} element={<Display/>}/>*/}
                {/*<Route path={'/setting'} element={<Setting/>}/>*/}
                {/*<Route path={'/setting/user'} element={<LoginSetting/>}/>*/}
                {/*<Route path={"/setting/pole"} element={<LampSetting/>}/>*/}
                {/*<Route path={"/setting/pole/schedule/:id"} element={<LampScheduleControl/>}/>*/}
                {/*<Route path={"/setting/pole/voltage/:id"} element={<LampVoltageControl/>}/>*/}
                {/*<Route path={"/setting/model"} element={<ModelSetting/>}/>*/}
                {/*<Route path={"/setting/group"} element={<GroupSetting/>}/>*/}
                {/*<Route path={"/setting/schedule"} element={<ScheduleSetting/>}/>*/}
                {/*<Route path={'/log'} element={<Log/>}/>*/}
                {/*<Route path={'*'} element={<Error404/>}/>*/}
            </Routes>
        </>


    );
}

export default App;
