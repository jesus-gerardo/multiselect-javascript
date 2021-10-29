export default class Validation{
    validate(prop = {type:String}, newValue, attrib){
        try{
            if(prop.type.name == "Array"){
                let x = new Function(`return ${newValue}`);
                if(prop.type.isArray(x())){
                    return prop.type(...x());
                }
                throw(`La propiedad ${attrib} debe ser un arreglo`)
            }else if(prop.type.name == "Number"){
                if(prop.type.isInteger(JSON.parse(newValue))){
                    return prop.type(JSON.parse(newValue));
                }
                throw(`La propiedad ${attrib} debe ser un número entero`);
            }else if(prop.type.name == "Boolean"){
                return prop.type(JSON.parse(newValue));
            }else if(prop.type.name == "Object"){
                return JSON.parse(newValue) 
            }else if(prop.type.name == "Function"){
                return new Function('select', newValue);
            }else{
                return prop.type(newValue);
            }
        }catch(exception){
            console.error(exception);
        }
    }
}