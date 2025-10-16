import React from "react";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { Pin } from "../types/Pin";

type MapProps = {
  pins: Pin[];
  onMapPress?: (event: MapPressEvent) => void;
  onMarkerPress?: (pin: Pin) => void;
};

export default function Map({ pins, onMapPress, onMarkerPress }: MapProps) {
  return (
    <MapView
      showsMyLocationButton={true}
      showsUserLocation={true}
      style={{ flex: 1 }}
      initialCamera={{
        center: { latitude: -23.5015, longitude: -47.4526 },
        zoom: 12,
        heading: 0,
        pitch: 0,
      }}
      onPress={onMapPress}
    >
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          title={pin.title}
          description={pin.description}
          pinColor={
            pin.category === "acessivel"
              ? "green"
              : pin.category === "nao_acessivel"
              ? "red"
              : "gray"
          }
          onPress={() => onMarkerPress && onMarkerPress(pin)}
        />
      ))}
    </MapView>
  );
}
