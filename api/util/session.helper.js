
let _app;
let _session;


module.exports.init = (app, session) => {
    this._app = app;
    this._session = session;
};

/**
 * 
 * @param {*} req the request object
 * @param {*} model the model which was changed
 * 
 * whenever a model is changed, we need to update the collection data and make it dirty. This is to ensure I am not sending collection data back to the client unless I have ot
 */

module.exports.change = (req, model) => {
    if (!req.session.lastUpdated) {
        req.session.lastUpdated = {};
    }

    req.session.lastUpdated[model.name] = new Date();
};


module.exports.collectionDirty = (req, model, lastSent) => {
    if (!req.session.lastUpdated) {
        req.session.lastUpdated = {};
    }

    if (!lastSent || lastSent === '') {
        // seems there was no data sent to client. Invalidate collection
        return true;
    }

    // collection object has a date associated for this model. Now check if this date is newer than the object in collection last modified
    if (req.session.lastUpdated[model.name] > lastSent) {
        // data updated after the last sent, so the collection should be re-initialized
        return true;
    }

    // means last updated <= lastSent
    return false;
}