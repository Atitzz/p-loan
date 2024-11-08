import { Box, Stack } from "@mui/material";
import * as Icons from "@mui/icons-material";

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
}: {
  labels: string[];
  values: number[];
  colors: string[];
  icons: string[];
}) {
  const getIcons = (index) => {
    const Icon = IconSymbol[icons[index]];
    return <Icon sx={{ color: colors[index] }} />;
  };
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
            }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            key={`bl-${index}`}
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
