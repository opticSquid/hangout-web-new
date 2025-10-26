import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { MapPinIcon } from "lucide-react";
import type { ReactElement } from "react";

function NoPostsNearby(): ReactElement {
  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <Card className="w-full max-w-md shadow-lg border-2 border-dashed border-primary/30 bg-background/80">
        <CardHeader className="flex flex-col items-center gap-2">
          <MapPinIcon className="h-12 w-12 text-primary/70" />
          <CardTitle className="text-center text-lg font-semibold text-primary">
            No Posts Nearby
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground text-base">
            There are no posts available within a 25 km radius of your current
            location.
            <br />
            Please check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default NoPostsNearby;
