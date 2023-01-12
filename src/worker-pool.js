const Wappalyzer = require('wappalyzer')
const { analyzeUrl } = require('./analyze')
const { chunks } = require('./utils')
const { appendCsv } = require('./csv')

module.exports = async ({ urls, enableLogging, limitTab = 10, threadIndex, outputFile }) => {
  const options = {
    debug: false,
    delay: 5000,
    maxDepth: 3,
    maxUrls: 3,
    maxWait: 10000,
    recursive: true,
    userAgent: 'Wappalyzer',
  }

  // const urlChunks = chunks(urls, limitTab)
  const results = []

  let finishUrl = 0

  for (let chunk of urlChunks) {
    console.log('---- Create new chrome instance')
    const wappalyzer = new Wappalyzer(options)
    await wappalyzer.init()
    console.log(`---- Open ${chunk.length} tabs in thread ${threadIndex}`)
    const result = await Promise.all(chunk.map(url => analyzeUrl(wappalyzer, url, enableLogging)))
    await appendCsv(outputFile, result.flat(), false)
    finishUrl += chunk.length
    const totalUrls = urlChunks.flat().length
    console.log(`---- Finish ${finishUrl}/${totalUrls} urls in thread ${threadIndex}`)
    results.push(result)
    await wappalyzer.destroy()
    console.log('---- Destroy chrome instance')
  }

  
  console.log(`-- Finish thread ${threadIndex}`)

  return results.flat()
}