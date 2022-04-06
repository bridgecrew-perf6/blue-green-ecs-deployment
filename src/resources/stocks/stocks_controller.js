const AWS = require('aws-sdk');
const config = require('../../config.js');
const { v1: uuidv1 } = require('uuid');

if(process.env.DEPLOYMENT_TYPE) {
    console.log('DEPLOYMENT_TYPE is set!');
    if (process.env.DEPLOYMENT_TYPE == 'ecs') {
        console.log('Will set the ECS config credentials');
        AWS.config.credentials = new AWS.ECSCredentials({
            httpOptions: {timeout: 5000}, // 5 second timeout
            maxRetries: 10, // retry 10 times
        });
    } 
}
else { 
    console.log('DEPLOYMENT_TYPE env var no set! Skip loading any AWS config.'); 
}



const getStocks = function (req, res) {
    console.log('Start scaning the ', config.aws_table_name, 'table ...');
    AWS.config.update(config.aws_remote_config);

    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: config.aws_table_name
    };

    docClient.scan(params, function (err, data) {

        if (err) {
            console.log(err)
            res.send({
                success: false,
                message: err
            });
        } else {
            const { Items } = data;
            console.log(Items);
            res.send({
                success: true,
                table_items: Items
            });
        }
    });
}

const addStock = function (req, res) {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    console.log("Req: ", req.body);
    const Item = { ...req.body };
    Item.id = uuidv1();
    console.log("Item: ", Item);
    var params = {
        TableName: config.aws_table_name,
        Item: Item
    };

    // Call DynamoDB to add the item to the table
    docClient.put(params, function (err, data) {
        if (err) {
            res.send({
                success: false,
                message: err
            });
        } else {
            res.send({
                success: true,
                message: 'Added stock',
                stock: data.stock,
                storeId: data.storeId
            });
        }
    });
}

module.exports = {
    getStocks,
    addStock
}