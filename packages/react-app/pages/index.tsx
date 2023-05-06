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
  const [allMemo, setAllMemo] = useState([]);

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
    <div className=" w-full max-w-xs top-3 sticky z-20">
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
    </div>
  );
}
