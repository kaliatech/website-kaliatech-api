import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Resource } from "sst"
//export const handleLinkding = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {

export async function handleLinkding (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> {

    //const LINKDING_API_KEY= process.env.LINKDING_API_KEY
    const LINKDING_API_KEY=Resource.LinkdingApiKey.value
    const LINKDING_URL='https://ktn.kaliatech.com/linkding'

    const limit = parseInt(event.queryStringParameters?.limit) || 100
    const offset = parseInt(event.queryStringParameters?.offset) || 0
    const tag = event.queryStringParameters?.tag || ''

    if (limit > 500) {
        return {
            statusCode: 400,
            body: JSON.stringify({
              error: "Limit must be less than or equal to 100"
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          } as APIGatewayProxyResult;
    }

    //let ldApi = event.pathParameters.api.includes('/bookmarks/') ? '/bookmarks/'    
    let ldApi = ''
    if (event.pathParameters.api.includes('/bookmarks/')){
        ldApi = `${LINKDING_URL}/api/bookmarks/?limit=${limit}&offset=${offset}`
        if (tag) {
            ldApi = `${ldApi}&q=%23${tag}`
        }
    }
    if (!ldApi) {
        return {
            statusCode: 400,
            body: JSON.stringify({
              error: 'Invalid API path'
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          };        
    }

    

    
    return await fetch(ldApi, {
        method: 'GET',
        headers: {    
            'Authorization': `Token ${LINKDING_API_KEY}`,
            'Content-Type': 'application/json'
        }
    })
    .then((response) => (response.status === 200 ? response.json() : Promise.reject(response)))
    .then((data) => {
        
        // id: number
        // url: string
        // title: string
        // description: string
        // notes: string
        // website_title: string
        // website_description: null | string
        // web_archive_snapshot_url: null | string
        // is_archived: boolean
        // unread: boolean
        // shared: boolean
        // tag_names: string[]
        // date_added: Date
        // date_modified: Date

        for (let i=0; i<data.results.length; i++) {
            if (data.results[i].tag_names.includes('private')) {
                data.results[i] = {
                    id: data.results[i].id,
                    title: '<private>',
                    description: '...',
                    url: '',
                    tag_names: ['private']
                }
            }
        }
        const linkdingRespData = JSON.stringify(data)
        return {
            statusCode: 200,
            body: linkdingRespData,
            headers: {
              'Content-Type': 'application/json',
            },
          }
    })
    .catch((error) => {
        console.log("error", error)
        return {
            statusCode: 500,
            body: JSON.stringify({
              error: error.message || "Unexpected error"
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          };

    })


}