/* eslint-disable */

export const displayMap = (location) => {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWRuYW4yMjMwIiwiYSI6ImNrcHZ3aDhxazBkbDMyb3AyZHphNngxYWYifQ.aZJaI9IxZiJASsCeCNq-9g';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/adnan2230/cl0oxp5mv00c515qgjuioym38',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marjer
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bound to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
