var AWS = require("aws-sdk");
var messageSubject = "SysOps - Alert - VPC Change Notification";
var messageData = "Hey SysAdmin! The system detected that some changes on VPC occurred. Check to see if everything is right: \n";
var TopicArn = process.env.TopicArn;

exports.handler = async (event,context) => {
    var records;
    records = event;
    
    records = records.Records
                .filter(function(record) {
                    return record.eventName.match(/vpc+/i) || (record.eventSource == "s3.amazonaws.com" && record.requestParameters.bucketName == "bucket-bruno-trail-watch");
                });;

    if(records != null && records.length >0){

        var sns = new AWS.SNS({
            apiVersion: '2010-03-31',
            region: "us-west-2"
        });
        
        var messageInfo = "";
        
        records.forEach(function(rec){
            messageInfo += rec.eventName + " - " +  rec.eventSource + " - " +  rec.eventTime + " \n";    
        });
        
        var params = {
            Message: messageData + messageInfo, 
            Subject: messageSubject,
            TopicArn: TopicArn
        };
        
        console.log('Publishing');
        sns.publish(params, context.done);
        
        
        return sns.publish(params).promise()
        .then(() => ({statusCode: 204, body: ''}))
        .catch(err => {
            console.log(err);
            return {statusCode: 500, body: 'sns-error'};
        });
    }
    
    return Promise.resolve({statusCode: 400, body: 'invalid'});
};