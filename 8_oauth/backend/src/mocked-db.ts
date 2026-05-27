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

export const createUser = (username: string, password: string): number => {
  const largestId = users.map(user => user.id).sort((a, b) => b - a)[0]; // sort is inefficient, but it is mocked small amount of data
  const newId = (largestId ?? 0) + 1;
  users.push({id: newId, username, password});
  return newId;
}
