function combineWatsonSkills(file11, file22) {
    //Expected inputs are fileName/location
    var file1 = file11; var file2 = file22;
    var combinedJSON = mergeIntentsAndEntities(file1, file2);
    // var indexOfAppend = searchNodeByTitle(file1, "Anything else");
    var indexOfAppend = findLastDialogNode(file1);
    mergeDialogNodes(file1, indexOfAppend, file2);
    console.log("Merging" + file1.name + " and " + file2.name); 
    var outputSkillName = updateMergedSkillProp(file1.name, file2.name, "skillname");
    var outputSkillDesc = updateMergedSkillProp(file1.description, file2.description, "description");
    combinedJSON.name = outputSkillName; //Update new skill name before writing to file
    combinedJSON.description = outputSkillDesc;

    runOutputFileReport(combinedJSON);
    writeToFile(combinedJSON, outputSkillName);
    return file2;
}

function mergeIntentsAndEntities(file1, file2) {
    //Expected inputs are json
    var intentsArr2 = file2.intents;
    var entitiesFile2 = file2.entities;
    var tempHashMap = {};
    //Add skills and entities from Skill2 to skill1

    var intentsInFile1 = file1.intents; //Arrays on File1 intents
    var entitiesInFile1 = file1.entities; //Arrays on File1 intents

    for (intentObject in intentsInFile1) { //Copies each intents into tempHashMap
        var intentName = intentsInFile1[intentObject].intent;
        tempHashMap[intentName.toLowerCase()] = intentName;
    }

    for (intentObject in intentsArr2) {
        var intentName = intentsArr2[intentObject].intent;
        if (!tempHashMap[intentName.toLowerCase()]) //Avoid duplicate intents, check Cases
            file1.intents.push(intentsArr2[intentObject]); //adds intents from Skills2 to Skill1
    }

    var tempEntityHashMap = {};
    for (entityObject in entitiesInFile1) { //Copies each intents into temp hash
        var entityName = entitiesInFile1[entityObject].entity;
        tempEntityHashMap[entityName.toLowerCase()] = 1; //Anything could be stored here
    }

    for (entityObject in entitiesFile2) {
        var entityName = entitiesFile2[entityObject].entity;
        if (!tempEntityHashMap[entityName.toLowerCase()])
            file1.entities.push(entitiesFile2[entityObject]); //adds entities from Skills2 to Skill
    }
    // console.log(file1);
    return file1;
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
    var hashMapReferredTo = {};
    //Writing to HashMap
    for (i in jsonToSearch.dialog_nodes) {
        if (!(jsonToSearch.dialog_nodes[i].parent)) { //Add all root nodes to Hash
            var prev = jsonToSearch.dialog_nodes[i].previous_sibling; //Add all previous
            // console.log("Previous is "+ prev);
            hashMapReferredTo[prev] = 1; //push all previous item to hashmap
        }
    }
    //Checking for Items not referred to
    for (i in jsonToSearch.dialog_nodes) {
        var dialogNode = jsonToSearch.dialog_nodes[i].dialog_node;
        if (!jsonToSearch.dialog_nodes[i].parent && !hashMapReferredTo[dialogNode]) {
            // console.log("Last Item found " + dialogNode);
            // console.log("it has prev sibling " + jsonToSearch.dialog_nodes[i].previous_sibling);
            // console.log("it has prev parent: " + jsonToSearch.dialog_nodes[i].parent);
            //If Node of the 
            return i;
        }
    }
    return -1;
}

function getUniqueNodeID(listOfKnownNodes, incoming) {
    var renamed = incoming;
    while (listOfKnownNodes[renamed])
        renamed = renamed + '_1';
    // console.log(incoming + " was renamed to " + renamed);
    return renamed;
}

function writeToFile(jsonData, outputFileName, fileType) {
    var fs = require('fs');

    if (!fileType || fileType === "json") //If unset or partially set (without .)
        fileType = ".json"

    if (fileType === ".json") {
        fs.writeFile(outputFileName + fileType, JSON.stringify(jsonData), function (err) {
            if (err) throw err;
            console.log('\n*** Writing Merged Output to file!');
            console.log("Generated Output filename: '" + outputFileName + ".json'");
            console.log("*** Merging Complete !!!");
        }
        );
    } else
        console.log("NO files generated! Currently only support JSON output !!!");
}

function updateMergedSkillProp(skill1, skill2, updateType) { //Naming function for merged File
    //Accomodate Watson's 64 max character skillname length
    if(!skill1) skill1 = "skill1"; if(!skill2) skill2 = "skill2";
    console.log(skill1);
    console.log(skill2);
    if (updateType === "skillname") maxLength = 64;
    if (updateType === "description") maxLength = 128;

    if ((skill1.length + skill2.length) > (maxLength - 7)) //Factoring space for "MERGED" text
        skill1 = skill1.substring(0, (maxLength - 7) / 2); //Halfs the length skill1 to accomodate skill2 

    var updatedText = ("MERGED_" + skill1 + "__" + skill2).substring(0, maxLength);

    // console.log("After '" + updateType + "' property update, property length = " + updatedText.length);
    return updatedText;
}

