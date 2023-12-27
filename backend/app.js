const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./users');
const channelRoutes = require('./channels');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const repliesRoutes = require('./replies');
const searchRoutes = require('./search');


const app = express();

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'),
//     function(err) {
//         if (err) {
//             res.status(500).send(err)
//         }
//     }    
//     );
// })

app.use(bodyParser.json());
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true,
    }
));

app.use('/users', userRoutes);
app.use('/channels', channelRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/replies', repliesRoutes);
app.use('/search', searchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));