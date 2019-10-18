var file1 = require('./sample-skills-files/skill-Jack-Jack'); //Location of your skill1
var file2 = require('./sample-skills-files/skill-SkillTwo'); //Location of your skill2

var main = require('./assistantSkillsMerger');
main(file1,file2);