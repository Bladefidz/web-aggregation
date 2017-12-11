# Selector



## Command (string)

```
/Processor/ | /Post processors/
```


## Processor
```
>/Response/.<keys>
```


### Response

Which part of response will be filtered and processed

Available: header, html, json


#### Header

```
>Header./field/
```

For example you want to get response cookie.


#### JSON

```
>Json./query/
```

This command follow 'json-query' module (https://www.npmjs.com/package/json-query).


#### HTML

```
>Html./query/
```

This command follow 'jsonframe-cheerio' module  [jsonframe-cheerio](https://github.com/gahabeen/jsonframe-cheerio



## Post processor


### Sort

```
sort <key>
```

Sort given data by key


### Distinct

```
distinct <key>
```

Distinct given data by key