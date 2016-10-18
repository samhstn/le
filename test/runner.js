// helpers tests
require('./test_helpers/checkUserRegistered.test.js');
require('./test_helpers/checkUserLoggedInWRedis.test.js');
require('./test_helpers/loginUserWRedis.test.js');
require('./test_helpers/registerUser.test.js');
require('./test_helpers/flushDb.test.js');
require('./test_helpers/authenticate.test.js');
require('./test_helpers/createCollection.test.js');
require('./test_helpers/getCollections.test.js');
require('./test_helpers/updateCollection.test.js'); // wip
require('./test_helpers/getWords.test.js'); // wip

// auth tests
require('./server/routes.test.js');
require('./server/login.test.js');
require('./server/register.test.js');
require('./server/logout.test.js');
require('./server/authflow.test.js');

// api
require('./server/collection.test.js');
