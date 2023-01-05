const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

const SortMiddleware = require('./app/middlewares/SortMiddleware');

//Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

// use Middle
app.use(
    express.urlencoded({
        extended: true,
    }),
); // khi gửi = <Form>
app.use(express.json()); // khi xài fetch || axios |\...

app.use(methodOverride('_method'));

/// Logged
app.use(morgan('combined'));

//Template engine
var hbs = handlebars.create({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
        sortable: (field, sort) => {
            const sortType = field === sort.column ? sort.type : 'default';

            const icons = {
                default: 'oi oi-elevator',
                asc: 'oi oi-sort-ascending',
                desc: 'oi oi-sort-descending',
            };
            const types = {
                default: 'desc',
                asc: 'desc',
                desc: 'asc',
            };
            const icon = icons[sortType];
            const type = types[sortType];

            return `<a href="?_sort&column=${field}&type=${type}">
                        <span class="${icon}"></span>
                    </a>`;
        },
    },
});
app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'resources', 'views'));

//Custom middleware
app.use(SortMiddleware);

//Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
