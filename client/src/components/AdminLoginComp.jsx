import React, { useState, useEffect , useRef } from 'react';
import { FaUserTie } from "react-icons/fa6";
import { PiLockKeyFill } from "react-icons/pi";
import { HiMiniKey } from "react-icons/hi2";
import '../css/adminCompCss/adminComp.css'
import toast, { Toaster } from 'react-hot-toast';

const AdminLoginComp = () => {
    const cbRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {
        try {
            e.preventDefault();

            if (!username || !password) {
                return toast.error("credential is not empty.");
            }

            const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/adminLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usernameOrEmail: username,
                    password
                })
            });
            const { token } = await res.json();

            if (res.status === 401) {
                return toast.error("Invalid credential.");
            }

            if(cbRef.current.checked){
                localStorage.setItem("username" , username);
                localStorage.setItem("password" , password);
            }else{
                localStorage.removeItem("username");
                localStorage.removeItem("password");

                setUsername("");
                setPassword("");
            }

            localStorage.setItem("token" , token);
            window.location.href = "/dashboard";
        } catch (err) {
            console.log(`error: ${err}`);
        }
    }

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
        setPassword(localStorage.getItem("password"));
    } , []);

    return (
        <div className='container-admin-login-comp'>
            <Toaster />
            <div className='login-header'>
                <HiMiniKey size={30} color='#ECECEC' />
                <h1>เข้าสู่ระบบ: Admin</h1>
            </div>
            <form onSubmit={submitHandler} className='form-login-admin-comp'>
                <div className='login-body'>
                    <div className='login-icon'>
                        <FaUserTie className='login-icons' size={20} color='#ECECEC' />
                    </div>
                    <input value={username} type="text" placeholder='บัญชีผู้ใช้ / อีเมล' onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='login-body'>
                    <div className='login-icon'>
                        <PiLockKeyFill className='login-icons' size={20} color='#ECECEC' />
                    </div>
                    <input value={password} type="password" placeholder='รหัสผ่าน' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='login-remember'>
                    <input ref={cbRef} type="checkbox" className='checkbox-style' defaultChecked/>
                    <span>จดจำบัญชีผู้ใช้?</span>
                </div>
                <button className='login-btn' type="submit">
                    เข้าสู่ระบบ
                </button>
            </form>
        </div>
    );
}

export default AdminLoginComp;