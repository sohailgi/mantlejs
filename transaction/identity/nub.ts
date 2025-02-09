import Request from "request";
import * as config from "../../config.json";
import { broadcastTx } from "../../utilities/broadcastTx";
import { getWallet } from "../../utilities/keys";
import { AssetMantle } from "../../utilities/mantleJS";

export class nubIdentity extends AssetMantle {
  nub = async (
    address: string,
    chain_id: string,
    mnemonic: any,
    nubID: any,
    feesAmount: any,
    feesToken: any,
    gas: any,
    mode: any,
    memo: string,
  ): Promise<any> => {
    const wallet = await getWallet(mnemonic, "");
    let path = this.path;

    let options = {
      method: "POST",
      url: path + config.nubPath,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: config.nubType,
        value: {
          baseReq: {
            from: address,
            chain_id: chain_id,
            memo: memo,
            fees: [{ amount: String(feesAmount), denom: feesToken }],
            gas: String(gas),
          },
          nubID: nubID,
        },
      }),
    };

    console.log("post method options: ", options);

    return new Promise(function (resolve, reject) {
      Request(options, function (error: any, response: { body: string }) {
        if (error) {
          return reject(error);
        }
        let result = JSON.parse(response.body);
        console.log("post result: ", result);

        resolve(
          broadcastTx(
            path,
            wallet,
            mnemonic,
            result.value,
            chain_id,
            config.FEE,
            config.GASPRICE,
            mode,
          ),
        );
      });
    }).catch(function (error) {
      console.log("Promise Rejected: " + error);
      return error;
    });
  };

  createIdentityNubMsg = async (
    address: string,
    chain_id: string,
    nubID: any,
    feesAmount: any,
    feesToken: any,
    gas: any,
    memo: string,
  ): Promise<any> => {
    let path = this.path;

    let options = {
      method: "POST",
      url: path + config.nubPath,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: config.nubType,
        value: {
          baseReq: {
            from: address,
            chain_id: chain_id,
            memo: memo,
            fees: [{ amount: String(feesAmount), denom: feesToken }],
            gas: String(gas),
          },
          nubID: nubID,
        },
      }),
    };

    return new Promise(function (resolve, reject) {
      Request(options, function (error: any, response: { body: string }) {
        if (error) {
          return reject(error);
        }
        let result = JSON.parse(response.body);

        resolve(result);
      });
    }).catch(function (error) {
      console.log("Promise Rejected: " + error);
      return error;
    });
  };
}
