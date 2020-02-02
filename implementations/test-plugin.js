function* autoGenerateFiniteCombinationTable(...them) {
    const size = them.length;

    if (size === 0) {
        //       console.warn(`Input 'size' must be equal to or smaller than the number of 'them' inputs.`);
        yield [];
    } else {
        for (let i = 0; i < them.length; i++) {
            for (const each of autoGenerateFiniteCombinationTable(...them.slice(0, i), ...them.slice(i + 1)))
                yield [them[i], ...each]
        }
    }
}

function* generateInfiniteCombinationTable(size, ...them) {
    if (size === 0) {
        yield [];
    } else {
        for (const each of them) {
            for (const combination of generateInfiniteCombinationTable(size - 1, ...them)) {
                yield [each, ...combination];
            }
        }
    }
}
const operators = [
    '+',
    '-',
    '*',
    '/',
    // '^',
    // '%'
];

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    // '^': (a, b) => a ** b,
    // '%': (a, b) => a % b,
};

const operatorCombinations = new Set(generateInfiniteCombinationTable(2, ...operators));
const variableOrders = new Set(autoGenerateFiniteCombinationTable('x', 'y', 'z'));
const operationDictionary = new Map;
//const operationCombinations = new Set(
[...getVariations(operatorCombinations, variableOrders, operationDictionary)] //);
const solutions = new Map;

function createTranslator(Operators) {
    let i;
    return function t(it) {
        i = 0;
        return s(it);
    }

    function s(it) {
        if (typeof it === 'string') return it;
        if (typeof it === 'object') return {
            Operator: Operators[i++],
            Operands: it.map(s)
        }
    }

}

function* getVariations(operatorCombinations, variableOrders, operationDictionary) {
    for (const operatorCombination of operatorCombinations) {
        for (const variableOrder of variableOrders) {

            if (!operationDictionary.has(operatorCombination))
                operationDictionary.set(operatorCombination, new Map)
            if (!operationDictionary.get(operatorCombination).has(variableOrder))
                operationDictionary.get(operatorCombination).set(variableOrder, new Set);

            for (const Operators of autoGenerateFiniteCombinationTable(...operatorCombination)) {
                const t = createTranslator(Operators);
                for (const group of selectn(...variableOrder)) {
                    let i = 0;

                    const operationCombination = t(group);

                    operationDictionary
                        .get(operatorCombination)
                        .get(variableOrder)
                        .add(operationCombination);

                    yield operationCombination;
                }
            }
        }
    }
}

const questions = new Set;
const answers = new Map;

for (let x = 2; x < 7; x++)
    for (let y = 2; y < 7; y++)
        for (let z = 2; z < 7; z++) {
            questions.add({
                x,
                y,
                z
            });
        }

for (const operatorCombination of operatorCombinations) {
    const [f, g] = operatorCombination;
    for (const question of questions) {
        const {
            x,
            y,
            z
        } = question;

        const answer = fgxyz(f, g, x, y, z);

        if (!answers.has(operatorCombination))
            answers.set(operatorCombination, new Map);

        answers.get(operatorCombination).set(question, answer);
    }
}
for (const operatorCombination of operatorCombinations) {
    for (const variableOrder of variableOrders) {
        if (!solutions.has(operatorCombination))
            solutions.set(operatorCombination, new Set);

        for (const operation of operationDictionary.get(operatorCombination).get(variableOrder)) {
            // console.log(operation);
            if ([...questions].map(question => getParser(operation)(question) === answers.get(operatorCombination).get(question)).every(items => items === true)) {
                solutions.get(operatorCombination).add(operation);
            }
        }
    }
}

for (const [operatorCombination, operatorCombinationSolutions] of solutions) {
    console.log(operatorCombination, operatorCombinationSolutions);
    // console.log(operatorCombination, JSON.stringify({
    //             key: operatorCombination, value: [...operatorCombinationSolutions] })) //.map(operatorCombinationSolution => JSON.stringify(operatorCombinationSolution)));
    // for (const operatorCombinationSolution of operatorCombinationSolutions) {
    //     console.log(operatorCombination, JSON.stringify(operatorCombinationSolution))
    // }
}

