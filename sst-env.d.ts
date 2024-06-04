/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    KaliatechWebsiteApi: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
    LinkdingApiKey: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}