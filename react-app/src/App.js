import React, { useEffect, useState } from "react"
import Loader from "react-loader-spinner"
import { ToastContainer, toast } from "react-toastify"

import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import "./App.scss"

import useWeb3 from "./hooks/useWeb3"
import useContract from "./hooks/useContract"
import SupplyChainContract from "./contracts/SupplyChain.json"
import {
  checkIsFarmer,
  setFarmer,
  checkIsDistributor,
  setDistributor,
  checkIsRetailer,
  setRetailer,
  checkIsConsumer,
  setConsumer,
} from "./contractHelpers/roles"
import {
  harvestCrop,
  getCrops,
  getCurrentSku,
  processCrop,
  packCrop,
  sellCrop,
  buyCrop,
  markCropAsShipped,
  receiveCrop,
  purchaseCrop,
} from "./contractHelpers/crops"

import User from "./components/User"
import Crops from "./components/Crops"
import Harvest from "./components/Harvest"

import logo from "./coffee.png"
import CropDetailsModal from "./components/CropDetailsModal"

const makeToast = (text, happy) => {
  const options = {
    position: "top-right",
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }

  return happy ? toast.success(text, options) : toast.error(text, options)
}

function App() {
  const [loading, setLoading] = useState(false)
  const [web3, accounts, gasPrice, gasLimit] = useWeb3(
    { amount: "5", unit: "shannon" },
    { amount: "5", unit: "lovelace" }
  )

  const account = (accounts && accounts[0]) || ""

  const [shouldUpdate, setShouldUpdate] = useState(true)
  const [contractInstance, contractURI] = useContract({
    web3,
    smartContract: SupplyChainContract,
    gasPrice,
    gasLimit,
    onSuccess: () => {
      setShouldUpdate(true)
      makeToast(`...${account.substr(-4)} connected to Smart Contract`, ":)")
    },
    onFailure: () => makeToast("Failed to connect to Smart Contract :("),
  })

  const [isFarmer, setIsFarmer] = useState(false)
  const [isDistributor, setIsDistributor] = useState(false)
  const [isRetailer, setIsRetailer] = useState(false)
  const [isConsumer, setIsConsumer] = useState(false)
  const [skus, setSkus] = useState([])

  useEffect(() => {
    if (contractInstance && shouldUpdate) {
      checkIsFarmer({ instance: contractInstance, id: account, setIsFarmer })
      checkIsDistributor({
        instance: contractInstance,
        id: account,
        setIsDistributor,
      })
      checkIsRetailer({
        instance: contractInstance,
        id: account,
        setIsRetailer,
      })
      checkIsConsumer({
        instance: contractInstance,
        id: account,
        setIsConsumer,
      })
      getCurrentSku({
        instance: contractInstance,
        onSuccess: (sku) => {
          if (sku) {
            setSkus([...Array(Number(sku)).keys()].map((num) => num + 1))
          }
        },
      })
    }
  }, [contractInstance, shouldUpdate])

  const [crops, setCrops] = useState({})
  useEffect(() => {
    if (shouldUpdate && skus.length > 0) {
      setLoading(true)
      setShouldUpdate(false)
      getCrops({
        instance: contractInstance,
        skus,
        setCrops,
        onFinish: () => setLoading(false),
      })
    }
  }, [contractInstance, skus, shouldUpdate])

  // harvest form data
  const [farmName, setFarmName] = useState("")
  const [farmInformation, setFarmInformation] = useState("")
  const [farmLatitude, setFarmLatitude] = useState(0)
  const [farmLongitude, setFarmLongitude] = useState(0)
  const [productNotes, setProductNotes] = useState("")

  const resetHarvestForm = () => {
    setFarmName("")
    setFarmInformation("")
    setFarmLatitude(0)
    setFarmLongitude(0)
    setProductNotes("")
  }

  const [cropDetailsModalOpen, setCropDetailsModalOpen] = useState(false)
  const [selectedCropSku, setSelectedCropSku] = useState(null)

  return (
    <div className="App">
      <ToastContainer />

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Fair Trade Coffee <br /> Richard Mands <br />
          Udacity Blockchain Nanodegree
        </p>
        {contractURI ? (
          <>
            <p>
              Deployed on Rinkeby Test Network <br />
              <a
                href={`https://rinkeby.etherscan.io/address/${contractURI}`}
                target="_blank"
                rel="noreferrer"
              >
                {contractURI}
              </a>
            </p>
          </>
        ) : null}
        <p className="explanation">
          This project allows different user roles to create and move items
          through a supply chain. It includes a payment step that allows
          distributors to purchase a crop from a farmer. As an extension, I
          would like to add payment steps between the distributor/retailer and
          retailer/buyer.
        </p>
      </header>

      {loading ? (
        <div className="LoaderFullScreen">
          <Loader
            type="Grid"
            color="#00BFFF"
            height={100}
            width={100}
            style={{ paddingTop: "20px", margin: "auto" }}
          />
        </div>
      ) : null}

      {web3 && accounts?.length ? (
        <>
          {selectedCropSku ? (
            <CropDetailsModal
              isOpen={cropDetailsModalOpen}
              crop={crops[selectedCropSku]}
              toggleModal={() => {
                setCropDetailsModalOpen(!cropDetailsModalOpen)
              }}
              fromWei={web3.utils.fromWei}
            />
          ) : null}
          <User
            userId={account}
            isFarmer={isFarmer}
            setFarmer={() =>
              setFarmer({
                instance: contractInstance,
                id: account,
                isFarmer,
                onSuccess: () => {
                  setIsFarmer(!isFarmer)
                  setShouldUpdate(true)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () =>
                  makeToast("Something went wrong updating your status..."),
              })
            }
            isDistributor={isDistributor}
            setDistributor={() =>
              setDistributor({
                instance: contractInstance,
                id: account,
                isDistributor,
                onSuccess: () => {
                  setIsDistributor(!isDistributor)
                  setShouldUpdate(true)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () =>
                  makeToast("Something went wrong updating your status..."),
              })
            }
            isRetailer={isRetailer}
            setRetailer={() =>
              setRetailer({
                instance: contractInstance,
                id: account,
                isRetailer,
                onSuccess: () => {
                  setIsRetailer(!isRetailer)
                  setShouldUpdate(true)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () =>
                  makeToast("Something went wrong updating your status..."),
              })
            }
            isConsumer={isConsumer}
            setConsumer={() =>
              setConsumer({
                instance: contractInstance,
                id: account,
                isConsumer,
                onSuccess: () => {
                  setIsConsumer(!isConsumer)
                  setShouldUpdate(true)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () =>
                  makeToast("Something went wrong updating your status..."),
              })
            }
          />

          <hr className="section endSection" />

          <div className="Actions section">
            <h1>Lets make some coffee!</h1>
            <p>
              Carry out any actions that your user role gives you access to.
            </p>

            {isFarmer ? (
              <>
                <hr />
                <Harvest
                  farmName={farmName}
                  setFarmName={setFarmName}
                  farmInformation={farmInformation}
                  setFarmInformation={setFarmInformation}
                  farmLatitude={farmLatitude}
                  setFarmLatitude={setFarmLatitude}
                  farmLongitude={farmLongitude}
                  setFarmLongitude={setFarmLongitude}
                  productNotes={productNotes}
                  setProductNotes={setProductNotes}
                  onSubmit={async (event) => {
                    event.preventDefault()
                    harvestCrop({
                      instance: contractInstance,
                      id: account,
                      isFarmer,
                      farmName,
                      farmInformation,
                      farmLatitude,
                      farmLongitude,
                      productNotes,
                      onSuccess: () => {
                        makeToast("You've harvested your crop!", true)
                        resetHarvestForm()
                        setShouldUpdate(true)
                      },
                      onFailure: () =>
                        makeToast(
                          "Something went wrong harvesting your crop..."
                        ),
                    })
                  }}
                />
              </>
            ) : null}
          </div>

          <hr className="section endSection" />

          <Crops
            setCropDetailsModalOpen={setCropDetailsModalOpen}
            setSelectedCropSku={setSelectedCropSku}
            account={account}
            crops={crops}
            isFarmer={isFarmer}
            processCrop={(sku) => {
              processCrop({
                instance: contractInstance,
                id: account,
                gasLimit,
                gasPrice,
                isFarmer,
                sku,
                onSuccess: () => {
                  makeToast("You've processed your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () =>
                  makeToast("Something went wrong processing your crop..."),
              })
            }}
            packCrop={(sku) => {
              packCrop({
                instance: contractInstance,
                id: account,
                isFarmer,
                sku,
                onSuccess: () => {
                  makeToast("You've processed your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () =>
                  makeToast("Something went wrong processing your crop..."),
              })
            }}
            fromWei={web3.utils.fromWei}
            sellCrop={(sku, productPrice) => {
              sellCrop({
                instance: contractInstance,
                id: account,
                isFarmer,
                sku,
                productPrice: web3.utils.toWei(productPrice, "ether"),
                onSuccess: () => {
                  makeToast("You've put your crop up for sale!", true)
                  setShouldUpdate(true)
                },
                onFailure: () =>
                  makeToast(
                    "Something went wrong putting your crop up for sale..."
                  ),
              })
            }}
            isDistributor={isDistributor}
            buyCrop={(sku, price) => {
              buyCrop({
                instance: contractInstance,
                id: account,
                isDistributor,
                sku,
                productPrice: price,
                onSuccess: () => {
                  makeToast("You've bought some coffee!", true)
                  setShouldUpdate(true)
                },
                onFailure: () =>
                  makeToast("Something went wrong buying this crop..."),
              })
            }}
            markCropAsShipped={(sku, retailerID) => {
              markCropAsShipped({
                instance: contractInstance,
                id: account,
                isDistributor,
                sku,
                retailerID,
                onSuccess: () => {
                  makeToast("You've shipped your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () =>
                  makeToast("Something went wrong shipping your crop..."),
              })
            }}
            isRetailer={isRetailer}
            receiveCrop={(sku) => {
              receiveCrop({
                instance: contractInstance,
                id: account,
                isRetailer,
                sku,
                onSuccess: () => {
                  makeToast("You've received your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () =>
                  makeToast(
                    "Something went wrong marking your crop as received..."
                  ),
              })
            }}
            isConsumer={isConsumer}
            purchaseCrop={(sku) => {
              purchaseCrop({
                instance: contractInstance,
                id: account,
                isConsumer,
                sku,
                onSuccess: () => {
                  makeToast("You've purchased your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () =>
                  makeToast("Something went wrong purchasing your crop..."),
              })
            }}
          />
          <hr className="section endSection" />
        </>
      ) : null}
    </div>
  )
}

export default App
