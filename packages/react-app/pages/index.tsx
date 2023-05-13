import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useIsMounted } from "./hooks/useIsMounted";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import BuyMeACoffeeAbi from "../../hardhat/artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json";

const contractAddress = "0x42dF65f907BaD119d9CAa73405923bb64125f5F7";
export default function Home() {
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [allMemo, setAllMemo]: any[] = useState([]);

  //Buy Coffee
  const { config, error } = usePrepareContractWrite({
    address: contractAddress,
    abi: BuyMeACoffeeAbi.abi,
    functionName: "buyCoffee",
    args: [name, message],
    overrides: {
      from: address,
      value: ethers.utils.parseEther(amount.toString()),
    },
  });
  const { data: buyMeACoffee, write } = useContractWrite(config);

  const { data: memos, isFetched } = useContractRead({
    address: contractAddress,
    abi: BuyMeACoffeeAbi.abi,
    functionName: "getMemos",
    watch: true,
  });

  useEffect(() => {
    try {
      if (isFetched) {
        const MemoCleaned = memos.map((memo: any) => {
          return {
            address: memo.from,
            name: memo.name,
            timestamp: new Date(memo.timestamp * 1000),
            message: memo.message,
          };
        });

        setAllMemo(MemoCleaned);
        console.log("all memo", allMemo);
      }
    } catch (error) {
      console.log(error);
    }
  }, [memos, isFetched]);

  //handle input fields
  const handleOnMessageChange = (event: any) => {
    const { value } = event.target;
    setMessage(value);
    console.log("message is :", message);
  };
  const handleOnNameChange = (event: any) => {
    const { value } = event.target;
    setName(value);
    console.log("name is :", name);
  };

  const handleOnAmountChange = (event: any) => {
    const { value } = event.target;
    setAmount(value.toString());
    console.log("name is :", amount);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xs top-3 sticky z-20">
      {mounted && isConnected ? (
        <form>
          <div className="mb-4">
            <label
              className="text-indigo-500 block  font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Please Enter your Name"
              required
              className="appearance-none border rounded shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              onChange={handleOnNameChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="text-indigo-500 block  font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Please Enter Amount"
              className="appearance-none border rounded shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
              onChange={handleOnAmountChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="text-indigo-500 block  font-bold mb-2"
              htmlFor="memo"
            >
              Send Me a Memo
            </label>
            <textarea
              id="memo"
              rows={3}
              placeholder="Write a memo"
              required
              className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 rounded border text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleOnMessageChange}
            ></textarea>
          </div>
          <div className="">
            {" "}
            <button
              type="button"
              onClick={() => write?.()}
              className="bg-indigo-600 text-center rounded text-white/90 font-bold py-2 px-4 focus:outline-none hover:bg-indigo-700 hover:text-white"
            >
              Send {amount > 0 ? amount : ""} Celo
            </button>
          </div>
        </form>
      ) : (
        <div>
          <ConnectButton
            showBalance={{ smallScreen: true, largeScreen: false }}
          />
        </div>
      )}
      <div className="w-full">
        {allMemo.map((memo: any, index: any) => {
          return (
            <div className="border-l-2 mt-10 flex flex-row" key={index}>
              <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-indigo-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
                {/* <!-- Dot Following the Left Vertical Line --> */}
                <div className="w-5 h-5 bg-blue-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>
                {/* <!-- Line that connecting the box with the vertical line --> */}
                <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>
                {/* <!-- Content that showing in the box --> */}
                <div className="flex-auto">
                  <div className="bg-indigo-700 rounded p-2 font-bold">
                    <h1 className="text-md">Supporter: {memo.name}</h1>
                    <h1 className="text-md">Message: {memo.message}</h1>
                    <h3>Address: {memo.address}</h3>
                  </div>
                  <h1 className="text-md font-bold">
                    TimeStamp: {memo.timestamp.toString()}
                  </h1>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
