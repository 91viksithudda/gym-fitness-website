const bcrypt = require('bcryptjs');

const password = 'password123';

bcrypt.genSalt(10)
  .then(salt => {
    return bcrypt.hash(password, salt);
  })
  .then(hash => {
    console.log('Generated hash for "password123":', hash);
  })
  .catch(err => {
    console.error('Error generating hash:', err);
  });