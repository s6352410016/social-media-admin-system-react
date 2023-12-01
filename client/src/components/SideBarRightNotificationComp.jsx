import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import '../css/sideBarRightNotificationComp/sideBarRightNotificationComp.css';

const SideBarRightNotificationComp = () => {
  const [notificationData, setNotificationData] = useState([{}]);
  const [findNotification, setFindNotification] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let runNumber = 1;

  const getAllNotifications = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllNotifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const notifications = await res.json();
      const sortedNotification = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setIsLoading(false);
      setNotificationData(sortedNotification);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const handleFindNotification = () => {
    const dataByReplyId = notificationData.filter((noti) => noti?.notificationOfReplyId.toLowerCase().includes(findNotification.trim().toLowerCase()));
    const dataByPostId = notificationData.filter((noti) => noti?.notificationOfPostId.toLowerCase().includes(findNotification.trim().toLowerCase()));
    const dataByCommentId = notificationData.filter((noti) => noti?.notificationOfCommentId.toLowerCase().includes(findNotification.trim().toLowerCase()));
    const dataByUserId = notificationData.filter((noti) => noti?.notificationOfUserId.toLowerCase().includes(findNotification.trim().toLowerCase()));
    const dataByNotificationId = notificationData.filter((noti) => noti?._id.toLowerCase().includes(findNotification.trim().toLowerCase()));
    const dataByUserIdRead = notificationData.filter((noti) => noti?.read?.includes(findNotification.trim().toLowerCase()));
    const dataByReceiverId = notificationData.filter((noti) => noti?.notificationOfReceiverId?.includes(findNotification.trim().toLowerCase()));
    
    let combindPostArr = [];

    if (dataByReplyId.length !== 0) {
      combindPostArr.push(...dataByReplyId);
    }
    if (dataByPostId.length !== 0) {
      combindPostArr.push(...dataByPostId);
    }
    if (dataByCommentId.length !== 0) {
      combindPostArr.push(...dataByCommentId);
    }
    if (dataByUserId.length !== 0) {
      combindPostArr.push(...dataByUserId);
    }
    if (dataByNotificationId.length !== 0) {
      combindPostArr.push(...dataByNotificationId);
    }
    if (dataByUserIdRead.length !== 0 && dataByReceiverId.length !== 0) {
      return combindPostArr.push(...dataByUserIdRead);
    }
    if (dataByUserIdRead.length !== 0) {
      return combindPostArr.push(...dataByUserIdRead);
    }
    if (dataByReceiverId.length !== 0) {
      return combindPostArr.push(...dataByReceiverId);
    }

    setNotificationData(combindPostArr);
  }

  const handleFindNotificationOnChange = (e) => {
    setFindNotification(e.target.value);
  }

  const handleBlockNotification = async (notiId, notiStatus) => {
    try {
      if (notiStatus) {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการยกเลิกบล็อคไหม?",
          text: "ถ้ายกเลิกบล็อคการแจ้งเตือนดังกล่าวจะถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              notiId
            })
          });
          Swal.fire({
            title: "ยกเลิกบล็อคสำเร็จ!",
            text: "แจ้งเตือนนี้แสดงบนเว็ปไซต์ตามปกติ",
            icon: "success"
          });
        }
      } else {
        const { isConfirmed } = await Swal.fire({
          title: "คุณต้องการบล็อคไหม?",
          text: "ถ้าบล็อคการแจ้งเตือนดังกล่าวจะไม่ถูกแสดงบนเว็ปไซต์",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0d6efd",
          cancelButtonColor: "#d33",
          confirmButtonText: "ตกลง",
          cancelButtonText: "ยกเลิก"
        });

        if (isConfirmed) {
          await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              notiId
            })
          });
          Swal.fire({
            title: "บล็อคสำเร็จ!",
            text: "แจ้งเตือนนี้ไม่ถูกแสดงบนเว็ปไซต์",
            icon: "success"
          });
        }
      }

      getAllNotifications();
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllNotifications();
  }, []);

  useEffect(() => {
    if (!findNotification.trim()) {
      setDisableBtn(true);
      getAllNotifications();
    } else {
      setDisableBtn(false);
    }
  }, [findNotification]);

  return (
    <div className='conainer-sidebar-right-notification-comp'>
      <div className="second-container-sidebar-right-notification-comp">
        <h2>แสดงข้อมูลการแจ้งเตือนทั้งหมด</h2>
        <InputGroup className="mb-3">
          <Form.Control style={{ maxWidth: "720px", boxShadow: "none" }} className='focus-ring focus-ring-light'
            placeholder="ไอดีแจ้งเตือน / ไอดีผู้ใช้ / ไอดีโพสต์ / ไอดีคอมเมนท์ / ไอดีตอบกลับ / ไอดีผู้อ่าน / ไอดีผู้รับแจ้งเตือน"
            onChange={(e) => handleFindNotificationOnChange(e)}
          />
          <Button variant="primary" onClick={handleFindNotification} disabled={disableBtn}>
            ค้นหา
          </Button>
        </InputGroup>
        <div className="container-showall-notifications">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th className='text-center'>ลำดับ</th>
                <th className='text-center'>ไอดีแจ้งเตือน</th>
                <th className='text-center'>ไอดีผู้ใช้</th>
                <th className='text-center'>ไอดีโพสต์</th>
                <th className='text-center'>ไอดีคอมเมนท์</th>
                <th className='text-center'>ไอดีตอบกลับ</th>
                <th className='text-center'>รายละเอียด</th>
                <th className='text-center'>ไอดีผู้อ่าน</th>
                <th className='text-center'>ไอดีผู้รับแจ้งเตือน</th>
                <th className='text-center'>บล็อค</th>
                <th className='text-center'>บันทึกล่าสุด</th>
                <th className='text-center'>แก้ไขล่าสุด</th>
                <th className='text-center'>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || notificationData.length === 0
                ?
                <tr>
                  <td colSpan={13} className='text-center'>ไม่พบข้อมูลการแจ้งเตือน</td>
                </tr>
                :
                notificationData.map((noti, index) => (
                  <tr key={index}>
                    <td className='text-center'>{runNumber++}</td>
                    <td className='text-center'>{noti?._id}</td>
                    <td className='text-center'>{noti?.notificationOfUserId === "" ? "ไม่มีข้อมูล" : noti?.notificationOfUserId}</td>
                    <td className='text-center'>{noti?.notificationOfPostId === "" ? "ไม่มีข้อมูล" : noti?.notificationOfPostId}</td>
                    <td className='text-center'>{noti?.notificationOfCommentId === "" ? "ไม่มีข้อมูล" : noti?.notificationOfCommentId}</td>
                    <td className='text-center'>{noti?.notificationOfReplyId === "" ? "ไม่มีข้อมูล" : noti?.notificationOfReplyId}</td>
                    <td className='text-center'>{noti?.notificationDetail}</td>
                    <td className='text-center'>
                      <div className='d-flex flex-column gap-2'>
                        {noti?.read?.length === 0
                          ?
                          <span>ไม่มีข้อมูล</span>
                          :
                          noti?.read?.map((userId, index) => (
                            <span key={index}>{userId}</span>
                          ))
                        }
                      </div>
                    </td>
                    <td className='text-center'>
                      <div className='d-flex flex-column gap-2'>
                        {noti?.notificationOfReceiverId?.length === 0
                          ?
                          <span>ไม่มีข้อมูล</span>
                          :
                          noti?.notificationOfReceiverId?.map((userId, index) => (
                            <span key={index}>{userId}</span>
                          ))
                        }
                      </div>
                    </td>
                    <td className='text-center'>{noti?.isBlock ? "บล็อค" : "ปกติ"}</td>
                    <td className='text-center'>{noti?.createdAt !== "" && new Date(noti?.createdAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>{noti?.updatedAt !== "" && new Date(noti?.updatedAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {noti?._id && <Button onClick={() => handleBlockNotification(noti?._id, noti?.isBlock)} variant={noti?.isBlock ? "warning" : "danger"} >{noti?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default SideBarRightNotificationComp;