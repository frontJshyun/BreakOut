/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */

const getRotateTransform = (origin, point, radian) => {
  return [
    (point[0] - origin[0]) * Math.cos(-radian) - (point[1] - origin[1]) * Math.sin(-radian) + origin[0],
    (point[0] - origin[0]) * Math.sin(-radian) + (point[1] - origin[1]) * Math.cos(-radian) + origin[1]
  ]
}

self.onmessage = function (event) {
  const { pixelation, imageData, width, height } = event.data;
  const data = imageData.data;

  let y, x, n ,m;

  for ( y = 0; y < height; y += pixelation ) {
    for ( x = 0; x < width; x += pixelation ) {

        var red = data[((width * y) + x) * 4];
        var green = data[((width * y) + x) * 4 + 1];
        var blue = data[((width * y) + x) * 4 + 2];

        const origin = [x + Math.floor(pixelation / 2), y + Math.floor(pixelation / 2)];
        const rotate = Math.PI * 2 * (red / 255);

        for ( n = 0; n < pixelation; n++ ) {
            for ( m = 0; m < pixelation; m++ ) {
              const rp = getRotateTransform(origin, [x + m, y + n], rotate);
                if ( x + m < width ) {
                    data[((width * Math.round(rp[1])) + (Math.round(rp[0]))) * 4] = red;
                    data[((width * Math.round(rp[1])) + (Math.round(rp[0]))) * 4 + 1] = green;
                    data[((width * Math.round(rp[1])) + (Math.round(rp[0]))) * 4 + 2] = blue;
                    data[((width * Math.round(rp[1])) + (Math.round(rp[0]))) * 4 + 3] = 250;
                }
            }
        }
    }
  }

  self.postMessage({
    imageData
  });
};