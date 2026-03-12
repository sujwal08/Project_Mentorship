const axios = require('axios');
axios.post('http://127.0.0.1:5000/api/auth/signup', {
  email: 'testtest@example.com',
  password: 'password123'
}).then(res => console.log(res.data))
  .catch(err => console.error(err.response ? err.response.data : err.message));
