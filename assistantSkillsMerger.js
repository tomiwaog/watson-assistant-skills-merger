function combineWatsonSkills(file11, file22) {
    //Expected inputs are fileName/location
    var file1 = file11; var file2 = file22;
    var combinedJSON = mergeIntentsAndEntities(file1, file2);
    var indexOfAppend = searchNodeByTitle(file1, "Anything else");
    combileDialogNodes(file1, indexOfAppend, file2);
    var outputSkillName = updateMergedSkillProp(file1.name, file2.name, "skillname");
    var outputSkillDesc = updateMergedSkillProp(file1.description, file2.description, "description");
    combinedJSON.name = outputSkillName; //Update new skill name before writing to file
    combinedJSON.description = outputSkillDesc;
    writeToFile(combinedJSON, outputSkillName);
    return file2;
}

function mergeIntentsAndEntities(file1, file2) {
    //Expected inputs are json
    var intentsArr2 = file2.intents;
    var entitiesFile2 = file2.entities;
    var tempHashMap = {};
    //Add skills and entities from Skill2 to skill1
    //This currently doesn't cater for clashes
    var intentsInFile1 = file1.intents; //Arrays on File1 intents
    var entitiesInFile1 = file1.entities; //Arrays on File1 intents

    for (intentObject in intentsInFile1) { //Copies each intents into temp hash
        var intentName = intentsInFile1[intentObject].intent;
        // console.log(intentName);
        tempHashMap[intentName] = intentName;
    }
    for (intentObject in intentsArr2) {
        var intentName = intentsArr2[intentObject].intent;
        if (!tempHashMap[intentName]) { //Avoid duplicate intents
            // console.log(intentName+ " doesnt exist and added!")
            file1.intents.push(intentsArr2[intentObject]); //adds intents from Skills2 to Skill1
        }
    }

    tempHashMap = {};
    for (entityObject in entitiesInFile1) { //Copies each intents into temp hash
        var entityName = entitiesInFile1[entityObject].entity;
        tempHashMap.enitityName = entityName;
    }
    for (entityObject in entitiesFile2) {
        var entityName = entitiesInFile1[entityObject].entity;
        if (!tempHashMap.entityName)
            file1.entities.push(entitiesFile2[entityObject]); //adds entities from Skills2 to Skill
    }
    // console.log(file1);
    return file1;
}

function searchNodeByTitle(jsonToSearch, searchValue) {
    //Expected inputs are json
    var dialogueNodeFile = jsonToSearch.dialog_nodes;
    for (eachNode in dialogueNodeFile) {
        var currentNode = dialogueNodeFile[eachNode];
        if (currentNode.title === searchValue)
            return eachNode;
    }
    return -1;
}

function findFirstDialogNodeLoc(jsonToSearch) {
    var dialogueNodeFile = jsonToSearch.dialog_nodes;
    for (eachNode in dialogueNodeFile) {
        var currentNode = dialogueNodeFile[eachNode];

        if (currentNode.previous_sibling || currentNode.parent)
            continue;
        else {
            // console.log(dialogueNodeFile[eachNode].title);
            return eachNode;
        }
    }
    return -1;
}

function findLastDialogNode(jsonToSearch) {
    return -1;
}
function deleteNode(jsonToDeleteFrom, nodeIndexToDelete) {
    if (!nodeIndexToDelete) {
        jsonToDeleteFrom.dialog_nodes.pop();
        // console.log(jsonToDeleteFrom.dialog_nodes);
    } else {
        // console.log(jsonToDeleteFrom.dialog_nodes);
        var removedNode = jsonToDeleteFrom.dialog_nodes.splice(nodeIndexToDelete, 1);
        // console.log(removedNode);
        // console.log(removedNode.title + " was removed from DialogNodes")
    }
}

