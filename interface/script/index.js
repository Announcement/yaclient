$ = function(it) {
    let items;
    let properties;
    let prototypes;
    let current;

    items = document.querySelectorAll(it);

    properties = []
    prototypes = {};

    for (let item of items) {
        for (property in item) {
            properties.push(property)
        }
    }

    properties = properties.filter((value, index, array) => {
        return array.indexOf(value) === index;
    })

    for (let property of properties) {
        define(property)
    }

    current = 0;

    function define(property) {
        Object.defineProperty(prototypes, property, {
            get() {
                let item;
                let that;

                if (current === items.length) {
                    current = 0;
                }

                that = function() {}

                // for (let item of items) {
                //     if (typeof item[property] === 'function') {
                //         item[property].apply(item, arguments);
                //     }
                // }

                that[Symbol.toPrimative] = function(hint) {
                    item = items[current++];
                    that = item[property];
                    return that
                }
                that[Symbol.iterator] = function() {
                    return {
                        next() {
                            let object;
                            let done;
                            let value;

                            object = {};

                            done = current === items.length;

                            if (!done) value = items[current++][property]
                            if (value) object.value = value

                            object.done = done;

                            return object
                        },
                    }
                }

                // that[]

                return that;
            },
            set(value) {
                for (let item of items) {
                    item[property] = value
                }
            }
        })
    }

    return prototypes;
};

$('p').innerHTML = 'content'
try {
    // for (let item of $('option').value) {
    //     console.log(item)
    // }
    console.log('' + $('option').value)
} catch (exception) {
    console.warn(exception);
}

// for (let [k, v] of $('*')) {
//     console.log(k, v)
// }
// console.log([...$('*')])