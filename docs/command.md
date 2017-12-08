#Intro
    A command always started by ">"
#Property Command
    Get value of any properties, such as request information and result.
    ##Format:
        >/property/./key/
    ##Result
        Get scrapped result
        ###Format
            >result
            >result.<key>
    ##Request
        Get request information
        ###Format
            >request
    ##Enumerator
        Get current enumerated item
        ###Format
            >enumerator
#Module Command
    Execute some modules.
    ##Format:
        >/Module/./Function/ /Argument/
    ##Input
        Return a data which identified by key stored in input field (see request.readme)
        ###Format
            Independent: >Input /key/
            Dependent: any_string *>Module.input /key/* any_string
    ##Random
        ###Format:
            >Random./Type/ /Length/
        ###Type
            alpha
                return random alphabet
            numeric
                return random number
            alphanumeric
                return random alphanumeric
        ###Length
            Length of generated random string
#Selector command
    *see selector.md