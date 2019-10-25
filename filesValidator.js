
function validateFile(file) {
    var text = JSON.stringify(file);
    var isJson = (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
    return isJson;
}


function validateWASkill(skill) {
    //Known /common Watson Assistant Skill properties
    validSkill = {
        hasSkillId: skill.skill_id,
        hasWorkspaceID: skill["workspace_id"],
        hasIntent: skill["intents"]
    }

    //If any of the common properties are missing, then its not a valid Skill
    for (eachPropery in validSkill) {
        if (!validSkill[eachPropery]) return false;
    }

    return true;
}

function validateBothFiles(file1, file2) {
    // console.log("skill1 intent count: " + file1.intents.length);
    // console.log("skill2 intent count: " + file2.intents.length);
    var skill1 = file1, skill2 = file2;
    console.log("*** Running validator against files!")
    try {
        if (!validateFile(skill1))
            throw new TypeError('skill1 is not a valid JSON');
        if (skill2 && !validateFile(skill2))
            throw new TypeError('skill2 is not a valid JSON');

        if (!validateWASkill(skill1))
            throw new TypeError('skill1 is not a valid Watson Assistant Skill');
        if (skill2 && !validateWASkill(skill2))
            throw new TypeError('skill2 is not a valid Watson Assistant Skill');

        if (!isIntentsEntitiesExceeeded(skill1))
            throw new TypeError('skill1 intents counts exceeds Watsons limit. Limit = 100, Maximum entities limit exceeded. Limit = 25.');

        if (skill2 && !isIntentsEntitiesExceeeded(skill2))
            throw new TypeError('skill2 intents counts exceeds Watsons limit. Limit = 100, Maximum entities limit exceeded. Limit = 25.');
        
            console.log("*** Validation Check: No Exceptions violated!");

    }
    catch (error) {
        console.log("\nError message: " + error.message);
    }
}

function isIntentsEntitiesExceeeded(skill) {
    var skill1IntentsCount = skill.intents.length, skill1EntitiesCount = skill.entities.length;
    if (skill1IntentsCount > 100 || skill1EntitiesCount > 25) {
        console.log("Warning!!! :"+skill.name+ " has intent count: "+ skill1IntentsCount+ " and entity count: "+skill1EntitiesCount);
        return false;
    }
    return true;
}
module.exports = validateBothFiles;