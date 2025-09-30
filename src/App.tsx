import { Navigate, Route, Routes } from "react-router";
import Default from "./layouts/Default";
import LoginSocial from "./pages/auth/LoginSocial";
import BlogList from "./pages/blog/BlogList";
import BlogDetail from "./pages/blog/BlogDetail";
import Profile from "./pages/profile/Profile";
import BlogCreate from "./pages/blog/BlogCreate";
import ProfileSetup from "./pages/auth/ProfileSetup";
import { useEffect, useState } from 'react' // ✨ useState를 추가했습니다.
import supabase from './utils/supabase'

export default function App() {
  const [todos, setTodos] = useState([]); // todos 상태를 추가했습니다.

  useEffect(() => {
    // ✨ getTodos 함수를 'async'로 선언
    async function getTodos() {
      // 💡 에러 처리도 함께 하는 것이 좋습니다.
      const { data: todos} = await supabase.from('todos').select();
      console.log(todos);

    }

    getTodos();
    
    // todos를 사용하지 않더라도, 의존성 배열은 비워두어 최초 1회만 실행되게 합니다.
  }, []); 

  // 🚨 참고: 현재 이 컴포넌트에서는 todos 상태를 렌더링에 사용하고 있지 않습니다.
  // 이 로직이 단순히 인증 또는 전역 상태 초기화를 위한 것이라면 이대로 두셔도 됩니다.

  return (
    <>
      <Routes>
        <Route element={<Default />}>
          <Route index element={<Navigate to="/blog" />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/create" element={<BlogCreate />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="login" element={<LoginSocial />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile-setup" element={<ProfileSetup />} />
        </Route>
      </Routes>
    </>
  );
}