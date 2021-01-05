const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

async function changeVersion () {
  const fs = require('fs')
  let tag = (await exec('git describe --tags --abbrev=0')).stdout
  tag = tag.replace('\n', '')
  console.log(tag)
  let describe = await exec('git describe --tags --long')
  console.log(describe)
  describe = describe.stdout.replace(tag, '')
  console.log(describe)
  const chunks = describe.split('-')
  let version = tag.substring(1)
  const commitHash = chunks[2].substring(1).trim()
  const distance = chunks[1]
  if (distance !== '0') {
    version += `+${distance}-${commitHash}`
  }

  process.env['APP_VERSION'] = version
  fs.writeFile('version.txt', version, 'utf8', function (err) {
    if (err) return console.log(err);
  });
  process.env['LATEST_TAG_DISTANCE'] = distance
  fs.writeFile('tag_distance.txt', distance, 'utf8', function (err) {
    if (err) return console.log(err);
  });

  console.log(`version: ${version}`)
  console.log(`distance: ${distance}`)
  console.log(`commitHash: ${commitHash}`)

  fs.readFile('package.json', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    var result = data.replace(/"version": ".*"/g, `"version": "${version}"`);
    var result = result.replace(/"commitHash": ".*"/g, `"commitHash": "${commitHash}"`);

    fs.writeFile('package.json', result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    console.log(result)
  });
};

changeVersion()