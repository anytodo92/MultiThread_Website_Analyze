function chunks(arr, chunkSize) {
  if (chunkSize === 0) return arr
  let results = [];
  while (arr.length) results.push(arr.splice(0, chunkSize));
  return results;
}

module.exports = { chunks };