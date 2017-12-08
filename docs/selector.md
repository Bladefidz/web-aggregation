## Command (string)
Format
    ```
    /Processor/ | /Post processors/
    ```
## Processor
Format
    ```
    >/Response/.<keys>
    ```
### Response
    Which part of response will be filtered and processed
    Available: header, html, json
### Keys
#### Header Keys
    For example you want to get response cookie.
    Format
        ```
        >Header./field/
        ```
#### JSON Keys
    This command follow 'json-query' module (https://www.npmjs.com/package/json-query).
    Format
        ```
        >Json./query/
        ```
#### HTML Keys
    This command follow 'jsonframe-cheerio' module  [jsonframe-cheerio](https://github.com/gahabeen/jsonframe-cheerio
    Format
        ```
        >Html./query/
        ```
## Post processor
### Sort
    Sort given data by key
    Format
        ```
        sort <key>
        ```
### Distinct
    Distinct given data by key
    Format
        ```
        distinct <key>
        ```