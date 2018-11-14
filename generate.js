const { NeuralNetwork } = require('brain.js');
const axios = require('axios');
const { writeFileSync } = require('fs');

let request = axios.create({
    headers: {
        common: { 'X-Auth-Token': '1f0b613e3073460b8fbcdfd0c8b6f243' }
    }
});

const run = (async () => {
    const { data } = await request.get('http://api.football-data.org/v2/competitions/2021/matches');
    const newData = data.matches.filter((match) => match.matchday < match.season.currentMatchday)
        .map((match) => ({
            input: {
                [match.homeTeam.name]: 1,
                [match.awayTeam.name]: 0,
            },
            output: {
                [match.score.fullTime.homeTeam === match.score.fullTime.awayTeam ? 'draw' : (match.score.fullTime.homeTeam > match.score.fullTime.awayTeam ? 'home' : 'away')]: 1,
            },
        }));

    const fixtures = data.matches.filter((match) => match.matchday === match.season.currentMatchday);
    const network = new NeuralNetwork({
        iterations: 20000,    // the maximum times to iterate the training data --> number greater than 0
        errorThresh: 0.005,   // the acceptable error percentage from training data --> number between 0 and 1
        logPeriod: 10,        // iterations between logging out --> number greater than 0
        learningRate: 0.1,    // scales with delta to effect training rate --> number between 0 and 1
        momentum: 0.3,        // scales with next layer's change value --> number between 0 and 1
        callback: null,       // a periodic call back that can be triggered while training --> null or function
        callbackPeriod: 10,   // the number of iterations through the training data between callback calls --> number greater than 0
        timeout: Infinity     // the max number of milliseconds to train for --> number greater than 0
    });
    network.train(newData);

    const runData = fixtures.map((fixture) => ( {fixture, input: {[fixture.homeTeam.name]: 1, [fixture.awayTeam.name]: 0 }}))
    const results = runData.map(item => ({
        fixture: item.fixture,
        prediction: network.run(item.input),
    }));

    writeFileSync(`./data/${data.matches[0].season.currentMatchday}.json`, JSON.stringify(results, null, 2) , 'utf-8');
})();
