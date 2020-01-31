var providedInterface = (file1, file2) => {
    require('./controller')(file1, file2);
};


module.exports = providedInterface;