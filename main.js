const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
/*rl.question("Enter your number in words:", (word : string) => {

    const parser = new Parser();
    console.log(evaluate(parser.parse(word)));

})*/

const units = new Map([
    ["zero", 0],
    ["one", 1],
    ["two", 2],
    ["three", 3],
    ["four", 4],
    ["five", 5],
    ["six", 6],
    ["seven", 7],
    ["eight", 8],
    ["nine", 9],
    ["ten", 10],
    ["eleven", 11],
    ["twelve", 12],
    ["thirteen", 13],
    ["fourteen", 14],
    ["fifteen", 15],
    ["sixteen", 16],
    ["seventeen", 17],
    ["eighteen", 18],
    ["nineteen", 19],
    ["twenty", 20],
    ["thirty", 30],
    ["forty", 40],
    ["fifty", 50],
    ["sixty", 60],
    ["seventy", 70],
    ["eighty", 80],
    ["ninety", 90]

])

function unrecognised(got){

    const suggestion = best_match(got, [...units.keys()]);

    if(suggestion) throw new SyntaxError(`Unrecognised number '${got}'! Did you mean '${suggestion}'?`);
    else throw new SyntaxError(`Unrecognised number '${got}'!`);

}

function levenshtein(str1, str2) {
    const grid = [];
    for (let i = 0; i < str1.length + 1; i++) {
        const row = [];
        for (let j = 0; j < str2.length + 1; j++) {
            row.push(j);
        }
        row[0] = i;
        grid.push(row);
    }
    for (let i = 1; i < str1.length + 1; i++) {
        for (let j = 1; j < str2.length + 1; j++) {
            if (str1[i - 1] == str2[j - 1]) {
                grid[i][j] = grid[i - 1][j - 1];
            }
            else {
                grid[i][j] = 1 + Math.min(grid[i - 1][j - 1], grid[i][j - 1], grid[i - 1][j]);
            }
        }
    }
    return grid[str1.length][str2.length];
}
function suggest(input, candidate) {
    if (!input || !candidate) {
        return null;
    }
    const distance = levenshtein(input.toUpperCase(), candidate.toUpperCase());
    const threshold = Math.min(Math.floor(input.length / 2), 3);
    if (distance <= threshold || (input.toUpperCase() == candidate.toUpperCase())) {
        return candidate;
    }
    else {
        return null;
    }
}
function best_match(input, candidates) {
    const data = new Map();
    let foundmatch = false;
    for (const name of candidates) {
        if (suggest(input, name)) {
            data.set(levenshtein(input, name), name);
            foundmatch = true;
        }
    }
    if (foundmatch) {
        const chosenKey = Math.min(...data.keys());
        const chosen = data.get(chosenKey);
        return chosen;
    }
    else {
        return null;
    }
}


function parse(str){

    if(!str || str.trim() == '' || str.length == 1) return 0;

    str = str
    .replace(" and ", ' ')
    .replace(' a ', "")
    .replace('-', ' ')
    .split(" ").filter(word => word.trim() !== "").join(' ');

    const l = ["hundred", "thousand", "million"];

    if(str.startsWith("minus")){

        return -parse(str.slice(-(str.length - 5)).trim());

    }
    else if(str.split(" ").includes("point")){

        const mod = parse(str.split("point")[0].trim());
        const literal = str.split("point")[1].trim().split(" ").map(wrd => units.get(wrd)).map(String).join('');

        return parseFloat(String(mod) + '.' + literal);

    }
    else if(str.split(" ").length == 1){

        if(![...units.keys()].includes(str)) unrecognised(str);
        else return units.get(str);

    }
    else if(str.split(" ").length == 2 && !str.split(" ").some(word => l.includes(word))){

        const tens = str.split(" ")[0].trim();
        const ones = str.split(" ")[1].trim();

        function set_num(key){

            if(![...units.keys()].includes(key)) unrecognised(key);
            else return units.get(key);

        }

        let t_val = set_num(tens);
        const u_val = set_num(ones);


        return t_val + u_val;

    }

    else if(str.split(" ").includes("million")){

        const mil = parse(str.split("million")[0].trim());
        const nxt = parse(str.split("million")[1].trim());

        if(!(1 <= mil && mil <= 999999)) throw new RangeError("Millions value must be between 1 and 999999 inclusive!");

        return (mil * 1000000) + nxt;

    }
    else if(str.split(" ").includes("thousand")){

        const thou = parse(str.split("thousand")[0].trim());
        const nxt = parse(str.split("thousand")[1].trim());

        if(!(1 <= thou && thou <= 999)) throw new RangeError("Thousands value must be between 1 and 999 inclusive!");

        return (thou * 1000) + nxt;

    }
    else if(str.split(" ").includes("hundred")){



        const hund = parse(str.split("hundred")[0].trim());

        if(!(1 <= hund && hund <= 9)) throw new RangeError("Hundreds value must be between 1 and 9 inclusive!");

        const nxt = parse(str.split("hundred")[1].trim());

        return (hund * 100) + nxt;

    }

    else return 0;


}

//Enter "node ./evaluator.js" in terminal to run


begin();


function begin() {

    rl.question("Enter a number in english, or 'quit' to quit: ", (input) => {

        if (input.trim().toLowerCase() === "quit") {
            console.log("Goodbye.");
            rl.close();
            return;
        }



        console.log(parse(input));

        begin();
    });

}