import { Button, Dialog, InputLabel, Stack } from '@mui/material'

function ConfirmDialog({open,onClose,onSubmit,text}:any) {
    const handleSubmit = () =>{
        onSubmit()
        onClose()
    }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Stack spacing={2} sx={{p:4}}>
        <InputLabel sx={{textAlign:"center"}}>{!text ? 'Please Confirm!' : text}</InputLabel>
        <Stack direction="row" spacing={2}>
        <Button fullWidth variant='outlined' onClick={handleSubmit}>ยืนยัน</Button>
        <Button fullWidth variant='contained' color='error' onClick={onClose}>ยกเลิก</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default ConfirmDialog
