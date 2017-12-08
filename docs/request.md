#Format
    ```
    "id" : <request data>
    ```
#Request Data
    ##input (object)
        Request input which customize your request query field by called using input command
        ###Example
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
    ##url (string)
        Request URL that will be executed by scrapping engine
    ##baseUrl (string)
        Base url that that will be append to before url argument
    ##headers (object)
        Header data that will be passed into request
    ##fillable (array)
        Any extended request arguments that can be modify by job request
    ##method (string)
        Request method (GET, POST, PUT, DELETE, PATCH, etc) that will be executed by scrapping engine
    ##qs (object)
        Query string that will be parsed into request URL via GET request.
        ###Key
            Query string key.
        ###Value (any)
            ####Static (any)
                Static query string value
            ####Dynamic (string)
                Special command that will be modify specific key of query_string value
                #####Format
                    >/Command/
                #####Command
                    >Keyword
                        Parse given key's value with keyword value which defined in keyword collection
                    >Module
                        Parse given key's value with the processing result from module
                        Example:
                            Get random string with 30 length value:
                                >Module:random.string(30)
    ##selector (object)
        ###Key
            ####type (string)
                Selector type that corresponded to response data
                Available: JSON, HTML
            ####data (json)
                Process and parse response body into given key
                #####Key
                    Data container key
                #####Value (string)
                    *see selector.readme