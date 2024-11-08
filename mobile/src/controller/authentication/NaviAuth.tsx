import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

function NaviAuth() {
    const navigate = useNavigate();
    useEffect(()=>{navigate('/')},[])
  return (
    <div>
      
    </div>
  )
}

export default NaviAuth
