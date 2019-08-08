var https = require("https");
var hostname = "hooks.slack.com";
var path = "/services/TLL9R5H9Q/BLXMRN924/n56j9G1gMSJZIs83J6kbsxOy";
exports.handler = async (event,context) => {
    return new Promise((resolve, reject) => {
        
        var options = {
                method: "POST",
                hostname: hostname,
                path: path,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            
            var req = https.request(options, (res) => {
                console.log("Success");
                resolve('Success');
            });
            
            req.on('error', (e) => {
                console.log("Error: "+ e.message);
                reject(e.message);
            });
            
            var messageText = event.Records[0].Sns.Message;
            req.write(JSON.stringify({ text: messageText }));
            req.end();
    });
};
