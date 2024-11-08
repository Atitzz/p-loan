import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function LayoutBeforeLogin() {

  return (
    <Stack
     onContextMenu={(e) => e.preventDefault()}
     >
      <Stack component="body">
            <Outlet />
          </Stack>
    </Stack>
  );
}

export default LayoutBeforeLogin;
