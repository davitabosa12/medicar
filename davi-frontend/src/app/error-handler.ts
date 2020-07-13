export default {
    handleError<T>(methodName:string, result?:T){
        return (error:any) => {
            
            return result as T;
        }
    }
}