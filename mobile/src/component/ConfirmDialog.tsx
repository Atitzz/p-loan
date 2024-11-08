import { Button, Dialog, InputLabel, Stack } from '@mui/material'

function ConfirmDialog({open,onClose,onSubmit}:any) {
    const handleSubmit = () =>{
        onSubmit()
        onClose()
    }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Stack spacing={2} sx={{p:4}}>
        <InputLabel sx={{textAlign:"center"}}>Please Confirm!</InputLabel>
        <Stack direction="row" spacing={2}>
        <Button fullWidth variant='outlined' onClick={handleSubmit}>Confirm</Button>
        <Button fullWidth variant='contained' color='error' onClick={onClose}>Cancel</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default ConfirmDialog
