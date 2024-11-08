import { Box, Stack } from "@mui/material";
import * as Icons from "@mui/icons-material";
import { useContext } from "react";
import { ToolsContext } from "@/context/Context";

const IconSymbol = {
  Groups: Icons.Groups,
  ThumbUp: Icons.ThumbUp,
  Email: Icons.Email,
  MobileOff: Icons.MobileOff,
  Paid: Icons.Paid,
  RotateRight: Icons.RotateRight,
  Sync: Icons.Sync,
  AccountBalanceWallet: Icons.AccountBalanceWallet,
  AccountBalance: Icons.AccountBalance,
  TaskAlt: Icons.TaskAlt,
  Block: Icons.Block,
};

function BoxTransaction({
  variant,
  labels,
  values,
  colors,
  icons,
}: {
  variant?: string;
  labels: string[];
  values: number[];
  colors: string[];
  icons: string[];
}) {
  const { toTHB } =
  useContext(ToolsContext);
  const getIcons = (index) => {
    const Icon = IconSymbol[icons[index]];
    return (
      <Icon
        sx={{
          color: variant === "contained" ? "#fff" : colors[index],
        }}
      />
    );
  };
  return (
    <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
      {labels.length > 0 &&
        labels.map((label, index) => (
          <Stack
            sx={{
              p: 4,
              flex: 1,
              border: variant === "contained" ? 0 : 1,
              borderRadius: 1,
              bgcolor: variant === "contained" ? `${colors[index]}` : "#fff",
              borderColor: variant === "contained" ? "" : colors[index],
              minWidth: 200,
            }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            key={`bt-${index}`}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Stack
                sx={{
                  p: 3,

                  bgcolor:
                    variant === "contained"
                      ? "#00000025"
                      : `${colors[index]}25`,
                  borderRadius: 1,
                }}
              >
                {getIcons(index)}
              </Stack>
              <Stack spacing={2}>
                <Box
                  component="span"
                  sx={{
                    fontSize: 12,
                    color: variant === "contained" ? "#fff" : "",
                  }}
                >
                  {label}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: variant === "contained" ? "#fff" : "",
                  }}
                >
                  {toTHB(values[index])}
                </Box>
              </Stack>
            </Stack>
            <Stack>
              <Icons.ArrowForwardIos sx={{ fontSize: 12 }} />
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
}

export default BoxTransaction;
