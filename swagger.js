const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Leader's Quote API",
        description: "World Famous Leaders and Their Quotes, and Current and Potential President of Some Countries API"
    },
    host: "localhost:5050",
    schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endPointFiles = ["./routes/indexroute.js"];


swaggerAutogen(outputFile, endPointFiles, doc);