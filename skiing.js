var file = 'map.txt',
  maps = [],
  pathsByLength = {};

require('fs').readFile(file, 'utf8', function(err, data) {
  var lines = data.split('\n'),
    isFirstLine = true,
    width = 0,
    height = 0;

  // insert text to maps
  lines.forEach(function(line, index) {
    var row = line.split(' ');

    if (isFirstLine) {
      width = row[0];
      height = row[1];
      isFirstLine = false;
    } else {
      maps.push(row.map(function(number) { return Number(number); }));
    }
  });

  // trace all points
  for (var y = 0; y < height; ++y) {
    for (x = 0; x < width; ++x) {
      trace(x, y);
    }
  }

  var maxLength = Math.max.apply(this, Object.keys(pathsByLength)),
    maxDrop = -1;

  pathsByLength[maxLength].forEach(function(path, index) {
    var startPoint = path[0],
      endPoint = path[path.length - 1],
      currentDrop = getValue(startPoint['x'], startPoint['y']) - getValue(endPoint['x'], endPoint['y']);

    // get the highest drop
    if (maxDrop < currentDrop) {
      maxDrop = currentDrop;
      bestPath = path.map(function(point) { return getValue(point['x'], point['y']) });
    }
  });

  console.log('Best path: ' + bestPath.join('-'));
  console.log('Length: ' + maxLength);
  console.log('Drop: ' + maxDrop);
})

/**
 * Trace the maps by examining all possible move from the currentX and currentY.
 * Get the path if it can't move any further.
 *
 * @param Number currentX
 * @param Number currentY
 * @param [{x: Number, y: Number}] Path that consists of array of coordinate
 */
function trace(currentX, currentY, path) {
  path = path || [];
  var valid = 0,
    directions = ['east', 'south', 'west', 'north'],
    nextX,
    nextY,
    nextValue,
    currentPath = path.slice(0); // clone array so it is not passed by reference

  currentPath.push({
    x: currentX,
    y: currentY
  })

  directions.forEach(function(direction) {
    switch (direction) {
      case 'east':
        nextX = currentX + 1;
        nextY = currentY;
        break;

      case 'south':
        nextX = currentX;
        nextY = currentY + 1;
        break;

      case 'west':
        nextX = currentX - 1;
        nextY = currentY;
        break;

      case 'north':
        nextX = currentX;
        nextY = currentY - 1;
        break;
    }

    nextValue = getValue(nextX, nextY);
    if (nextValue !== false && nextValue < getValue(currentX, currentY)) {
      valid++;
      trace(nextX, nextY, currentPath);
    }
  });

  if (!valid) {
    var pathLength = currentPath.length;
    if (pathsByLength[pathLength] === undefined) {
      pathsByLength[pathLength] = [currentPath];
    } else {
      pathsByLength[pathLength].push(currentPath);
    }
  }
}

/**
 * Retrieve the value from the maps with given x and y
 *
 * @param Number x
 * @param Number y
 *
 * @return Number|Boolean Return false if the given x and y does not exist
 */
function getValue(x, y) {
  if (maps[y] !== undefined && maps[y][x] !== undefined) {
    return maps[y][x];
  }

  return false;
}
