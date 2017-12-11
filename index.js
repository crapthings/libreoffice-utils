const path = require('path')

const fs = require('fs-plus')

const mkdirp = require('mkdirp')

const shortid = require('shortid')

const shell = require('shelljs')

const gm = require('gm').subClass({
  imageMagick: true,
})

function toPDF(input, output) {
  if (!output)
    output = mktmp()

  const cmd = [
    `soffice`,
    `--headless`,
    `--convert-to pdf`,
    `--outdir ${output}`,
    `${fs.absolute(input)}`,
  ]

  const filename = getFilename(input)

  const { stderr } = shell.exec(cmd.join(' '))

  if (stderr)
    return [stderr, null]

  return [null, `${output}/${filename}.pdf`]
}

function toPNG(input, output, page) {
  let [err, pdf] = path.extname(input) === '.pdf' ? [null, fs.absolute(input)] : toPDF(input)

  if (err)
    return [err, null]

  if (!output)
    output = path.dirname(pdf)

  const filename = getFilename(input)

  return new Promise((resolve, reject) => gm(fs.absolute(pdf))
    .command('convert')
    .write(`${output}/${filename}.png`, err => {
      err ? reject([err, null]) : resolve([null, `${output}/${filename}.png`])
    })
  )
}

function getFilename(opt) {
  return path.basename(opt, path.extname(opt))
}

function mktmp() {
  const tmp = fs.absolute(`~/tmp/${shortid.generate()}`)
  mkdirp.sync(tmp)
  return tmp
}

module.exports = {
  toPDF,
  toPNG,
}
