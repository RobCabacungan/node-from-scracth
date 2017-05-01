console.log('hello');

function async_extract_body(req) {
  return new Promise((resolve, reject) => {
    let retval = '';
    // req.on('data', function (blah) { retval += blah; });
    req.on('data', (blah) => { retval += blah; });
    req.on('end', () => { 
      try {
        if (retval === '') {
          resolve(null);
        } else {
          resolve(JSON.parse(retval)); 
        }
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err) => { reject(err); });
  });
}

function async_parse_request(req) {
  return async_extract_body(req)
    .then((doc) => {
      throw new Error('just testing this');
      let retval = {};
      let u = require('url').parse(req.url, true);
      retval.method = req.method;
      retval.query = u.query;
      retval.doc = doc;
      return retval;
    });
}

function listener(req, res) {
  async_parse_request(req)
    .then((parsed_request) => {
      if (parsed_request.method === 'GET') {
        res.end(JSON.stringify(parsed_request, null, 4));
        return;
      } else if (parsed_request.method === 'POST') {
        res.statusCode = 500;
        res.statusMessage = 'Not implemented';
        res.end('Not implemented');
        return;
      } else if (parsed_request.method === 'DELETE') {
        res.statusCode = 500;
        res.statusMessage = 'Not implemented';
        res.end('Not implemented');
        return;
      }
      res.statusCode = 400;
      res.statusMessage = 'Unknown method';
      res.end('Unknown method');
    })
    .catch((err) => {
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = 'Unexpected exception';
      res.end('Unexpected exception');
    });
}

const Server = require('http').createServer();
Server.on('request', listener);
Server.listen(process.argv[2]);

