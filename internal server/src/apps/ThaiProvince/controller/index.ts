
import axios from "axios";
const baseUrl = 'https://raw.githubusercontent.com/kongvut/thai-province-data/master'
export const province = async (req,res) =>{
    const response = await axios.get(`${baseUrl}/api_province.json`)
    return  res.success('success',response.data)
}

export const district = async (req,res) =>{
    const { pid } = req.query;
    const response = await axios.get(`${baseUrl}/api_amphure.json`)
    let data =  response.data
    if(pid)
        data = data.filter(d=>d.province_id == pid);
    return  res.success('success',data)
}

export const subdistrict = async (req,res) =>{
    const { pid } = req.query;
    const response = await axios.get(`${baseUrl}/api_tambon.json`)
    let data =  response.data
    if(pid)
        data = data.filter(d=>d.amphure_id == pid);
    return  res.success('success',data)
}