function getVariables(operation) {
    const variables = new Set;
    for (const operand of operation.Operands) {
        if (typeof operand === 'string')
            variables.add(operand);
        if (typeof operand === 'object') {
            for (const variable of getVariables(operand))
                variables.add(variable);
        }
    }
    return variables;
}

function getOperators(operation) {
    const operators = [];
    operators.push(operation.Operator);

    for (const operand of operation.Operands) {
        if (typeof operand === 'object') {
            for (const operator of getOperators(operand))
                operators.push(operator);
        }
    }
    return operators;
}

function getParser(operation) {
    function createContext(variables) {
        function parse(op, vars) {
            // console.log(op);
            if (typeof op === 'string')
                return vars[op];
            if (typeof op === 'object')
                return operations[op.Operator](parse(op.Operands[0], vars), parse(op.Operands[1], vars));
        }
        return parse(operation, variables);
    }
    return createContext;
}

function toString(it) {
    if (typeof it === 'string') return it;

    const $0 = typeof it.Operands[0] === 'string' ? it.Operands[0] : `(${toString(it.Operands[0])})`
    const $1 = typeof it.Operands[1] === 'string' ? it.Operands[1] : `(${toString(it.Operands[1])})`

    return `${$0} ${it.Operator} ${$1}`;
}

function fxy(f, x, y) {
    if (f === '+') return x + y;
    if (f === '-') return x - y;
    if (f === '*') return x * y;
    if (f === '/') return x / y;
    if (f === '^') return x ** y;
    if (f === '%') return x % y;
}

function fgxyz(f, g, x, y, z) {
    if (f === '+' && g === '+') return x + y + z;
    if (f === '+' && g === '-') return x + y - z;
    if (f === '+' && g === '*') return x + y * z;
    if (f === '+' && g === '/') return x + y / z;
    if (f === '+' && g === '^') return x + y ** z;
    if (f === '+' && g === '%') return x + y % z;

    if (f === '-' && g === '+') return x - y + z;
    if (f === '-' && g === '-') return x - y - z;
    if (f === '-' && g === '*') return x - y * z;
    if (f === '-' && g === '/') return x - y / z;
    if (f === '-' && g === '^') return x - y ** z;
    if (f === '-' && g === '%') return x - y % z;

    if (f === '*' && g === '+') return x * y + z;
    if (f === '*' && g === '-') return x * y - z;
    if (f === '*' && g === '*') return x * y * z;
    if (f === '*' && g === '/') return x * y / z;
    if (f === '*' && g === '^') return x * y ** z;
    if (f === '*' && g === '%') return x * y % z;

    if (f === '/' && g === '+') return x / y + z;
    if (f === '/' && g === '-') return x / y - z;
    if (f === '/' && g === '*') return x / y * z;
    if (f === '/' && g === '/') return x / y / z;
    if (f === '/' && g === '^') return x / y ** z;
    if (f === '/' && g === '%') return x / y % z;

    if (f === '^' && g === '+') return x ** y + z;
    if (f === '^' && g === '-') return x ** y - z;
    if (f === '^' && g === '*') return x ** y * z;
    if (f === '^' && g === '/') return x ** y / z;
    if (f === '^' && g === '^') return x ** y ** z;
    if (f === '^' && g === '%') return x ** y % z;

    if (f === '%' && g === '+') return x % y + z;
    if (f === '%' && g === '-') return x % y - z;
    if (f === '%' && g === '*') return x % y * z;
    if (f === '%' && g === '/') return x % y / z;
    if (f === '%' && g === '^') return x % y ** z;
    if (f === '%' && g === '%') return x % y % z;
}

