type ProfilePicture = {
  filename: string;
  contentType: string;
};
export type Profile = {
  profileId: string;
  userId: string;
  name: string;
  profilePicture: ProfilePicture;
};

export type NewProfileFormSchema = {
  name: string;
  profilePicture: File;
};
