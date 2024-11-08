import { Stack } from '@mui/material';
import React from 'react'
const isAndroid = () => {
    return /Linux/i.test(navigator.userAgent);
  };
  const isIPhone = () => {
    return /iPhone/i.test(navigator.userAgent);
  };
  const isWindow = () => {
    return /Windows/i.test(navigator.userAgent);
  };
function Test2() {
  return (
    <Stack >
  <span>{navigator.userAgent}</span>
  {isAndroid() && 'isAndroid'}
      {isIPhone() && 'isIPhone'}
      {isWindow() && 'isWindow'}
</Stack>
  )
}

export default Test2
