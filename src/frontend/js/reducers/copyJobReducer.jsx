import * as template from 'actions/templateAction.jsx';


const DUMMY_JOBS = [
    {
        'id': 10,
        'start_time': new Date(new Date() - 100000000),
        'finish_time': null,
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'PROGRESS',
        'progress': 45,
    },
    {
        'id': 11,
        'start_time': new Date(new Date() - 100000000),
        'finish_time': null,
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'PROGRESS',
        'progress': 60,
    },
    {
        'id': 12,
        'start_time': new Date(new Date() - 100000000),
        'finish_time': null,
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'PROGRESS',
        'progress': 23,
    },
    {
        'id': 13,
        'start_time': new Date(new Date() - 100000000),
        'finish_time': new Date(),
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'FINISHED',
        'progress': 100,
    },
]

const initialState = {
    jobs: [...DUMMY_JOBS],
};

export default (state=initialState, action) => {
    switch(action.type) {
    default:
        return state;
    }
};
