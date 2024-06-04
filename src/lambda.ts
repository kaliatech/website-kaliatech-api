
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { handleLinkding } from './route-linkding';
// export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

// }


export async function handler(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> {

    //console.log('event', event.pathParameters);
    
    if (event.pathParameters?.api?.startsWith('linkding')) {
        //return {
        //     statusCode: 200,
        //     body: JSON.stringify({
        //       error: "Testing"
        //     }),
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   };
          return await handleLinkding(event)
    }
    else {
        return {
            statusCode: 404,
            body: JSON.stringify({
              error: "Not found"
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          };
    }

}