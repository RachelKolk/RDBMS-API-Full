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


//  <<<<<<<<<<<<<<<<<<<<<<<<  Create Requests  >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//POST to the api/cohorts table
server.post('/api/cohorts', async (req, res) => {
    try {
        if (req.body.name == '' || req.body.name == null) {
            res.status(406).json({message: "Please don't leave the cohort name blank"});
        } else {
            const [id] = await db('cohorts')
            .insert(req.body);

            res.status(201).json(id);
        }

    } catch (error) {
        res.status(500).json({error: "There was an issue with adding that cohort"});
    }
});


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

//GET entries from the api/cohorts and students tables by matching it with cohort id 
//returns a list of students in that particular cohort
server.get('/api/cohorts/:id/students', async (req, res) => {
    try {
        const id = req.params.id
        
        const studentList = await db('students')
        .join('cohorts', 'cohorts.id', 'students.cohortId')
        .select('students.name', 'students.cohortId')
        .where('students.cohortId', id);

        if (studentList.length > 0) {
            res.status(200).json(studentList)
        } else {
            res.status(404).json({message: "That cohort has no students"});
        }

    } catch (error) {
        res.status(500).json({error: "There was an error while retrieving the data"});
    }
});


//  <<<<<<<<<<<<<<<<<<<<<<<<  Update Requests  >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//PUT an updated item into the api/cohorts table - requires id
server.put('/api/cohorts/:id', async (req, res) => {
    try {
        const updates = await db('cohorts')
        .where({id: req.params.id})
        .update(req.body);

        if (updates > 0) {
            const cohort = await db('cohorts')
            .where({id: req.params.id})
            .first()
            res.status(200).json(cohort);
        } else {
            res.status(404).json({message: "That cohort does not exist"});
        }

    } catch (error) {
        res.status(500).json(error);
    }
});


//  <<<<<<<<<<<<<<<<<<<<<<<<  Delete Requests  >>>>>>>>>>>>>>>>>>>>>>>>>>>>

//DELETES an item from the api/cohorts table - requires id
server.delete('/api/cohorts/:id', async (req, res) => {
    try {
        const count = await db('cohorts')
        .where({id: req.params.id})
        .del();

        if (count > 0) {
            res.status(202).json({message: "That cohort has been deleted from the database"});
        } else {
            res.status(404).json({message: "That cohort does not exist"});
        }

    } catch (error) {
        res.status(500).json({message: "An error occurred during deletion"});
    }
});



const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n***<<< Running on ${port} >>>***\n`));