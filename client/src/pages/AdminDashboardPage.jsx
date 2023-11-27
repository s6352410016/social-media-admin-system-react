import React, { useEffect, useState } from 'react';
import SideBarLeftDashboardComp from '../components/SideBarLeftDashboardComp';
import SideBarRightDashboardComp from '../components/SideBarRightDashboardComp';
import '../css/adminDashboardPage/adminDashboardPage.css';
import { Outlet, useLocation } from 'react-router-dom';

const AdminDashboardPage = () => {
  const location = useLocation();
  const [adminInfo, setAdminInfo] = useState({});

  const isDashboardPath = location.pathname === '/dashboard';

  const authUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/authUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token")
        }
      });
      const { firstname, lastname, userId } = await res.json();

      if (res.status === 401 || res.status === 403) {
        return window.location.href = "/";
      }

      setAdminInfo({ firstname, lastname, userId });
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    authUser();
  }, []);

  return (
    <div className='container-dashborad-page'>
      <SideBarLeftDashboardComp firstname={adminInfo.firstname} lastname={adminInfo.lastname} />
      {isDashboardPath && <SideBarRightDashboardComp />}
      <Outlet context={adminInfo.userId}/>
    </div>
  );
}

export default AdminDashboardPage;