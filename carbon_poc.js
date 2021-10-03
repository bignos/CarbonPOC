const fs = require('fs');
const carbone = require('carbone');

async function convert_template(template, data, extention, filename) {
  let options = {
    convertTo: extention
  };

  return new Promise((resolve, reject)=>{
    carbone.render(template, data, options, function(err, result){
      if (err) {
        return reject(err);
      }
      let file = `${filename}.${extention}`;
      fs.writeFileSync(file, result);
      resolve({success:true,file});
    });
  });
};

async function run() {
  // JSON structure sample
  let json_sample = {
    firstname : 'John',
    lastname : 'Doe'
  };

 await convert_template('./template.odt', json_sample, 'pdf', 'result' );
 await convert_template('./template.odt', json_sample, 'docx', 'result' );
 process.exit();
};

run();
