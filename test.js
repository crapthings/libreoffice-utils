const lu = require('./')

async function test() {
  const pdf = lu.toPDF('./example.docx')
  const png = await lu.toPNG('./example.docx')
}

test()
//
