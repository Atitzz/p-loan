import { Box, Stack } from "@mui/material";
import * as Icons from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "@/context/Context";

const IconSymbol = {
  Groups: Icons.Groups,
  ThumbUp: Icons.ThumbUp,
  Email: Icons.Email,
  MobileOff: Icons.MobileOff,
  Paid:Icons.Paid,
  RotateRight:Icons.RotateRight,
  Sync:Icons.Sync,
  TaskAlt:Icons.TaskAlt,
  Block:Icons.Block
};
function BoxLoans({
  labels,
  values,
  colors,
  icons,
  link
}: {
  labels: string[];
  values: number[];
  colors: string[];
  icons: string[];
  link:string[];
}) {
  const navigate = useNavigate();
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const getIcons = (index) => {
    const Icon = IconSymbol[icons[index]];
    return <Icon sx={{ color: colors[index] }} />;
  };
  const onClick = (link) =>{
    navigate(link);
}
  return (
    <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
      {labels.length > 0 &&
        labels.map((label, index) => (
          <Stack
            sx={{
              p: 4,
              flex: 1,
              borderRadius: 1,
              bgcolor: `${colors[index]}25`,
              minWidth: 200,
              cursor: "pointer"
            }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            key={`bl-${index}`}
            onClick={() => onClick(link[index])}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Stack spacing={2}>
                <Box component="span" sx={{ fontSize: 12 }}>
                  {label}
                </Box>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {values[index]}
                </Box>
              </Stack>
            </Stack>
            <Stack>
            <Stack
                sx={{
                  p: 3,
                  borderRadius: 1,
                }}
              >
                {getIcons(index)}
              </Stack>
          </Stack>
          </Stack>
        ))}
    </Stack>
  );
}

export default BoxLoans;
