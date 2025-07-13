/// <reference path="./.sst/platform/config.d.ts" />

import { link } from "fs";

require('sst')

export default $config({
  app(input) {
    return {
      name: "website-kaliatech-sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {

    const secret = new sst.Secret("LinkdingApiKey");


    //https://ion.sst.dev/docs/component/aws/apigatewayv2/
    const api = new sst.aws.ApiGatewayV2("KaliatechWebsiteApi");
    api.route("GET /api/{api+}",
      //https://ion.sst.dev/docs/component/aws/function/#functionargs
      {
//        bundle: "src",
        handler: "src/lambda.handler",
        memory: "128 MB",
        link: [secret]
      }
    );

    // const fn = new sst.aws.Function("MyFunction", {
    //   bundle: "src",
    //   handler: "lambda.handler",
    //   memory: "128 MB",
    //   url: {
    //     cors: {
    //       allowOrigins: ['https://kaliatech.com', 'https://www.kaliatech.com']
    //     }        
    //   },
    //   link: [secret]
    // });
    // return {
    //   url: fn.url,
    // };

  },
});
