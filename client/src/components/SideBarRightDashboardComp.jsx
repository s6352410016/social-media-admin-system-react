import React, { useState, useEffect } from 'react';
import { FaUser, FaUserGroup } from "react-icons/fa6";
import { SiGoogledocs } from "react-icons/si";
import { FaCommentDots, FaReply } from "react-icons/fa";
import { IoNotifications, IoChatbubbles } from "react-icons/io5";
import { ClipLoader } from 'react-spinners';
import '../css/sideBarRightDashboardComp/sideBarRightDashboardComp.css';

const SideBarRightDashboardComp = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [userIdLoad, setUserIsLoad] = useState(true);
  const [postIdLoad, setPostIsLoad] = useState(true);
  const [commentIsLoad, setCommentIsLoad] = useState(true);
  const [replyIsLoad, setReplyIsLoad] = useState(true);
  const [notificationIsLoad, setNotificationIsLoad] = useState(true);
  const [chatIsLoad, setChatIsLoad] = useState(true);
  const [messageIsLoad, setMessageIdLoad] = useState(true);

  const getAllUser = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const users = await res.json();
      setUserCount(users.length);
      setUserIsLoad(false);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const getAllPost = async () => {
    try {
      const resPost = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const posts = await resPost.json();

      const resSharePost = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllSharePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const sharePosts = await resSharePost.json();

      const allPosts = [...posts, ...sharePosts];
      setPostCount(allPosts.length);
      setPostIsLoad(false);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const getAllComment = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllComments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const comments = await res.json();
      setCommentCount(comments.length);
      setCommentIsLoad(false);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const getAllReply = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllReplys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const replys = await res.json();
      setReplyCount(replys.length);
      setReplyIsLoad(false);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const getAllNotification = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllNotifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const notifications = await res.json();
      setNotificationCount(notifications.length);
      setNotificationIsLoad(false);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const getAllChat = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllChats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const chats = await res.json();
      setChatCount(chats.length);
      setChatIsLoad(false);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const getAllMessage = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const messages = await res.json();
      setMessageCount(messages.length);
      setMessageIdLoad(false);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllUser();
    getAllPost();
    getAllComment();
    getAllReply();
    getAllNotification();
    getAllChat();
    getAllMessage();
  }, []);

  return (
    <div className='container-sidebar-right-dashboard-comp'>
      <div className='second-container-sidebar-right-dashboard-comp'>
        <h2>ข้อมูลทั้งหมดของแต่ละรายการ</h2>
        <div className='container-main-sidebar-right-body'>
          <div className='container-sidebar-right-body user'>
            {userIdLoad ? <ClipLoader color="#fff" size={30} /> : <p>{userCount}</p>}
            <span><FaUser size={20} color='' /> {userCount > 1 ? "Users" : "User"}</span>
          </div>
          <div className='container-sidebar-right-body post'>
            {postIdLoad ? <ClipLoader color="#fff" size={30} /> : <p>{postCount}</p>}
            <span><SiGoogledocs size={20} color='' /> {postCount > 1 ? "Posts" : "Post"}</span>
          </div>
          <div className='container-sidebar-right-body comment'>
            {commentIsLoad ? <ClipLoader color="#fff" size={30} /> : <p>{commentCount}</p>}
            <span><FaCommentDots size={20} color='' /> {commentCount > 1 ? "Comments" : "Comment"}</span>
          </div>
          <div className='container-sidebar-right-body reply'>
            {replyIsLoad ? <ClipLoader color="#fff" size={30} /> : <p>{replyCount}</p>}
            <span><FaReply size={20} color='' /> {replyCount > 1 ? "Replys" : "Reply"}</span>
          </div>
          <div className='container-sidebar-right-body notification'>
            {notificationIsLoad ? <ClipLoader color="#fff" size={30} /> : <p>{notificationCount}</p>}
            <span><IoNotifications size={20} color='' /> {notificationCount > 1 ? "Notifications" : "Notification"}</span>
          </div>
          <div className='container-sidebar-right-body chat'>
            {chatIsLoad ? <ClipLoader color="#fff" size={30} /> : <p>{chatCount}</p>}
            <span><FaUserGroup size={20} color='' /> {chatCount > 1 ? "Chats" : "Chat"}</span>
          </div>
          <div className='container-sidebar-right-body message'>
            {messageIsLoad ? <ClipLoader color="#fff" size={30} /> : <p>{messageCount}</p>}
            <span><IoChatbubbles size={20} color='' /> {messageCount > 1 ? "Messages" : "Message"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBarRightDashboardComp;