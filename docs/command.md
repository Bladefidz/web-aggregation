# Command




## Intro

Any commands always started by ">"



## Get Property's Value

Get value of any properties, such as request information and result.

```
>/property/./key/
```


### Result

Get scrapped result

```
>result
>result.<key>
```


### Request

Get request information

```
>request
````


### Enumerator

Get current enumerated item

```
>enumerator
```



## Command Any Modules

```
>/Module/./Function/ /Argument/
```


### Input

Return a data which identified by key stored in input field (see request.readme)

Independent: `>Input /key/`

Dependent: `any_string *>Module.input /key/* any_string`


### Random

```
>Random./Type/ /Length/
```

- Type
    1. alpha

        return random alphabet

    2. numeric

        return random number

    3. alphanumeric

        return random alphanumeric

- Length:

    Length of generated random string



## Selector command

*see selector.md