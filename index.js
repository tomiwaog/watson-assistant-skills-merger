// var file1 = require('./sample-skills-files/skill-SkillOne'); //Location of your skill1
// var file2 = require('./sample-skills-files/skill-SkillTwo'); //Location of your skill2

var providedInterface = (file1, file2) => {
    require('./controller')(file1, file2);
};

// providedInterface(file1,file2);
module.exports = providedInterface;