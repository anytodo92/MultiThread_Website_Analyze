const Piscina = require('piscina')
const { program } = require('commander')

const { readCsv, cleanFile } = require('./src/csv')
const { resolve, join } = require('path')
const { chunks } = require('./src/utils')

async function run({ chunksNum = 50, enableLogging = true, inputFile, outputFile, enableConfidence = false, limitTab = 10 }) {
  console.time('Analyze time')

  const inputFileLocation = join(__dirname, inputFile)
  const outputFileLocation = join(__dirname, outputFile)

  console.log('Reading input csv file...')
  let urls = await readCsv(inputFileLocation)
  // urls = urls.slice(0, 1)
  console.log(`* Done!, total urls will be analyzed: ${urls.length}`)


  try {
    const urlChunks = chunks(urls, chunksNum)
    console.log(`* Total threads: ${urlChunks.length}`)

    const pool = new Piscina({ filename: resolve(__dirname, './src/worker-pool.js'), idleTimeout: 1000 })
    console.log('Start analyzing...')

    await cleanFile(outputFileLocation)
    await Promise.all(urlChunks.map((urls, index) => {
      console.log(`-- Thread ${index} will analyze ${urls.length} urls`)
      return pool.run({ urls, enableLogging, limitTab, threadIndex: index, outputFile: outputFileLocation })
    }))

    console.log('Writing results to csv...')
    // await writeCsv(outputFileLocation, results.flat(), enableConfidence)
    console.log('Writing results done!')

  } catch (error) {
    console.error(error)
  }
  console.timeEnd('Analyze time')
}



program
  .option('-c, --chunks <number>', 'Split urls into n chunks (default 1000)')
  .option('-lm, --limitTab <number>', 'Limit chrome tabs per chrome instance (default 10)')
  .option('-l, --log', 'Enable logging (default false)')
  .option('-i, --input <file>', 'Input file (default urls.csv)')
  .option('-o, --output <file>', 'Input file (default result.csv)')
  .option('-cfd, --confidence', 'Write confidence results to csv (default false)')

program.parse(process.argv);

const options = program.opts();
const chunksNum = parseInt(options.chunks) || 1000
const enableLogging = options.log || false
const enableConfidence = options.confidence || false
const limitTab = parseInt(options.limitTab) || 10

const inputFile = options.input || 'urls.csv'
const outputFile = options.output || 'result.csv'


run({ chunksNum, enableLogging, inputFile, outputFile, enableConfidence, limitTab })


