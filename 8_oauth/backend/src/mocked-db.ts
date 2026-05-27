const users: {
  id: number;
  username: string;
  password: string;
}[] = [
  { id: 1, username: "alicja", password: "password1234" },
  { id: 2, username: "bob", password: "passwordABCD" },
];

export const isValidUser = (username: string, password: string): boolean => {
  for (let user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  return false;
}
