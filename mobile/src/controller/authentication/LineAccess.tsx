import { HttpContext, MainContext } from '@/context/Context';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function LineAccess() {
  const { Get, ErrorResponse, MessageResponse } = useContext(HttpContext);
    const {token} = useParams();
    const {  setAuth }:any = useContext(MainContext);
    const navigate = useNavigate();
    useEffect(()=>{
      localStorage.setItem('accessToken', token);
      Get(`current`).then((response) =>{
        setAuth({status:true,...response.data.data});
        navigate("/");
      }).catch(err => {
          navigate("/");
        console.log(ErrorResponse(err),'error');
      })
    },[token])
  return (
    <div>
      Please Wait
    </div>
  )
}

export default LineAccess
