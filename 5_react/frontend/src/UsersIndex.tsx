import { Stack, Typography } from "@mui/material";
import UserSelector from "./UserSelector";

export default function UsersIndex() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Users</Typography>

      <UserSelector />
    </Stack>
  );
}
