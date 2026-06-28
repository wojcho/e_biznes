import { Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import Basket from "./Basket";
import Payments from "./Payments";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? Number(id) : null;

  if (!userId) {
    return <Typography>Invalid user.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">User #{userId}</Typography>

      <Basket />

      <Payments />
    </Stack>
  );
}
