const path = require('path')

const fs = require('fs-plus')

const _ = require('lodash')

const shortid = require('shortid')

const shell = require('shelljs')

const gm = require('gm').subClass({
  imageMagick: true
})

const Extensions = ['.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt']

const soffice = shell.which('soffice') ? 'soffice' : null

function toPDF(input, output) {
  if (!fs.isFileSync(input))
    throw new Error('file doesn\'t exist')

  if (!_.includes(Extensions, path.extname(input)))
    throw new Error('unsupported file format')

  const filename = path.basename(input, path.extname(input))

  console.log(filename)

  if (!output)
    output = `~/tmp/${shortid.generate()}`

  let cmd = `${soffice} --headless --convert-to pdf --outdir ${output} ${input}`

  const exec = shell.exec(cmd)

  if (exec.stderr)
    shell.exit(1)

  return `${output}/${filename}.pdf`
}

function toPNG(input, output) {
  const pdf = fs.absolute(toPDF(input))
  console.log(pdf)
  gm(pdf)
    .command('convert')
    .write('./test.png', function (err) {
      console.log(err)
    })
}

// console.log()

//
//

toPNG('./example.docx')
