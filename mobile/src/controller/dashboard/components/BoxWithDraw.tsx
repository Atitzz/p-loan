import { Box, Paper, Stack } from "@mui/material";
import * as Icons from "@mui/icons-material";
function BoxWithDraw() {
  return (
    <Stack component={Paper} sx={{ p: 4, flex: 1 }}>
    <Box
      component="span"
      sx={{ fontSize: 14, fontWeight: "bold", color: "#00000095" }}
    >
      Withdrawals
    </Box>
    <Stack
      direction="row"
      gap={0}
      flexWrap="wrap"
    >
      <Stack
        sx={{
          p: 3,
          flex: 1,
          minWidth: 200,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack
            sx={{
              p: 3,
              bgcolor: "#28c76f25",
              borderRadius: 1,
            }}
          >
            <Icons.CreditCard sx={{ color: "#28c76f" }} />
          </Stack>
          <Stack spacing={1}>
            <Box
              component="span"
              sx={{ fontSize: 12, fontWeight: "bold" }}
            >
              $185,694.00
            </Box>
            <Box component="span" sx={{ fontSize: 12 }}>
              Total Withdrawn
            </Box>
          </Stack>
        </Stack>

        <Stack>
          <Icons.ArrowForwardIos sx={{ fontSize: 12 }} />
        </Stack>
      </Stack>
      <Stack
        sx={{
          p: 3,
          flex: 1,
          minWidth: 200,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack
            sx={{
              p: 3,
              bgcolor: "#ff9f4325",
              borderRadius: 1,
            }}
          >
            <Icons.RotateRight sx={{ color: "#ff9f43" }} />
          </Stack>
          <Stack spacing={2}>
            <Box
              component="span"
              sx={{ fontSize: 12, fontWeight: "bold" }}
            >
              66
            </Box>

            <Box component="span" sx={{ fontSize: 12 }}>
              Pending Withdrawals
            </Box>
          </Stack>
        </Stack>
        <Stack>
          <Icons.ArrowForwardIos sx={{ fontSize: 12 }} />
        </Stack>
      </Stack>
     
    </Stack>
    <Stack
      direction="row"
      gap={0}
      flexWrap="wrap"
    >
         <Stack
        sx={{
          p: 3,
          flex: 1,
          minWidth: 200,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack
            sx={{
              p: 3,
              bgcolor: "#eb222225",
              borderRadius: 1,
            }}
          >
            <Icons.DoDisturb sx={{ color: "#eb2222" }} />
          </Stack>
          <Stack spacing={2}>
            <Box
              component="span"
              sx={{ fontSize: 12, fontWeight: "bold" }}
            >
              0
            </Box>
            <Box component="span" sx={{ fontSize: 12 }}>
              Rejected Withdrawals
            </Box>
          </Stack>
        </Stack>
        <Stack>
          <Icons.ArrowForwardIos sx={{ fontSize: 12 }} />
        </Stack>
      </Stack>
      <Stack
        sx={{
          p: 3,
          flex: 1,
          minWidth: 200,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Stack
            sx={{
              p: 3,
              bgcolor: "#4634ff25",
              borderRadius: 1,
            }}
          >
            <Icons.Percent sx={{ color: "#4634ff" }} />
          </Stack>
          <Stack spacing={2}>
            <Box
              component="span"
              sx={{ fontSize: 12, fontWeight: "bold" }}
            >
              $1920.25
            </Box>
            <Box component="span" sx={{ fontSize: 12 }}>
              Withdrawals Change
            </Box>
          </Stack>
        </Stack>
        <Stack>
          <Icons.ArrowForwardIos sx={{ fontSize: 12 }} />
        </Stack>
      </Stack>
      </Stack>  
  </Stack>
  )
}

export default BoxWithDraw
