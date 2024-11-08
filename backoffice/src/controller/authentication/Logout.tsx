import { useContext, useEffect } from 'react'
import { HttpContext, MainContext, ToolsContext } from '@/context/Context';

function Logout() {
    const {  setAuth,AddAlert } = useContext(MainContext);
    const {Get,ErrorResponse,MessageResponse} = useContext(HttpContext);

    useEffect(()=>{
      Get(`logout`).then((response) =>{
        setAuth(response.data.data);
        MessageResponse(response);
      }).catch(err => AddAlert(ErrorResponse(err),'error'));
    },[])
  return (
    <div>
      
    </div>
  )
}

export default Logout
