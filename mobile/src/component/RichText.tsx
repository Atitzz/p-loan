import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function RichText() {
    const [value, setValue] = useState('');

    return (
      <Stack sx={{flex:1}}>
        <ReactQuill value={value} onChange={setValue} />
      </Stack>
    );
}

export default RichText
