const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
    client: 'sqlite',
    connection: {
        filename: './data/lambda.db3',
    },
    useNullAsDefault: true,
};

const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());


//  <<<<<<<<<<<<<<<<<<<<<<<<  Receive Requests  >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//GET all entries from the api/cohorts table
server.get('/api/cohorts', async (req, res) => {
    try {
        const cohorts = await db('cohorts');
        res.status(200).json(cohorts);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET entries from the api/cohorts table by id
server.get('/api/cohorts/:id', async (req, res) => {
    try {
        const cohort = await db('cohorts')
        .where({id: req.params.id})
        .first();

        if (cohort) {
            res.status(200).json(cohort);
        } else {
            res.status(404).json({message: "A cohort with that id does not exist"})
        }

    } catch (error) {
        res.status(500).json(error);
    }
});



const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n***<<< Running on ${port} >>>***\n`));