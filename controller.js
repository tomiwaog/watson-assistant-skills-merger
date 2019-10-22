var getValidator = require('./filesValidator');
var mergeFiles = require('./assistantSkillsMerger');

function connectFiles(file1,file2){
    getValidator(file1,file2);
    mergeFiles(file1,file2);
}
module.exports = connectFiles;