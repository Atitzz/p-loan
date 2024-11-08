import { Button, Dialog, DialogContent, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useState } from 'react'
const startDate = new Date();
const endDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
endDate.setDate(endDate.getDate() +1);
function SearchDate({open,onClose,onSubmit}) {
    const [input,setInput] = useState({
        start:startDate.toISOString().split('T')[0],
        end:endDate.toISOString().split('T')[0]
    })

    const onChange = (e) =>{
        const {name, value} = e.target
        setInput({...input, [name]: value})
    }
    const handleOnSubmit = () => {
        onSubmit(input);
        onClose();
    }
  return (
    <Dialog open={open} onClose={onClose}>
    <DialogContent>
        <Stack gap={2}>
        <Stack direction='row' gap={4}>
        <DatePicker
  label="เริ่ม"
  value={dayjs(input.start)}
  format='DD/MM/YYYY'
  onChange={(newValue) => onChange({target:{name:'start',value:newValue.add(1,'days').toISOString().split('T')[0]}})}
/>
<DatePicker
  label="สิ้นสุด"
  value={dayjs(input.end)}
   format='DD/MM/YYYY'
  onChange={(newValue) => onChange({target:{name:'end',value:newValue.add(1,'days').toISOString().split('T')[0]}})}
/>
        </Stack>
        <Button variant='contained' onClick={handleOnSubmit}>ค้นหา</Button>
        </Stack>
        </DialogContent>
    </Dialog>
  )
}

export default SearchDate
