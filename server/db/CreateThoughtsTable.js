const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

// we have only defined keys 
const params = {
    TableName: 'Thoughts',
    KeySchema: [
        {AttributeName: 'username', KeyType: 'HASH'}, // Partition Key
        {AttributeName: 'createdAt', KeyType: 'RANGE'} // sort key
    ],
    // This defines the attributes we've used for the hash and range keys and declares their data types
    AttributeDefinitions: [
        // string
        { AttributeName: 'username', AttributeType: 'S' },
        // number
        { AttributeName: 'createdAt', AttributeType: 'N' },
    ],
    // This setting reserves a maximum write and read capacity of the database, which is how AWS factors in pricing.
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
    },
};

dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log(
          'Created table. Table description JSON:', JSON.stringify(data, null, 2));
      }
});