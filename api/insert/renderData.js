
// Добавляем renderData
function renderData(req, res, next) {
    res.renderData = {};
    next();
}

// Добавляем список организаций
function orgs(req, res, next) {
    req.db.collection('orgs').find().toArray((err, orgs) => {
        res.renderData.orgs = orgs;
        next();
    });
}

// Добавляем список пользователей
function users(req, res, next) {
    req.db.collection('users').find().toArray((err, users) => {
        res.renderData.users = users;
        next();
    });
}

// Добавляем список муниципальный образований 
function regions(req, res, next) {
    req.db.collection('regions').find().toArray((err, regions) => {
        res.renderData.regions = regions;
        next();
    });
}

// Добавляем отрасли экономики
function industries(req, res, next) {
    req.db.collection('industries').find().toArray((err, industries) => {
        res.renderData.industries = industries;
        next();
    });
}

// Добавляем стадии проектов
function stages(req, res, next) {
    req.db.collection('stages').find().toArray((err, stages) => {
        res.renderData.stages = stages;
        next();
    });
}

// Добавляем стадии проектов
function statuses(req, res, next) {
    req.db.collection('statuses').find().toArray((err, statuses) => {
        res.renderData.statuses = statuses;
        next();
    });
}

// Добавляем в пользователей их организации
function usersOrg(req, res, next) {
    res.renderData.users = res.renderData.users.map((user) => {
        user.org = res.renderData.orgs.filter((org) => {
            return org._id == user.employer;
        }).pop();
        return user;
    });
    next();
}

// Добавляем текущего пользователя
function loginUser(req ,res, next) {
    res.renderData.loginUser = res.renderData.users.filter((user) => {
        return user._id == req.cookies.user;
    }).pop();
    next();
}

function selectUser(req, res, next) {
    res.renderData.selectUser = res.renderData.users.filter((user) => {
        return user._id == req.params.id;
    }).pop();
    next();
}

module.exports = {
    renderData,
    orgs,
    users,
    stages,
    regions,
    usersOrg,
    statuses,
    loginUser,
    selectUser,
    industries
    
}
