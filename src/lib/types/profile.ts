type ProfilePicture = {
  filename: string;
  contentType: string;
};

export type ProfileSchema = {
  name: string;
  gender: string;
  dob: Date | undefined;
  profilePicture: File | undefined;
};

export type Profile = {
  profileId: string;
  userId: number;
  name: string;
  profilePicture: ProfilePicture;
};

export type PublicProfile = {
  name: string;
  profilePicture: string;
};
