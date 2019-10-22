//Modify line 2 and 3 only
var file1 = require('./sample-skills-files/skill-SkillOne'); //Location of your skill1
var file2 = require('./sample-skills-files/skill-SkillTwo'); //Location of your skill2





var filesToMerge={'file1': file1,'file2': file2};
require('./controller')(filesToMerge);