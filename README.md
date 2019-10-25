# watson-assistant-skills-merger
Combines and merges seperate IBM [Watson Assistant](https://cloud.ibm.com/catalog/services/watson-assistant) Dialog Skill into one; integrates intents, entities and dialog contents of one skill with another without one overriding the other.

A feature currently not possible with IBM Watson Cloud Assistant Service. Program merges two seperate Watson Skills into One.

Folder groupings and Dialogue (Dialog Trees with children) are also kept intact.

## Conflict Resolution
DialogNodes with the same DialogIDs are renamed.
All intents are merged into one
User is expected to manually review the merged Skills upon reupload to IBM Cloud.

## Inputs
2 Valid JSON files (possibly exported) from IBM Watson Assistant, JSON file locations to be used as app arguments.

## Node Modules
No external NodeModules are required, hence no download or Internet connection required to run program.
Merges 2 Wastson Assistant Skills exported from Watson Assistant without overriding the other. A feature currently not possible with IBM Watson Cloud Assistant Service

## Error Validation
Validation is done ahead of the skillMerging process.
JSON Format validation checking is done, as well as additional checks to ensure JSON structure follows a typical exported skill from Watson Assistant.

## How it works
1. Check that both skills files are JSON
2. Checks for properties usually found in exported Watson Assistant Skills e.g. workspaceId, skillID etc.
3. Merges Skill2 to Skill1
4. Copy or merge intents and entities in skill1 and skill2
5. Merge Dialogs in skill1 and skill2
5. Rename duplicates/conflicts
6. Generates a newly merged skill which can be reuploaded to IBM Cloud.

## Modules Definition:

assistantSkillsMerger.js - Does the actual merging. one can download the "assistantSkillsMerger.js" and call the "combineWatsonSkills" function to merge 2 seperate Assistant skills.

fileValidator.js - 2 components: 1 validating JSON and the other ensuring Watson skill is valid.

index.js - Application entry point.

controller.js - Act as the application controller/scheduler, runs the validation check, consequently the merger.

## How-To using Node Package Manager (NPM)
1. Create a new js file i.e. myApp.js

2. Create an app
```
var app = require('watson-assistant-skills-merger');
```

3. Set the locations of the files to be merged
```
var file1 = require('./sample-skills-files/skill-SkillOne'); //Location of your skill1
var file2 = require('./sample-skills-files/skill-SkillTwo'); //Location of your skill2
```
4. Call the app main function
```
app(file1, file2);
```
5. install the NPM packages using 
```
npm install --save watson-assistant-skills-merger
```
6. Run your app e.g. "node myApp.js".

Your myApp.js should look identical to the folowing:
```
var app = require('watson-assistant-skills-merger');
var file1 = require('./skill-SkillOne'); //Location of your skill1
var file2 = require('./folder/skill-SkillTwo'); //Location of your skill2
app(file1, file2);
```

## Authors
* **Tomiwa Ogunbamowo** - [Tomiwa's GitHub](https://github.com/tomiwaog)

## Versioning
[SemVer](http://semver.org/) was used for versioning. SemVar Versioning (MAJOR.MINOR.PATCH)