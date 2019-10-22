
function validateFile(file){
    var text = JSON.stringify(file);
    var isJson = (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
    return isJson;
}


function validateWASkill(skill){
    //Known /common Watson Assistant Skill properties
    validSkill ={
        hasSkillId: skill.skill_id,
        hasWorkspaceID: skill["workspace_id"],
        hasIntent: skill["intents"]
    }

    //If any of the common properties are missing, then its not a valid Skill
    for (eachPropery in validSkill){
        if (!validSkill[eachPropery]) return false;
    }

    return true;
}

function validateBothFiles (file1, file2){
    var skill1 = file1, skill2 = file2;
    console.log("*** Running validator against files!")
    try{
        if (!validateFile(skill1))
            throw new TypeError('skill1 is not a valid JSON');
        if (!validateFile(skill2))
            throw new TypeError('skill2 is not a valid JSON');
    
        if (!validateWASkill(skill1))
        throw new TypeError('skill1 is not a valid Watson Assistant Skill');
        if (!validateWASkill(skill2))
            throw new TypeError('skill2 is not a valid Watson Assistant Skill');
    
        console.log("*** Validation Check: No Exceptions violated!");
    }
    catch(error){
            console.log("Error message: "+error.message);
    }
}

module.exports = validateBothFiles;