import { MainContext } from "@/context/Context";
import  { useContext, useEffect } from 'react'

function ComingSoon() {
    const { AddAlert }: any = useContext(MainContext);
    useEffect(()=>{
        AddAlert("Coming Soon!");
    },[])
  return (
    <div>
      
    </div>
  )
}

export default ComingSoon
