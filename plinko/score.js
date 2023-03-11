const outputs = [];
const predictionPoint = 300;
const k = 3;
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  let numberCorrect = 0;
  for (let i = 0; i < testSet.length; i++) {
    const bucket = knn(trainingSet, testSet[i][0]);
    if (bucket === testSet[i][3]) {
      numberCorrect++;
    }
  }
  _.range(1, 15).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === testPoint[3]
      )
      .size()
      .divide(testSetSize)
      .value();
    console.log("For k of", k, "accuracy is: ", accuracy);
  });
}

function knn(data, point, k) {
  const knn = _.chain(data)
    .map((row) => {
      return [distance(_.initial(row), point), _.last(row)];
    })
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
  return knn;
}

const distance = (pointA, pointB) => {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => a - b ** 2)
    .sum()
    .value();
};

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, 0, testCount);
  return [testSet, trainingSet];
}
