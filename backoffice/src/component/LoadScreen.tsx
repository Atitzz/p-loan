import { Box, CircularProgress } from '@mui/material'
import React from 'react'

function LoadScreen() {
  return (
    <Box
    sx={{
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      background:
      "linear-gradient(0deg, rgba(31,31,31,1) 0%, rgba(219,174,91,1) 100%)",
    }}
  >
    <svg width={0} height={0}>
      <defs>
        <linearGradient
          id="my_gradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#e01cd5" />
          <stop offset="100%" stopColor="#1CB5E0" />
        </linearGradient>
      </defs>
    </svg>
    <CircularProgress
      sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      size={140}
    />
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#fff",
        fontWeight: 700,
      }}
    >
      กำลังโหลด...
    </Box>
  </Box>
  )
}

export default LoadScreen
