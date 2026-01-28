/* global maptilersdk, mapToken, coordinates*/

maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
  center: coordinates, 
  zoom: 9
});

const marker = new maptilersdk.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(new maptilersdk.Popup({ offset: 25 }).setHTML("<h4>Exact Location will be provided after booking</h4>"))
  .addTo(map);