function combileDialogNodes(file1, indexofAppend, file2) {
    //indexOfAppend is the index of Anything else or last element
    //Expected inputs are json
    var nodeBeforeTargetDelete = file1.dialog_nodes[indexofAppend].previous_sibling; //Temp Storage
    console.log("Previous item to be preserved: " + nodeBeforeTargetDelete);

    deleteNode(file1, indexofAppend); //Deletes the Anything else /lastNode

    //Logs all current dialogueNodes in HashMap
    var tempHashMapDiagNodes = {};
    var diaNodesInFile1 = file1.dialog_nodes; //Arrays on File1 dialogNodes
    for (node in diaNodesInFile1) //Keep track of all dialog nodes in file1
        tempHashMapDiagNodes[diaNodesInFile1[node].dialog_node] = diaNodesInFile1[node].dialog_node;
    // console.log(tempHashMapDiagNodes);

    var firstNodeInFile2 = findFirstDialogNodeLoc(file2); //gets location of first Node in file2 for MERGE

    console.log("first Node in FIle2-> " + file2.dialog_nodes[firstNodeInFile2].title);

    var renamedNodesMap = {};
    var dialogNodes2 = file2.dialog_nodes; //SecondObject
    for (dialogNode in dialogNodes2) { //Iterating File2
        var currentNode = dialogNodes2[dialogNode];
        //Update CurrentNode Parent and/or siblings
        if (tempHashMapDiagNodes[currentNode.parent]) {

            if (renamedNodesMap[currentNode.parent]) //If already renamed use, otherwise create
                currentNode.parent = renamedNodesMap[currentNode.parent];
            else
                currentNode.parent = currentNode.parent + '_1';
            // console.log("Yes " + currentNode.dialog_node + " has  parent " + currentNode.parent)
        }
        else if (tempHashMapDiagNodes[currentNode.previous_sibling]) {

            if (renamedNodesMap[currentNode.previous_sibling]) //If already renamed use, otherwise create
                currentNode.previous_sibling = renamedNodesMap[currentNode.previous_sibling];
            else
                currentNode.previous_sibling = currentNode.previous_sibling + '_1';

            // console.log("Yes " + currentNode.dialog_node + " has  previous node " + currentNode.previous_sibling);
        }
        if (tempHashMapDiagNodes[currentNode.dialog_node]) {
            console.log("\nFound " + currentNode.title + " to be conflicting");
            //If current Node in file2 is a conflict, update it and push to file1
            // console.log("Yes "+ currentNode.dialog_node + " is a conflict!");
            if (renamedNodesMap[currentNode.dialog_node]) //If already renamed use, otherwise create
                currentNode.dialog_node = renamedNodesMap[currentNode.dialog_node];
            else
                currentNode.dialog_node = currentNode.dialog_node + '_1';

            console.log("After conflict, NODEID renamed to " + currentNode.dialog_node);
        }
        if (dialogNode == firstNodeInFile2)
            dialogNodes2[dialogNode].previous_sibling = nodeBeforeTargetDelete;     //i.e. Last of File1 + first of File2
        file1.dialog_nodes.push(currentNode);

    }

    // console.log(renamedNodesMap);
    // file1.name = file1.name + "-" + file2.name;
    return file1;
}

function writeToFile(jsonData, outputFileName, fileType) {
    var fs = require('fs');

    if (!fileType || fileType === "json") //If unset or partially set (without .)
        fileType = ".json"

    if (fileType === ".json") {
        fs.writeFile(outputFileName + fileType, JSON.stringify(jsonData), function (err) {
            if (err) throw err;
            console.log('\n*** Writing Merged Output to file!');
            console.log("*** Generated Output filename: '" + outputFileName+".json'");
            console.log("*** Merging Completed!!!");
        }
        );
    } else
        console.log("NO files generated! Currently only support JSON output !!!");
}

function updateMergedSkillProp(skill1, skill2, updateType) {//Accomodate Watson's 64 max character skillname length
    if (updateType === "skillname") maxLength = 64;
    if (updateType === "description") maxLength = 128;

    if ((skill1.length + skill2.length) > (maxLength - 7)) //Factoring space for "MERGED" text
        skill1 = skill1.substring(0, (maxLength - 7) / 2); //Halfs the length skill1 to accomodate skill2 

    var updatedText = ("MERGED_" + skill1 + "__" + skill2).substring(0, maxLength);
    // console.log("After '" + updateType + "' property update, property length = " + updatedText.length);
    return updatedText;
}


//Test Module
// var file1 = require('./sample-skills-files/skill-HR-PROD');
// var file2 = require('./sample-skills-files/skill-Jack-Jack');
// combineWatsonSkills(file1, file2);

module.exports = combineWatsonSkills;