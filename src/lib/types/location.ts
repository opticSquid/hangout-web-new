export type Location = {
  type: "Point";
  crs: {
    type: "name";
    properties: {
      name: "EPSG:4326";
    };
  };
  coordinates: number[];
};

export type SearchRadius = {
  min: number;
  max: number;
};

export type Position = {
  lat: number;
  lng: number;
};
