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

export type PublicProfile = {
  name: string;
  profilePicture: string;
};
