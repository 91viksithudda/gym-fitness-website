const https = require('https');

https.get('https://api.ipify.org', (resp) => {
  let data = '';
  
  resp.on('data', (chunk) => {
    data += chunk;
  });
  
  resp.on('end', () => {
    console.log('Your public IP address is:', data);
    console.log('Add this IP to your MongoDB Atlas whitelist:');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Log in to your account');
    console.log('3. Select your cluster');
    console.log('4. Go to Network Access in the left sidebar');
    console.log('5. Click "Add IP Address"');
    console.log('6. Enter this IP address:', data);
    console.log('7. Click "Confirm"');
  });
  
}).on("error", (err) => {
  console.log("Error: " + err.message);
});