# watson-assistant-skills-merger
Merges 2 Wastson Assistant Skills exported from Watson Assistant without overriding the other. A feature currently not possible with IBM Watson Cloud Assistant Service. Program merges two seperate Watson Skills into One.

# Conflict Resolution
DialogNodes with the same DialogIDs are renamed.
User is expected to manually review the merged Skills upon reupload to IBM Cloud.
Anything_else node may appear twice in Result

# Inputs
2 Valid JSON files exported from IBM Watson Assistant

# Node Modules
No external NodeModules are required, hence no download or Internet connection required to run program.
Merges 2 Wastson Assistant Skills exported from Watson Assistant without overriding the other. A feature currently not possible with IBM Watson Cloud Assistant Service

# Error Validation
Validation is done ahead of the skillMerging process.
JSON Format validation checking is done, as well as additional checks to ensure JSON structure follows a typical exported skill from Watson Assistant.

# How it works
1. Check that both skills files are JSON
2. Checks for properties usually found in exported Watson Assistant Skills e.g. workspaceId, skillID etc.
3. Merges Skill2 to Skill1
4. Copy or merge intents and entities in skill1 and skill2
5. Merge Dialogs in skill1 and skill2
5. Rename duplicates/conflicts
6. Generates a new Skill titiled "MERGE+ skill1 +skill2" which can be reuploaded to IBM Cloud.

# Modules Definition:
Each module can be tested individually.
assistantSkillsMerger.js - Does the actual merging. one can download the "assistantSkillsMerger.js" and call the "combineWatsonSkills" function to merge 2 seperate Assistant skills.
fileValidator.js - 2 components: 1 validating JSON and the other ensuring Watson skill is valid.
index.js - Application entry point.
controller.js - Act as the application controller/scheduler, runs the validation check, consequently the merger.

# Versioning
SemVar Versioning (MAJOR.MINOR.PATCH)