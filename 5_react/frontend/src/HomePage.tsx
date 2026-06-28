import { Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Welcome</Typography>

      <Typography color="text.secondary">
        You can open products, and if you are logged in (mocked), then add them
        to your basket.
      </Typography>
    </Stack>
  );
}
