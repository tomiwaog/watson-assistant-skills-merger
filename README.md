# watson-assistant-skills-merger
Merges 2 Wastson Assistant Skills exported from Watson Assistant without overriding the other. A feature currently not possible with IBM Watson Cloud Assistant Service. Program merges two seperate Watson Skills into One.

# Conflict Resolution
DialogNodes with the same DialogIDs are renamed.
User is expected to manually review the merged Skills upon reupload to IBM Cloud.
Anything_else node may appear twice in Result

# Inputs
Valid JSON files exported from IBM Watson Assistant

# Node Modules
No external NodeModules are required, hence no download or Internet connection required to run program.