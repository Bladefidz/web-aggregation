# Job


```
"id" : <job data>
```

### Type
`static`: Only run any given request in request field sequentially.
`enum`: Will enumerate given keyword into each request.


### enumerator

Should be given if you choose `type: enum`.

```
"type": "file",
"path": "../examples/keyword.txt"
```

```
"type": "digit",
"length": 8,
"default": 0,
"from": "100000",
"to": "100010"
```


### Request

Given request's id to execute.

```
"id": {
	"fill": {
		"key": "val"
	}
}
```

### Output

Specify output engine to use

```
"type": "csv/json/text/stdout",
"name": "filename",
"format": {
	"header": "value"
}
```

### Priority

`low`, `normal`, `high`


## Delay

Give delay time in second for each request.


## Thread

Number of request to be running in one call.

## Status

`0`: disable

`1`: enable