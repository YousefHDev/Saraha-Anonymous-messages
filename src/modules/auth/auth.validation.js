import Joi from "joi";


export const signup= Joi.object().keys({
    
        username: Joi.string().empty('').default("yesss"),
        email : Joi.string().email({minDomainSegments:2 , maxDomainSegments:3}).required(),
        password : Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),
        confirmationPassword: Joi.string().valid(Joi.ref("password")).required(),
        phone : Joi.string().pattern(new RegExp(/^(\+20|0020)?1[0125][0-9]{8}$/)),
       
    
}).required().options({allowUnknown : false})


export const signup_params= Joi.object().keys({
    
       id: Joi.boolean().required()
    
}).required().options({allowUnknown : false})



export const login= Joi.object().keys({
    
       
        email : Joi.string().email({minDomainSegments:2 , maxDomainSegments:3}).required(),
        password : Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),
        
       
    
}).required().options({allowUnknown : false})