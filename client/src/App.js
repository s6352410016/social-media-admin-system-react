import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SideBarRightUserComp from './components/SideBarRightUserComp';
import SideBarRightPostComp from './components/SideBarRightPostComp';
import SideBarRightCommentComp from './components/SideBarRightCommentComp';
import SideBarRightReplyComp from './components/SideBarRightReplyComp';
// import SideBarRightTagComp from './components/SideBarRightTagComp';
import SideBarRightNotificationComp from './components/SideBarRightNotificationComp';
import SideBarRightChatComp from './components/SideBarRightChatComp';
import SideBarRightMessageComp from './components/SideBarRightMessageComp';
import './css/style.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<AdminLoginPage />}></Route>
        <Route path='dashboard' element={<AdminDashboardPage />}>
          <Route path='user' element={<SideBarRightUserComp />}></Route>
          <Route path='post' element={<SideBarRightPostComp />}></Route>
          <Route path='comment' element={<SideBarRightCommentComp />}></Route>
          <Route path='reply' element={<SideBarRightReplyComp />}></Route>
          {/* <Route path='tag' element={<SideBarRightTagComp />}></Route> */}
          <Route path='notification' element={<SideBarRightNotificationComp />}></Route>
          <Route path='chat' element={<SideBarRightChatComp />}></Route>
          <Route path='message' element={<SideBarRightMessageComp />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
