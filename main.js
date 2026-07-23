const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const wordtonum = require("./wordtonum.js");


//Enter "node ./main.js" in terminal to run


begin();


function begin() {

    rl.question("Enter a number in english, or 'quit' to quit: ", (input) => {

        if (input.trim().toLowerCase() === "quit") {
            console.log("Goodbye.");
            rl.close();
            return;
        }



        console.log(wordtonum.parse(input));

        begin();
    });

}