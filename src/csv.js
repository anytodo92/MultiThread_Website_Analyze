const fs = require('fs')
const { parse, stringify } = require('csv')

async function readCsv(csvFile) {
  const urls = []
  // read the csv file
  const parser = parse({ columns: false })
  const stream = fs.createReadStream(csvFile).pipe(parser)

  stream.on('data', (row) => {
    urls.push(row[0])
  })
  // wait for the stream to end and return the urls
  await new Promise((resolve) => {
    stream.on('end', () => {
      resolve(urls)
    })
  })
  return urls
}


//RETURN CSV
function generateOutputData(data, enableConfidence) {
  const outputData = data.map(row => {
    if (row.technologies) {
      return { url: row.url.slice(7), detect: row.technologies, confidence: row.confidence }
    }
    return { url: row.url, detect: row.label || '-' }
  })
  return outputData
}

async function cleanFile(outputFile) {
  await fs.writeFileSync(outputFile, '', 'utf-8')
}

async function writeCsv(outputFile, data, enableConfidence) {
  const outputData = generateOutputData(data, enableConfidence)

  stringify(outputData, { header: true },  (err, output) => {
    if (err) {
      console.error(err)
    }
    fs.writeFile(outputFile, output, (err) => {
      if (err) {
        console.error(err)
      }
    })
  })

}

async function appendCsv(outputFile, data, enableConfidence) {
  const outputData = generateOutputData(data, enableConfidence)

  stringify(outputData, { header: false }, (err, output) => {
    if (err) {
      console.error(err)
    }
    fs.appendFile(outputFile, output, (err) => {
      if (err) {
        console.error(err)
      }
    })
  })

}

module.exports = {
  readCsv, writeCsv, appendCsv, cleanFile
}
