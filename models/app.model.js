const fs = require('fs/promises')

exports.selectEndpoints = () =>{
   return fs.readFile('./endpoints.json')
    .then((contents) =>{
        const parsedContent = JSON.parse(contents)
        return parsedContent
    })
    .catch((err) => {
        console.error('Error reading or parsing the file:', err);
        throw new Error('Error reading or parsing the file');
    });
    
}