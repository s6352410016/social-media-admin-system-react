import React, { useEffect, useState, useRef } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { useOutletContext } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import '../css/sideBarRightUserComp/sideBarRightUserComp.css';

const SideBarRightUserComp = () => {
  const userRole = useRef(null);
  const adminRole = useRef(null);
  const userId = useOutletContext();
  const [userData, setUserData] = useState([{}]);
  const [findUser, setFindUser] = useState("");
  const [show, setShow] = useState(false);
  const [userDataInEditModal, setUserDataInEditModal] = useState({});
  const [editEmailModel, setEditEmailModel] = useState("");
  const [editPasswordModal, setEditPasswordModal] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);
  const [isLoading , setIsLoading] = useState(true);

  let runNumber = 1;

  const getAllUserData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/getAllUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const users = await res.json();
      const sortedUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setIsLoading(false);
      setUserData(sortedUsers);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  const showDialogConfirmBlock = async (userId, status) => {
    if (status) {
      const { isConfirmed } = await Swal.fire({
        title: "คุณต้องการยกเลิกบล็อคไหม?",
        text: "ถ้ายกเลิกบล็อคผู้ใช้จะสามารถเข้าใช้งานเว็ปไซต์ของคุณได้",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก"
      });

      if (isConfirmed) {
        await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId
          })
        });
        Swal.fire({
          title: "ยกเลิกบล็อคสำเร็จ!",
          text: "ผู้ใช้นี้สามารถเข้าใช้งานเว็ปไซต์ได้",
          icon: "success"
        });
      }
    } else {
      const { isConfirmed } = await Swal.fire({
        title: "คุณต้องการบล็อคไหม?",
        text: "ถ้าบล็อคผู้ใช้จะไม่สามารถเข้าใช้งานเว็ปไซต์ของคุณได้อีก",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก"
      });

      if (isConfirmed) {
        await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/blockUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId
          })
        });
        Swal.fire({
          title: "บล็อคสำเร็จ!",
          text: "ผู้ใช้นี้ไม่สามารถเข้าใช้งานเว็ปไซต์ได้อีก",
          icon: "success"
        });
      }
    }

    getAllUserData();
  }

  const getUserById = () => {
    const data = userData.filter((user) => user?._id.toLowerCase().includes(findUser.trim().toLowerCase()));
    const dataByUsername = userData.filter((user) => user?.username.toLowerCase().includes(findUser.trim().toLowerCase()));
    const dataByEmail = userData.filter((user) => user?.email.toLowerCase().includes(findUser.trim().toLowerCase()));

    let combindedArr = [];

    if (data.length !== 0) {
      combindedArr.push(...data);
    }
    if (dataByUsername.length !== 0) {
      combindedArr.push(...dataByUsername);
    }
    if (dataByEmail.length !== 0) {
      combindedArr.push(...dataByEmail);
    }

    setUserData(combindedArr);
  }

  const getUserByIdOnChange = (e) => {
    setFindUser(e.target.value);
    // const data = userData.filter((user) => user?._id.toLowerCase().includes(findUser.trim().toLowerCase()));
    // setUserData(data === undefined ? [] : data);
  }

  const handleClose = () => {
    setEditEmailModel("");
    setEditPasswordModal("");
    setShow(false);
  }

  const handleShow = (userId) => {
    setShow(true);
    setUserDataInEditModal(userData.find((user) => user?._id === userId));
    setEditEmailModel(userDataInEditModal.email);
  }

  const handleEditUserData = async () => {
    try {
      if (editEmailModel.trim() !== "" || editPasswordModal.trim() !== "") {
        const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/editUserDataAdmin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: userDataInEditModal._id,
            email: editEmailModel,
            password: editPasswordModal,
            isAdminStatus: userRole.current.checked ? false : true
          })
        });

        if (res.status === 400) {
          return toast.error("email is already exist.");
        }

        const { isConfirmed } = await Swal.fire({
          title: "แก้ไขข้อมูลสำเร็จ",
          text: "สามารถดูข้อมูลของผู้ใช้ได้",
          icon: "success",
          confirmButtonText: "ตกลง"
        });

        setShow(false);
        isConfirmed && getAllUserData();
      }
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  useEffect(() => {
    getAllUserData();
  }, []);

  useEffect(() => {
    if (!findUser.trim()) {
      setDisableBtn(true);
      getAllUserData();
    } else {
      setDisableBtn(false);
    }
  }, [findUser]);

  useEffect(() => {
    setEditEmailModel(userDataInEditModal.email);
  }, [userDataInEditModal]);

  return (
    <div className='container-sidebar-right-user-comp'>
      <Toaster />
      <div className='second-container-sidebar-right-user-comp'>
        <h2>แสดงข้อมูลผู้ใช้งานทั้งหมด</h2>
        <InputGroup className="mb-3">
          <Form.Control onChange={(e) => getUserByIdOnChange(e)} style={{ maxWidth: "300px", boxShadow: "none" }} className='focus-ring focus-ring-light'
            placeholder="ไอดีผู้ใช้ / บัญชีผู้ใช้ / อีเมล"
          />
          <Button onClick={getUserById} variant="primary" disabled={disableBtn}>
            ค้นหา
          </Button>
        </InputGroup>
        <div className="container-showall-users">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th className='text-center'>ลำดับ</th>
                <th className='text-center'>ไอดีผู้ใช้</th>
                <th className='text-center'>รูป</th>
                <th className='text-center'>ชื่อ</th>
                <th className='text-center'>นามสกุล</th>
                <th className='text-center'>บัญชีผู้ใช้</th>
                <th className='text-center'>อีเมล</th>
                <th className='text-center'>วันเกิด</th>
                <th className='text-center'>สถานะ</th>
                <th className='text-center'>บล็อค</th>
                <th className='text-center'>บันทึกล่าสุด</th>
                <th className='text-center'>แก้ไขล่าสุด</th>
                <th className='text-center'>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || userData.length === 0
                ?
                <tr>
                  <td colSpan={13} className='text-center'>ไม่พบข้อมูลผู้ใช้งาน</td>
                </tr>
                :
                userData.map((user) => (
                  //userId !== user._id &&
                  <tr key={runNumber}>
                    <td className='text-center'>{runNumber++}</td>
                    <td className='text-center'>{user?._id}</td>
                    <td className='text-center'>
                      <img style={{ width: "45px", height: "45px", borderRadius: "50%" }} alt='profileImg' src={`${process.env.REACT_APP_SERVER_DOMAIN}/userProfileImg/${!user?.profilePicture ? "profileImgDefault.jpg" : user?.profilePicture}`} />
                    </td>
                    <td className='text-center'>{user?.firstname}</td>
                    <td className='text-center'>{user?.lastname}</td>
                    <td className='text-center'>{user?.username}</td>
                    <td className='text-center'>{user?.email}</td>
                    <td className='text-center'>{user?.dateOfBirth !== "" ? new Date(user?.dateOfBirth).toLocaleDateString("th") : "ไม่มีข้อมูล"}</td>
                    <td className='text-center'>{user?.isAdmin ? "แอดมิน" : "ผู้ใช้"}</td>
                    <td className='text-center'>{user?.isBlock ? "บล็อค" : "ปกติ"}</td>
                    <td className='text-center'>{user?.createdAt !== "" && new Date(user?.createdAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>{user?.updatedAt !== "" && new Date(user?.updatedAt).toLocaleDateString("th")}</td>
                    <td className='text-center'>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        {user?._id && <Button variant='primary' onClick={() => handleShow(user?._id)}>แก้ไข</Button>}
                        {user?._id && <Button variant={user?.isBlock ? "warning" : "danger"} onClick={() => showDialogConfirmBlock(user?._id, user?.isBlock)}>{user?.isBlock ? "ยกเลิก" : "บล็อค"}</Button>}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>แก้ไขข้อมูลผู้ใช้งาน</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>อีเมล:</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    defaultValue={userDataInEditModal.email}
                    onChange={(e) => setEditEmailModel(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>รหัสผ่าน:</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    onChange={(e) => setEditPasswordModal(e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>สถานะผู้ใช้งาน:</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check ref={userRole} name='type' type='radio' label='ผู้ใช้' defaultChecked={userDataInEditModal.isAdmin === false && true} />
                    <Form.Check ref={adminRole} name='type' type='radio' label='แอดมิน' defaultChecked={userDataInEditModal.isAdmin && true} />
                  </div>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button variant="primary" onClick={handleEditUserData}>
                บันทึก
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default SideBarRightUserComp;