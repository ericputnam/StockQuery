'use strict';

// route handler for the API
var marklogic  = require('marklogic');
var connection = require('./dbsettings').connection;
var db         = marklogic.createDatabaseClient(connection);
var qb         = marklogic.queryBuilder;
var pb         = marklogic.patchBuilder;
/*
function to select all documents from the database - the query is restricted to
retrieve images from the 'image' collection. The 'image' collection consists of
documents that are describing the image itself but they have no binary data. The
binary data is only linked

e.g.

{
  "filename": "IMG_6193.jpg",
  "location": {
    "type": "Point",
    "coordinates": [
      43.7385,
      7.429167
    ]
  },
  "binary": "/binary/IMG_6193.jpg"
}
*/
/*var selectAll = function selectAll() {
    return db.documents.query(
      qb.where(
        qb.collection('image')
      )
      .orderBy(
        qb.sort('filename')
      )
      .slice(0,300) //return 300 documents "per page" (pagination)
    ).result();
};*/

/* This function selects one image from the database */
/*var selectOne = function selectOne(uri) {
    return db.documents.read('/image/' + uri + '.json').result();
};*/

/* This function updates the document. From the frontend we are allowed to set/change
the title of an image.
*/
var updateDocument = function(uri, update) {
  update = JSON.parse(update);

  var ops = [];
  if (update.title) {
    ops.push(
      pb.replaceInsert('/title', '/filename', 'after', { title: update.title })
    );
  }
  if (update.description) {
    ops.push(
      pb.replaceInsert('/description', '/filename', 'after', { description: update.description })
    );
  }

  return db.documents.patch(
      '/image/' + uri + '.json',
      ops
    )
  .result();
};

/* This function is responsible for performing a quote search */
var search = function search(arg) {
    return db.documents.query(
      qb.where(
        qb.term(arg)
      )
      .withOptions({metrics: false, categories: 'metadata'})
    ).result()

    /*return db.documents.query(
      qb.where(
        qb.collection('stockquote'),
        qb.parsedFrom(arg)
      ).slice(0,300)
    ).result();*/
};

var semantic = function semantic(country) {
  country = country.replace(' ', '_');
  var query = [
  'PREFIX db: <http://dbpedia.org/resource/>',
  'PREFIX onto: <http://dbpedia.org/ontology/>',
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
  'PREFIX prop: <http://dbpedia.org/property/>',
  'SELECT * ',
  'WHERE {',
  'OPTIONAL { db:' + country + ' onto:capital      ?capital . } ',
  'OPTIONAL { db:' + country + ' prop:imageFlag    ?imageFlag . } ',
  'OPTIONAL { db:' + country + ' prop:imageMap     ?imageMap . } ',
  'OPTIONAL { db:' + country + ' foaf:homepage     ?homepagel . } ',
  'OPTIONAL { db:' + country + ' onto:anthem       ?anthem . } ',
  'OPTIONAL { db:' + country + ' prop:areaKm       ?areaKm . } ',
  'OPTIONAL { db:' + country + ' prop:currencyCode ?currencyCode . } ',
  'OPTIONAL { db:' + country + ' prop:timeZone     ?timeZone . } ',
  'OPTIONAL { db:' + country + ' onto:abstract     ?abstract . }} '
  ];

  return db.graphs.sparql('application/sparql-results+json', query.join('\n'))
  .result();
};
/*
When specified the function below are making use of ExpressJS' req.params object
that contains the URL parameters that are sent with the request so:
if the route configuration contains:
/api/:id then the following URL http://localhost/api/image1234 will have a
'req.params.id' value that we can capture.
*/

/* wrapper function for selectAll() to retrieve all documents */
var apiindex = function(req, res) {
    selectAll().then(function(documents) {
        res.json(documents);
    }).catch(function(error) {
      console.log('Error: ', error);
    });
};

/* wrapper function to retrieve one document information */
var apisinglequote = function(req, res) {
  var id = req.params.id;
  selectOne(id).then(function(document) {
    if (document.length !== 0) {
      res.json(document);
    }
  }).catch(function(error) {
    res.status(404).end();
    console.log('Error: ', error);
  });
};

/* wrapper function to retrieve image data */
var apiimagedata = function(req, res) {
  var id = req.params.id;
  res.writeHead(200, { 'Content-type': 'image/jpeg' });
  var data = [];
  var buffer = [];
  db.documents.read('/binary/' + id).stream('chunked').on('data', function(chunk) {
    data.push(chunk);
  }).on('end', function() {
    buffer = Buffer.concat(data);
    res.end(buffer);
  });
};

/* wrapper function to update a document's title */
var apiupdate = function(req, res) {
  var id = req.params.id;
  var update = req.params.update;
  updateDocument(id, update).then(function(response) {
    res.json(200);
  }).catch(function(error) {
    console.log('Error: ', error);
  });
};

/* wrapper function for search */
var apisearch = function(req, res) {
    //Parse the term you'd like to search with and call the search function
    var term = req.params.term;

    search(term).then(function(data) {
      res.json(data);
    }).catch(function(error) {
      console.log('Error: ', error);
    });
};

var apisemantic = function(req, res) {
  var country = req.params.country;
  var options = ['capital', 'imageFlag', 'imageMap', 'searchhomepage', 'anthem', 'areaKm', 'currencyCode', 'timeZone', 'abstract'];
  var data = {};
  var counter = 0;
  semantic(country)
  .then(function(result) {
    options.forEach(function(option) {
      var check = '';
      counter++
      if (result.results.bindings[0][option]) {
        if (result.results.bindings[0][option].value.indexOf('_') > -1) {
          var value = result.results.bindings[0][option].value.replace(/_/g, ' ');
          if (value.indexOf('http://') > -1) {
            data[option] = value.split('/').pop();
          }
        } else if (result.results.bindings[0][option].value.indexOf('http://') > -1) {
            data[option] = result.results.bindings[0][option].value.split('/').pop();
        } else {
          data[option] = result.results.bindings[0][option].value
        }

        if (counter === options.length) {
          res.json(data);
        }
      }
    });
  }, function(error) {
    console.log(error);
  });
}

var appindex = function(req, res) {
    res.render('index');
};

/* this route configuration is needed as we are using jade files */
var partials = function partials(req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

/* making both the app and api functions available via exports
*/
module.exports = {
    app: {
        index: appindex,
        partials: partials
    },
    api : {
        index: apiindex,
        getsinglequote: apisinglequote,
        imagedata: apiimagedata,
        update: apiupdate,
        search: apisearch,
        semantic: apisemantic
    }
};
