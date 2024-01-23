maptilersdk.config.apiKey = mapApiKey;
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 14, // starting zoom
});

const popup = new maptilersdk.Popup({ offset: 15 }).setHTML(
    `<h5>${campground.title}</h5><p>${campground.location}</p>`
);

const marker = new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);