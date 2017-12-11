# Request


```
"id" : <request data>
```


### input (object)

Request input which customize your request query field by called using input command

Example
```
"input": {
    "q": "query",
    "from": "alex"
},
"query_string": {
    "q": ">Input q",
    "info": "Email from *>Input from* have been sent."
},
```


### url (string)

Request URL that will be executed by scrapping engine


### baseUrl (string)

Base url that that will be append to before url argument


### headers (object)

Header data that will be passed into request


### fillable (array)

Any extended request arguments that can be modify by job request


### method (string)

Request method (GET, POST, PUT, DELETE, PATCH, etc) that will be executed by scrapping engine


### qs (object)

Query string that will be parsed into request URL via GET request.


### selector (object)
*see selector.readme