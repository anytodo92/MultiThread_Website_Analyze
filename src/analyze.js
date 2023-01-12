async function analyzeUrl(wappalyzerInstance, url, enableLogging = false) {
  // check if the url string has a protocol, if not, add http://
  if (!url.startsWith('http')) {
    url = `http://${url}`
  }
  if (enableLogging) {
    console.log('------ Start analyzing: ', url)
  }
  const site = await wappalyzerInstance.open(url)

  const results = await site.analyze()
  const detectResult = await detectSpotifyOrStripeInTechnologies(results.technologies)
  if (enableLogging) {
    console.log(`------ Finish analyzing: ${url}; Result: ${detectResult.exist ? `Found ${detectResult.label}!` : 'Not found.'}`)
  }

  return {
    url, ...results
  }
}

async function detectSpotifyOrStripeInTechnologies(technologies) {
  // check shopify first
  // const shopify = technologies.find(tech => tech.name === 'Shopify')
  // if (shopify) {
  //   return { exist: true, label: 'Shopify', confidence: shopify.confidence }
  // }
  // // then check stripe
  // const stripe = technologies.find(tech => tech.name === 'Stripe')
  // if (stripe) {
  //   return { exist: true, label: 'Stripe', confidence: stripe.confidence }
  // }

  // const webflow = technologies.find(tech => tech.name === 'Webflow')
  // if (webflow) {
  //   return { exist: true, label: 'Webflow', confidence: webflow.confidence }
  // } 


  // const facebookpixel = technologies.find(tech => tech.name === 'Facebook Pixel')
  // if (facebookpixel) {
  //   return { exist: true, label: 'Facebook Pixel', confidence: facebookpixel.confidence }
  // } 


  // // if not found, return false
  // return { exist: false, label: null, confidence: null }
}

module.exports = { analyzeUrl, detectSpotifyOrStripeInTechnologies }