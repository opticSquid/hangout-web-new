import PostComponent from "@/components/post";
import ProfileHeaderComponent from "@/components/profile-header";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/types/posts";
import type { Profile } from "@/lib/types/profile";
import { Grid3X3Icon } from "lucide-react";
import type { ReactElement } from "react";

function ProfilePage(): ReactElement {
  const profileData: Profile = {
    profileId: "neobnebn",
    userId: "jinvjbn",
    name: "Soumalya Bhattacharya",
    profilePicture: {
      filename:
        "418d2883f1532dc2f2681aa7788f495338f60c81543c214b1fae0336a47fb76bd71dd7f07541ef0e49e918d126dd0a31bae052ec5e60d39f0fb4e216f205add3_1080.avif",
      contentType: "image/avif",
    },
  };
  const extractedFilename = (filename: string): string => {
    const res = filename.match(/^[^_]*/);
    if (res && res[0] !== undefined) {
      return res[0];
    }
    return "";
  };

  const baseUrl = `http://localhost:9000/processed/${extractedFilename(
    profileData.profilePicture.filename
  )}`;
  const dummyPost1: Post = {
    postId: "a",
    ownerId: 0,
    filename:
      "531530e17baa69d03de1d4b4135e76a2a0eab9a85d76c851b3616a791a6463b3498023aad9144d0236ee941befb09b1c87b17e2091912cd407a88332846f3f8e.mpd",
    contentType: "video/mp4",
    postDescription: "description",
    hearts: 0,
    comments: 0,
    interactions: 0,
    createdAt: "2025-06-21T14:45:30.123Z",
    state: "West Bengal",
    city: "Kolkata",
    location: {
      type: "Point",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      coordinates: [22.5674, 88.4739],
    },
    distance: 124,
  };
  const dummyPost2: Post = {
    postId: "a",
    ownerId: 0,
    filename:
      "531530e17baa69d03de1d4b4135e76a2a0eab9a85d76c851b3616a791a6463b3498023aad9144d0236ee941befb09b1c87b17e2091912cd407a88332846f3f8e.mpd",
    contentType: "video/mp4",
    postDescription: "description",
    hearts: 29,
    comments: 52,
    interactions: 0,
    createdAt: "2025-06-21T14:45:30.123Z",
    state: "West Bengal",
    city: "Kolkata",
    location: {
      type: "Point",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      coordinates: [22.5674, 88.4739],
    },
    distance: 47,
  };
  return (
    <div className="flex flex-col h-full">
      <ProfileHeaderComponent
        profilePictureBaseUrl={`${baseUrl}/${profileData.profilePicture.filename}`}
        name={profileData.name}
      />
      <div className="flex flex-row border-t border-b justify-center">
        <Button variant="ghost" size="icon">
          <Grid3X3Icon />
          &nbsp;POSTS
        </Button>
      </div>
      <section className="overflow-y-auto scroll-smooth snap-y snap-mandatory">
        <PostComponent {...dummyPost1} />
        <PostComponent {...dummyPost2} />
        <PostComponent {...dummyPost1} />
      </section>
    </div>
  );
}
export default ProfilePage;
