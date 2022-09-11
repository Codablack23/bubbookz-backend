class Query {
    Model;
    constructor(Model){
     this.Model = Model
    }
    async create(data,key="record"){
     const response = {
        status:"pending"
     }
      try {
        const stats = await this.Model.create(data)
        if(stats) {
           response.status = "success"
           response[key] = data;
        }else{
           response.status = "failed"
           response.error =`couldn't create record ${key}`
        }
      } catch (error) {
        response.status = "500"
        response.error = "an error has occured within our servers please try again later"
      }
      return response
    }
    async read(key,condition){
        const response = {
            status:"pending"
        }
        try {
            response.status = "success"
            response.error = ""
            response[key] = await this.Model.findAll(condition?{
                where:{
                    ...condition
                }
            }:{})
        } catch (error) {
            response.status = "500"
            response.error = "an error has occured within our servers please try again later"
        }
        return response
    }
    async readOne(condition,key){
        const response = {
            status:"pending"
        }
        console.log({condition,key})
         try {
            const record = await this.Model.findOne({where:{...condition}})
            if(record){
               response.status = "success"
               response[key] = record
               response.error = ""
            }
            else{
               response.status = "404"
               response.error = "the record you are trying to get does not exist or has been deleted"
            }
         } catch (error) {
            console.log(error)
            response.status = "500"
            response.error = "an error has occured within our servers please try again later"
         }
         return response
    }
    async update(value,condition){
        const response = {
            status:"pending"
        }
        try {
            const record = await this.Model.update({...value},{where:{...condition}})
            if(record){
               response.status = "success"
               response.error =""
               response.message = "record updated successfully"
            }
            else{
               response.status = "failed"
               response.error = "couldn't update the requested data"
            }
        } catch (error) {
            response.status = "500"
            response.error = "an error has occured within our servers please try again later"
        }
        return response
    }
    async deleteRecord(condition,key){
        const response = {
            status:"pending"
        }
        try {
           const record = await this.Model.destroy({where:{...condition}})
           if(record){
              response.message = `${key} deleted successfully`
           }
           else{
              response.status = "failed"
              response.error = "the record you are trying to get does not exist or has been deleted"
           }
        } catch (error) {
            response.status = "500"
           response.error = "an error has occured within our servers please try again later"
        }
        return response
    }
}

module.exports = {
    Query
}