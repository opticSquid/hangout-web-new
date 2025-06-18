import { useEffect, useState } from "react";

function HomePage() {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );
  // Fetches user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
        },
        (error) => {
          if (error.PERMISSION_DENIED) {
            alert("Can not fetch near by posts with out location permission");
          } else if (error.POSITION_UNAVAILABLE) {
            alert(
              "Your location is not available at this moment. Please try again later"
            );
          } else {
            alert(
              "Something went wrong during fetching your location. Please refresh the page. If the error persists try agian later"
            );
          }
        }
      );
    }
  }, []);

  return (
    <div>
      User's location:
      {userLocation != null ? (
        <>
          <span>Longitude: {userLocation.coords.longitude},&nbsp;</span>
          <span>Latitude: {userLocation.coords.latitude},&nbsp;</span>
          <span>Accuracy: {userLocation.coords.accuracy}m,&nbsp;</span>
        </>
      ) : (
        "undefined"
      )}
    </div>
  );
}
export default HomePage;
