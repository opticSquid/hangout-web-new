export const GetInitials = (fullName: string | undefined) => {
  if (!fullName) return "";
  const nameParts = fullName.split(" ");
  return nameParts[0][0] + nameParts[1][0];
};
