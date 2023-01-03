const userData = (users) => {
  const outputArray = users.reduce((accumulator, currentValue) => [
    ...accumulator,
    {
      Name: currentValue.name,
      email: currentValue.email,
      Role: currentValue.type,
      Status: currentValue.status,
      Edit: '',
    },
  ], []);
  return outputArray;
};
