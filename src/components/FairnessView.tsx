import { useEffect, useState } from "react";
import CustomInput from "./Input";
import SwitchTab from "./SwitchTab";
import { buildPrivateHash, generateCrashPoint } from "../utils/crash";
import Modal from "./Modal";

const FairnessView = ({ privateHash, publicSeed, Label, children }: any) => {
    const [verifyOpen, setVerifyOpen] = useState(false)

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const [crashPoint, setCrashPoint] = useState(0);
    const [_privateSeed, setPrivateSeed] = useState("");
    const [_privateHash, setPrivateHash] = useState("");

    const [_publicSeed, setPublicSeed] = useState("");


    useEffect(() => {
        if (_privateSeed.length > 0) {
            setPrivateHash(buildPrivateHash(_privateSeed));
        } else {
            setPrivateHash("")
        }
    }, [_privateSeed]);

    useEffect(() => {
        if (_publicSeed !== "" && _privateSeed !== "") {
            setCrashPoint(generateCrashPoint(_privateSeed, _publicSeed) / 100)
        } else {
            setCrashPoint(0)
        }
    }, [_publicSeed, _privateSeed]);

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            // toast.success("Copied!")
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    return <>
        <button onClick={() => setVerifyOpen(true)}>
            {children}
        </button>
        <Modal isOpen={verifyOpen} onClose={() => { setVerifyOpen(false) }} className="animate-zoomIn pb-0 bg-[#2d2d2d] max-w-[530px] w-svw rounded-md border-[2px] border-[#2fe42f]">
            <div className=" flex-col">
                <div className="flex  items-center px-3 text-white">
                    <div className="w-5 ">
                        <svg fill="currentColor" viewBox="0 0 64 64" > <title></title> <path d="M54.727 15.006h3.12V8.37H34.654V2.61H27.99v5.758H4.746v6.637h4.505L0 37.452c0 7.037 5.704 12.741 12.741 12.741 7.038 0 12.741-5.704 12.741-12.741l-9.25-22.446h11.73v39.745h-9.303v6.638h25.165V54.75h-9.171V15.006h13.115l-9.25 22.446c0 7.037 5.703 12.741 12.74 12.741C58.297 50.193 64 44.489 64 37.452l-9.273-22.446ZM5.334 37.452l7.411-17.887 7.357 17.887H5.334Zm38.492 0 7.357-17.887 7.463 17.887h-14.82Z"></path></svg>
                    </div>
                    <div className="font-bold px-1">
                        Fairness
                    </div>
                </div>
                <div className="p-4">
                    <SwitchTab disabled={false} active={activeTab} onChange={setActiveTab} options={["Seeds", "Verify"]} />
                </div>
            </div>
            <div className="p-3 bg-[#000000]">
                {
                    loading ? <div className="flex items-center justify-center h-full">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-400"></div>
                        </div>
                    </div> : <>
                        <div className="flex flex-col p-1">
                            {activeTab === 0 ? <>
                                <div className="text-white text-sm">Active Client Seed</div>
                                <CustomInput type="string" disabled={true} value={publicSeed} onChange={() => { }} icon={<button onClick={() => copyToClipboard(publicSeed)} className="px-1 py-2 w-full "></button>} />
                                <div className="text-white text-sm">Active Server Seed (Hashed)</div>
                                <CustomInput type="string" disabled={true} value={privateHash} icon={<button onClick={() => copyToClipboard(privateHash)} className="px-1 py-2 w-full "></button>} />
                            </> : <>
                                <div className="p-5 border-dashed mt-3 border-[1px] border-[#3dff23b4] rounded-md flex justify-center items-center font-bold text-[20px] text-white">
                                    {crashPoint !== 0 ? `${crashPoint} x` : <div className="text-[16px]"> More inputs are required to verify result</div>}
                                </div>
                                <div className="text-white text-sm">Server Seed</div>
                                <CustomInput type="string" onChange={setPrivateSeed} value={_privateSeed} />
                                <div className="text-white text-sm">Server Seed(Hash)</div>
                                <CustomInput type="string" disabled={true} value={_privateHash} />
                                <div className="text-white text-sm">Client Seed</div>
                                <CustomInput type="string" onChange={setPublicSeed} value={_publicSeed} />
                            </>}
                        </div>
                    </>
                }
            </div>
        </Modal>
    </>
}

export default FairnessView;
