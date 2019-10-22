var getValidator = require('./filesValidator');
var mergeFiles = require('./assistantSkillsMerger');

function connectFiles(filesToMerge){
    var file1 = filesToMerge.file1, file2 = filesToMerge.file2;
    getValidator(file1,file2);
    mergeFiles(file1,file2);
}
module.exports = connectFiles;