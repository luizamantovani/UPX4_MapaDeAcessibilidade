import React from "react";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { Pin } from "../types/Pin";
import * as Location from 'expo-location';

type MapProps = {
  pins: Pin[];
  onMapPress?: (event: MapPressEvent) => void;
  onMarkerPress?: (pin: Pin) => void;
  userLocation?: Location.LocationObject | null;
};

export default function Map({ pins, onMapPress, onMarkerPress, userLocation }: MapProps) {
  const initialCamera = userLocation
    ? {
        center: {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        },
        zoom: 15,
        heading: 0,
        pitch: 0,
      }
    : {
        center: { latitude: -23.5015, longitude: -47.4526 },
        zoom: 12,
        heading: 0,
        pitch: 0,
      };

  return (
    <MapView
      showsMyLocationButton={true}
      showsUserLocation={true}
      style={{ flex: 1 }}
      initialCamera={initialCamera}
      onPress={onMapPress}
    >
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          title={pin.title}
          description={pin.description ?? undefined}
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
