const template = require("../input/template.json");
const fs = require("fs");

const numberOfNfts = parseInt(process.argv[2]);
if (numberOfNfts === NaN || numberOfNfts <= 0) {
  console.error("Must provide a number of nfts as an argument");
  process.exit(1);
}

for(let i=0; i<numberOfNfts; i++) {
  // Copy the image file with incremented number name
  fs.copyFile('./images/hidden.png', `./output/nfts/public_mint_assets/${i}.png`, (err: Error) => {
    if (err) throw err;
    console.log(`copied image ${i}`);
  });
  // Update the number in the name and write to 
  const metaData = { ...template, name: `${template.name} #${i+1}` };
  fs.writeFile(`./output/nfts/public_mint_assets/${i}.json`, JSON.stringify(metaData), { flag: 'w+' }, (err: Error) => {
    if (err) throw err;
    console.log(`Wrote metadata ${i}`);
  })
}

