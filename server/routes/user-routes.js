const express = require("express");
const router = express.Router();

const AWS = require('aws-sdk');
const awsConfig = { region: 'us-east-2' };
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

// retrieves all the user's thoughts from the thoughts table
router.get('/users', (req, res) => {
    const params = {
        TableName: table,
    };
    // scan returns all items in a table
    dynamodb.scan(params, (err, data) => {
        if (err) {
            res.status(500).json(err); 
        } else {
            res.json(data.Items);
        }
    });
});

router.get('/users/:username', (req, res) => {
    const userName = req.params.username;
    console.log(`Querying for thoughts from ${userName}.`);
    const params = {
        TableName: table,
        // Similar to the WHERE clause in SQL, the KeyConditionExpression property is used to filter the query with an expression
        // The #un and :user symbols are aliases that represent the attribute name and value
        KeyConditionExpression: '#un = :user',
        // the attribute name aliases have the # prefix
        ExpressionAttributeNames: {
            '#un': 'username',
            '#ca': 'createdAt',
            '#th': 'thought',
            "#img": "image" // add the image attribute alias 
        },
        // the value aliases
        ExpressionAttributeValues: {
            ':user': userName,
        },
        // this determines which attributes or columns get returned
        ProjectionExpression: '#un, #th, #ca. #img',
        // which specifies the order for the sort key (descending), default is true which is ascending order
        ScanIndexForward: false,
    };
    dynamodb.query(params, (err, data) => {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            res.status(500).json(err);
        } else {
            console.log("Query suceeded");
            res.json(data.Items);
        }
    });
});

// Create new user
router.post('/users', (req, res) => {
    const params = {
        TableName: table,
        Item: {
            username: req.body.username,
            createdAt: Date.now(),
            thought: req.body.thought,
            image: req.body.image
        },
        };
    dynamodb.put(params, (err, data) => {
        if (err) {
            console.error(
            'Unable to add item. Error JSON:',
            JSON.stringify(err, null, 2),
            );
            res.status(500).json(err); // an error occurred
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
            res.json({ Added: JSON.stringify(data, null, 2) });
        }
    });
});
module.exports = router;