function runOutputFileReport(combinedJSON) {
    var plan = require('./settings').plan;
    var entityLimit, intentLimit;

    if (plan == "business") {
        intentLimit = 2000;
        entityLimit = 2000;
    } else if (plan == "lite") {
        intentLimit = 100;
        entityLimit = 25;
    }
    console.log("\n*** Running Error report on generated output *** ");

    var uploadViolation = false;
    if (combinedJSON.intents.length > intentLimit) {
        uploadViolation = true;
        console.log("ERROR: Generated file has exceeded intents limit.");
    }
    if (combinedJSON.entities.length > entityLimit) {
        uploadViolation = true;
        console.log("ERROR: Generated file has exceeded entities limit.");
    }
    else if (uploadViolation) {
        console.log("*** Please Note: Output File will be generated, however will not upload in Watson");
    }
}

function mergeDialogNodes(file1, locFile1LastItem, file2) {
    console.log("\n* combining dialog nodes *");
    //indexOfAppend is the index of last element. Expected inputs are json
    var file1LastNodeID = file1.dialog_nodes[locFile1LastItem].dialog_node;
    var file2FirstNodeLoc = findFirstDialogNodeLoc(file2); //gets location of first Node in file2 for MERGE


    var file1DialogNodesArr = file1.dialog_nodes; // File1's dialogNodes Array
    var tempHashMapDiagNodes = {}; //Container for File1's dialogID
    for (var i in file1DialogNodesArr) //Stores each dialogID of firstFile in a tempHashMap
        tempHashMapDiagNodes[file1DialogNodesArr[i].dialog_node] = file1DialogNodesArr[i].dialog_node;
    // console.log("displaying all Nodes: \n" + JSON.stringify(tempHashMapDiagNodes) + "\n"); //DELETE

    var renamedNodesMap = {}; //
    var dialogNodes2 = file2.dialog_nodes; //File2's dialogNodes Array

    for (var i in dialogNodes2) { //Adding DialogNodes from file2 to file1
        var currentNode = dialogNodes2[i];

        if (tempHashMapDiagNodes[currentNode.dialog_node]) {//If item is a conflict, rename and update nodeID
            if (renamedNodesMap[currentNode.dialog_node]) {
                currentNode.dialog_node = renamedNodesMap[currentNode.dialog_node]; //If key already present from previous renaming, use value of key
            }
            else {
                var renamedNode = getUniqueNodeID(tempHashMapDiagNodes, currentNode.dialog_node);
                console.log("\nFound Node " + currentNode.title + " to be conflicting");
                console.log(currentNode.dialog_node + " renamed to " + renamedNode);
                renamedNodesMap[currentNode.dialog_node] = renamedNode; //Add oldName as key and new name as value;
                currentNode.dialog_node = renamedNode; //CurentNode ID is updated to RenamedID
            }
        }
        if (tempHashMapDiagNodes[currentNode.previous_sibling]) {
            if (renamedNodesMap[currentNode.previous_sibling]) {
                currentNode.previous_sibling = renamedNodesMap[currentNode.previous_sibling]; //If key already present from previous renaming, use value of key
            }
            else {
                var renamedNode = getUniqueNodeID(tempHashMapDiagNodes, currentNode.previous_sibling);
                console.log("\nFound Sibling [" + currentNode.parent + "] to be conflicting");
                console.log(currentNode.previous_sibling + " renamed to " + renamedNode);
                renamedNodesMap[currentNode.previous_sibling] = renamedNode; //Add oldName as key and new name as value;
                currentNode.previous_sibling = renamedNode; //CurentNode ID is updated to RenamedID
            }
        }
        if (tempHashMapDiagNodes[currentNode.parent]) {
            if (renamedNodesMap[currentNode.parent]) {
                currentNode.parent = renamedNodesMap[currentNode.parent]; //If key already present from previous renaming, use value of key
            }
            else {
                var renamedNode = getUniqueNodeID(tempHashMapDiagNodes, currentNode.parent);
                console.log("\nFound Parent [" + currentNode.parent + "] to be conflicting");
                console.log(currentNode.parent + " renamed to " + renamedNode);
                renamedNodesMap[currentNode.parent] = renamedNode; //Add oldName as key and new name as value;
                currentNode.parent = renamedNode; //CurentNode ID is updated to RenamedID
            }
        }

        if (i == file2FirstNodeLoc) {
            dialogNodes2[file2FirstNodeLoc].previous_sibling = file1LastNodeID; //Merges firstNod in file2 to 
        }
        file1.dialog_nodes.push(currentNode);
    }
    return file1;
}
module.exports = combineWatsonSkills;