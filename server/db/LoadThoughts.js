const AWS = require('aws-sdk');
const fs = require('fs');
const { serialize } = require('v8');

AWS.config.update({region: 'us-east-2'});
// DocumentClient() creates the dynamodb service object
// allows us to use JavaScript Objects as arguments and return native JavaScript type
const dynamodb = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

console.log('Importing user thoughts into DynamoDB');
// The relative path for the fs.readFileSync function is relative to where the file is executed, not the path between files
const allUsers = JSON.parse(fs.readFileSync('./server/seed/user.json', 'utf8'));

allUsers.forEach(user => {
    const params = {
        TableName: "Thoughts",
        Item: {
            "username": user.username,
            "createdAt": user.createdAt,
            "thought": user.thought,
        }
    }
    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Put Item succeeded:", user.username);
        }
    });
});

console.log(allUsers);
