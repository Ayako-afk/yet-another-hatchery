const fetch = require("node-fetch");

async function dragonInfo(code) {
    const res = await fetch(`https://dragcave.net/api/v2/dragon/${code}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.code) return null;

    return {
        views: parseInt(data.views),
        uniqueViews: parseInt(data.uniqueviews),
        clicks: parseInt(data.clicks),
        type: data.stage === "Hatchling" ? "hatchling" : "egg",
        hoursRemaining: parseInt(data.hoursuntilgrowth),
        sick: data.sick === true
    };
}

function getScore(dragon) {
    return dragon.views + (dragon.uniqueViews * 6) + (dragon.clicks * 12);
}

const nextStageAge = 72;
const maxTime = 168;

function getOptimalScore(dragon) {
    const time = dragon.hoursRemaining;
    const age = maxTime - time;
    if (dragon.type === "hatchling") {
        return 5000 + (8000 * (age / nextStageAge));
    } else {
        return 5000 * (age / nextStageAge);
    }
}

function getScoreRatio(dragon) {
    return getScore(dragon) / getOptimalScore(dragon);
}

function isSafe(dragon) {
    return getScoreRatio(dragon) < 1.5;
}

module.exports = {
    info: dragonInfo,
    getOptimalScore,
    getScore,
    isSafe,
    getScoreRatio
};
