import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from '../interfaces/error';

const handleClientError = (error: Prisma.PrismaClientKnownRequestError) => {
  console.log("from client error", error.message)
  let errors: IGenericErrorMessage[] = [];
  let message = ""
  const statusCode = 400;

  if(error.code === 'P2025' ){
    message = error?.meta?.cause as string || "Record not found"
    errors = [
      {
        path: '',
        message
      }
    ]
  }else if(error.code === 'P2003'){
    if(error.message.includes("delete()` invocation:")){
      message = 'Delete failed'
      errors = [{
        path: '',
        message
      }]
    }
  }else if(error.code === 'P2002'){
    message = error?.message || "Unique constraint error"
    errors = [
      {
        path: '',
        message
      }
    ]
  }
  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleClientError;
