const https = require('https')
const pem = require('pem')
const fs = require('fs')
const carbone = require('carbone')

async function convert_template(template, data, extention, filename) {
  let options = {
    convertTo: extention
  }

  return new Promise((resolve, reject)=>{
    carbone.render(template, data, options, function(err, result){
      if (err) {
        return reject(err)
      }
      let file = `${filename}.${extention}`
      fs.writeFileSync(file, result)
      resolve({success:true,file})
    })
  })
}

pem.createCertificate({
  days: 1,
  selfSigned: true
}, (err, keys) => {
  if (err) console.error(err)

  const service = require('restana')({
    server: https.createServer({
      key: keys.serviceKey,
      cert: keys.certificate
    })
  })

  const bodyParser = require('body-parser')
  service.use(bodyParser.json())

  service.get('/generate_report/:name', async(req, res) => {
    let name = req.params.name
    let template = req.body.template
    let data = req.body.data
    let filetype = req.body.filetype
    await convert_template(template, data, filetype, name)

    let filename = `${name}.${filetype}`
    res.send({url: filename})
  })
  const port = 3133
  service.start(port)
})