function fghabcd(f, g, h, a, b, c, d) {
    if (f === '+') {
        if (g === '+') {
            if (h === '+') return a + b + c + d;
            if (h === '-') return a + b + c - d;
            if (h === '*') return a + b + c * d;
            if (h === '/') return a + b + c / d;
        }
        if (g === '-') {
            if (h === '+') return a + b - c + d;
            if (h === '-') return a + b - c - d;
            if (h === '*') return a + b - c * d;
            if (h === '/') return a + b - c / d;
        }
        if (g === '*') {
            if (h === '+') return a + b * c + d;
            if (h === '-') return a + b * c - d;
            if (h === '*') return a + b * c * d;
            if (h === '/') return a + b * c / d;
        }
        if (g === '/') {
            if (h === '+') return a + b / c + d;
            if (h === '-') return a + b / c - d;
            if (h === '*') return a + b / c * d;
            if (h === '/') return a + b / c / d;
        }
    }
    if (f === '-') {
        if (g === '+') {
            if (h === '+') return a - b + c + d;
            if (h === '-') return a - b + c - d;
            if (h === '*') return a - b + c * d;
            if (h === '/') return a - b + c / d;
        }
        if (g === '-') {
            if (h === '+') return a - b - c + d;
            if (h === '-') return a - b - c - d;
            if (h === '*') return a - b - c * d;
            if (h === '/') return a - b - c / d;
        }
        if (g === '*') {
            if (h === '+') return a - b * c + d;
            if (h === '-') return a - b * c - d;
            if (h === '*') return a - b * c * d;
            if (h === '/') return a - b * c / d;
        }
        if (g === '/') {
            if (h === '+') return a - b / c + d;
            if (h === '-') return a - b / c - d;
            if (h === '*') return a - b / c * d;
            if (h === '/') return a - b / c / d;
        }
    }
    if (f === '*') {
        if (g === '+') {
            if (h === '+') return a * b + c + d;
            if (h === '-') return a * b + c - d;
            if (h === '*') return a * b + c * d;
            if (h === '/') return a * b + c / d;
        }
        if (g === '-') {
            if (h === '+') return a * b - c + d;
            if (h === '-') return a * b - c - d;
            if (h === '*') return a * b - c * d;
            if (h === '/') return a * b - c / d;
        }
        if (g === '*') {
            if (h === '+') return a * b * c + d;
            if (h === '-') return a * b * c - d;
            if (h === '*') return a * b * c * d;
            if (h === '/') return a * b * c / d;
        }
        if (g === '/') {
            if (h === '+') return a * b / c + d;
            if (h === '-') return a * b / c - d;
            if (h === '*') return a * b / c * d;
            if (h === '/') return a * b / c / d;
        }
    }
    if (f === '/') {
        if (g === '+') {
            if (h === '+') return a / b + c + d;
            if (h === '-') return a / b + c - d;
            if (h === '*') return a / b + c * d;
            if (h === '/') return a / b + c / d;
        }
        if (g === '-') {
            if (h === '+') return a / b - c + d;
            if (h === '-') return a / b - c - d;
            if (h === '*') return a / b - c * d;
            if (h === '/') return a / b - c / d;
        }
        if (g === '*') {
            if (h === '+') return a / b * c + d;
            if (h === '-') return a / b * c - d;
            if (h === '*') return a / b * c * d;
            if (h === '/') return a / b * c / d;
        }
        if (g === '/') {
            if (h === '+') return a / b / c + d;
            if (h === '-') return a / b / c - d;
            if (h === '*') return a / b / c * d;
            if (h === '/') return a / b / c / d;
        }
    }
}

function* selectn(...items) {
    const groupSize = 2;
    // console.log({items});
    if (items.length === groupSize) yield items;
    for (let i = 1; i < items.length; i++) {
        const a = items.slice(0, i);
        const b = items.slice(i);
        if (a.length === 1) {
            for (const B of selectn(...b)) {
                yield [...a, B];
            }
        }
        if (b.length === 1) {
            for (const A of selectn(...a)) {
                yield [A, ...b];
            }
        }
        if (a.length > 1 && b.length > 1) {
            for (const A of selectn(...a)) {
                for (const B of selectn(...b)) {
                    yield [A, B];
                }
            }
        }
    }
}