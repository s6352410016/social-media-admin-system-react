import React, { useEffect, useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { SiGoogledocs } from "react-icons/si";
import { FaCommentDots, FaReply } from "react-icons/fa";
import { IoNotifications, IoChatbubbles } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import '../css/sideBarLeftDashboardComp/sideBarLeftDashboardComp.css';
import { Link, useLocation } from 'react-router-dom';

const SideBarLeftDashboardLayout = ({ firstname, lastname }) => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    return window.location.href = "/";
  }

  const setPath = () => {
    const locationToActive = location.pathname === "/dashboard" ? "Dashboard" : location.pathname === "/dashboard/user" ? "User" : location.pathname === "/dashboard/post" ? "Post" : location.pathname === "/dashboard/comment" ? "Comment" : location.pathname === "/dashboard/reply" ? "Reply" : location.pathname === "/dashboard/notification" ? "Notification" : location.pathname === "/dashboard/chat" ? "Chat" : "Message";
    setSelectedItem(locationToActive);
  }

  useEffect(() => {
    setPath();
  }, []);

  return (
    <>
      <div className='container-sidebar-left'>
        <div style={{ marginTop: "10px", cursor: "default" }} className='admin-dashboard'>
          <span style={{ fontWeight: 600 }}>Admin: {firstname} {lastname}</span>
        </div>
        <Link to='/dashboard' className={`admin-dashboard ${selectedItem === "Dashboard" ? "active" : ""}`} onClick={() => setSelectedItem("Dashboard")}>
          <MdDashboard size={20} color='#ECECEC' />
          <span>Dashboard</span>
        </Link>
        <Link to='/dashboard/user' className={`admin-dashboard ${selectedItem === "User" ? "active" : ""}`} onClick={() => setSelectedItem("User")}>
          <FaUser size={20} color='#ECECEC' />
          <span>User</span>
        </Link>
        <Link to='/dashboard/post' className={`admin-dashboard ${selectedItem === "Post" ? "active" : ""}`} onClick={() => setSelectedItem("Post")}>
          <SiGoogledocs size={20} color='#ECECEC' />
          <span>Post</span>
        </Link>
        <Link to='/dashboard/comment' className={`admin-dashboard ${selectedItem === "Comment" ? "active" : ""}`} onClick={() => setSelectedItem("Comment")}>
          <FaCommentDots size={20} color='#ECECEC' />
          <span>Comment</span>
        </Link>
        <Link to='/dashboard/reply' className={`admin-dashboard ${selectedItem === "Reply" ? "active" : ""}`} onClick={() => setSelectedItem("Reply")}>
          <FaReply size={20} color='#ECECEC' />
          <span>Reply</span>
        </Link>
        {/* <Link to='/dashboard/tag' className={`admin-dashboard ${selectedItem === "Tag" ? "active" : ""}`} onClick={() => setSelectedItem("Tag")}>
          <FaReplyAll size={20} color='#ECECEC' />
          <span>Tag</span>
        </Link> */}
        <Link to='/dashboard/notification' className={`admin-dashboard ${selectedItem === "Notification" ? "active" : ""}`} onClick={() => setSelectedItem("Notification")}>
          <IoNotifications size={20} color='#ECECEC' />
          <span>Notification</span>
        </Link>
        <Link to='/dashboard/chat' className={`admin-dashboard ${selectedItem === "Chat" ? "active" : ""}`} onClick={() => setSelectedItem("Chat")}>
          <FaUserGroup size={20} color='#ECECEC' />
          <span>Chat</span>
        </Link>
        <Link to='/dashboard/message' className={`admin-dashboard ${selectedItem === "Message" ? "active" : ""}`} onClick={() => setSelectedItem("Message")}>
          <IoChatbubbles size={20} color='#ECECEC' />
          <span>Message</span>
        </Link>
        <div onClick={logout} className="admin-dashboard">
          <RiLogoutBoxLine size={20} color='#ECECEC' />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
}

export default SideBarLeftDashboardLayout;