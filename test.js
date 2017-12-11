const lu = require('./')

async function test() {
  const [errToPDF, respToPDF] = lu.toPDF('./example.docx')
  const [errToPNG, respToPNG] = await lu.toPNG('./example.docx')
}

test()
