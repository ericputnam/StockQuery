xquery version "1.0-ml";

import module namespace json="http://marklogic.com/xdmp/json"
 at "/MarkLogic/json/json.xqy";

declare variable $param1 as xs:string external;

let $jsonObj := json:object()

(: get a json array of quotes for the the given stock symbol in the input param :)
let $quoteArray := json:to-array(
  for $i in fn:doc('/stockquote/2015-08-01quote.json')/query/results/quote[cts:contains(Symbol, $param1)]
  order by $i/Date
  return $i
)

let $dummy2 := map:put( $jsonObj, "Symbol", $param1 )
let $dummy2 := map:put( $jsonObj, "Quote", $quoteArray )
return xdmp:to-json($jsonObj)