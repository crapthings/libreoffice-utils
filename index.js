const { exec } = require('child_process')

const path = require('path')

const fs = require('fs-plus')

const mkdirp = require('mkdirp')

const gm = require('gm').subClass({
  imageMagick: true,
})

const shortid = require('shortid')

const pWaterfall = require('p-waterfall')

function toPDF(input, output) {
  if (!output)
    output = fs.absolute(`~/tmp/${shortid.generate()}`)

  const cmd = [
    `soffice`,
    `--headless`,
    `--convert-to pdf`,
    `--outdir ${output}`,
    `${fs.absolute(input)}`,
  ]

  const filename = path.basename(input, path.extname(input))

  return new Promise((resolve, reject) => exec(cmd.join(' '), err => {
    err ? reject([err, null]) : resolve([null, `${output}/${filename}.pdf`])
  }))
}

async function toPNG(input, output, page) {
  if (!output)
    output = fs.absolute(`~/tmp/${shortid.generate()}`)

  const [err, pdf] = await toPDF(input)

  mkdirp.sync(output)

  if (err)
    throw err

  const filename = path.basename(input, path.extname(input))

  return new Promise((resolve, reject) => gm(fs.absolute(pdf))
  .command('convert')
  .write(`${output}/${filename}.png`, err => {
    err ? reject([err, null]) : resolve([null, `${output}/${filename}.png`])
  }))
}
