import React, { useState, useEffect } from "react";

import Header from "./components/Header/Header";
import MapSection from "./components/MapSection/MapSection";
import PlaceList from "./components/PlaceList/PlaceList";

import { getPlacesData } from "./api/tripAdivsoryApi";

const App = () => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [bounds, setBounds] = useState(null);
  const [type, setType] = useState("hotels");
  const [places, setPlaces] = useState([]);
  const [rating, setRating] = useState("");

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    setCoords({
      lat: autocomplete.getPlace().geometry.location.lat(),
      lng: autocomplete.getPlace().geometry.location.lng(),
    });
  };

  useEffect(() => {
    if (bounds) {
      getPlacesData(bounds.ne, bounds.sw).then((data) => {
        setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
      });
    }
  }, [bounds, type]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({
          lat: latitude,
          lng: longitude,
        });
      }
    );
  }, []);

  return (
    <div>
      <Header onLoad={onLoad} onPlaceChanged={onPlaceChanged} />

      <div className="container">
        <PlaceList places={places} />

        <MapSection
          coords={coords}
          setBounds={setBounds}
          setCoords={setCoords}
        />
      </div>
    </div>
  );
};

export default App;
