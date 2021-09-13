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
import EventHistory from "./components/EventHistory"

import logo from "./coffee.png"
import CropDetailsModal from "./components/CropDetailsModal"
import { getEventHistory } from "./contractHelpers/events"

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
  const [instance, contractURI] = useContract({
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

  const [eventHistory, setEventHistory] = useState([])
  const [isFarmer, setIsFarmer] = useState(false)
  const [isDistributor, setIsDistributor] = useState(false)
  const [isRetailer, setIsRetailer] = useState(false)
  const [isConsumer, setIsConsumer] = useState(false)
  const [skus, setSkus] = useState([])

  useEffect(() => {
    if (instance && shouldUpdate) {
      getEventHistory({ instance, setEventHistory })
      checkIsFarmer({ instance, id: account, setIsFarmer })
      checkIsDistributor({
        instance,
        id: account,
        setIsDistributor,
      })
      checkIsRetailer({
        instance,
        id: account,
        setIsRetailer,
      })
      checkIsConsumer({
        instance,
        id: account,
        setIsConsumer,
      })
      getCurrentSku({
        instance,
        onSuccess: (sku) => {
          if (sku) {
            setSkus([...Array(Number(sku)).keys()].map((num) => num + 1))
          }
        },
      })
    }
  }, [instance, shouldUpdate])

  const [crops, setCrops] = useState({})
  useEffect(() => {
    if (shouldUpdate && skus.length > 0) {
      setLoading(true)
      setShouldUpdate(false)
      getCrops({
        instance,
        skus,
        setCrops,
        onFinish: () => setLoading(false),
      })
    }
  }, [instance, skus, shouldUpdate])

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
        <p className="explanation">
          See the code on{" "}
          <a
            href="https://github.com/richardmands/supplyChain"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </p>
        {contractURI ? (
          <p className="explanation">
            Deployed on Rinkeby Test Network <br />
            <a
              href={`https://rinkeby.etherscan.io/address/${contractURI}`}
              target="_blank"
              rel="noreferrer"
            >
              {contractURI}
            </a>
          </p>
        ) : (
          <p className="explanation">
            Not connected to smart contract. Make sure you have MetaMask
            installed and you're on the Rinkeby Test Network.
          </p>
        )}
        <p className="explanation">
          This project allows different user roles to create and move items
          through a supply chain. It includes a payment step that allows
          distributors to purchase a crop from a farmer. As an extension, I
          would like to add payment steps between the distributor/retailer and
          retailer/buyer.
        </p>
      </header>

      <div className="statuses">
        <div
          className={`contractStatus ${
            instance ? "operational" : "notOperational"
          }`}
        >
          Contract:{" "}
          {`${instance ? "Connected" : "Not logged in to MetaMask on Rinkeby"}`}
        </div>
      </div>

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

      {web3 && instance && accounts?.length ? (
        <div className="content">
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
            setFarmer={() => {
              setFarmer({
                instance,
                id: account,
                isFarmer,
                onSuccess: () => {
                  setIsFarmer(!isFarmer)
                  setShouldUpdate(true)
                  setLoading(false)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () => {
                  makeToast("Something went wrong updating your status...")
                  setLoading(false)
                },
              })
            }}
            isDistributor={isDistributor}
            setDistributor={() => {
              setLoading(true)
              setDistributor({
                instance,
                id: account,
                isDistributor,
                onSuccess: () => {
                  setLoading(false)
                  setIsDistributor(!isDistributor)
                  setShouldUpdate(true)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong updating your status...")
                },
              })
            }}
            isRetailer={isRetailer}
            setRetailer={() => {
              setLoading(true)
              setRetailer({
                instance,
                id: account,
                isRetailer,
                onSuccess: () => {
                  setLoading(false)
                  setIsRetailer(!isRetailer)
                  setShouldUpdate(true)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong updating your status...")
                },
              })
            }}
            isConsumer={isConsumer}
            setConsumer={() => {
              setLoading(true)
              setConsumer({
                instance,
                id: account,
                isConsumer,
                onSuccess: () => {
                  setLoading(false)
                  setIsConsumer(!isConsumer)
                  setShouldUpdate(true)
                  makeToast("You've updated your status!", true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong updating your status...")
                },
              })
            }}
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
                    setLoading(true)
                    harvestCrop({
                      instance,
                      id: account,
                      isFarmer,
                      farmName,
                      farmInformation,
                      farmLatitude,
                      farmLongitude,
                      productNotes,
                      onSuccess: () => {
                        setLoading(false)
                        makeToast("You've harvested your crop!", true)
                        resetHarvestForm()
                        setShouldUpdate(true)
                      },
                      onFailure: () => {
                        setLoading(false)
                        makeToast(
                          "Something went wrong harvesting your crop..."
                        )
                      },
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
              setLoading(true)
              processCrop({
                instance,
                id: account,
                gasLimit,
                gasPrice,
                isFarmer,
                sku,
                onSuccess: () => {
                  setLoading(false)
                  makeToast("You've processed your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong processing your crop...")
                },
              })
            }}
            packCrop={(sku) => {
              setLoading(true)
              packCrop({
                instance,
                id: account,
                isFarmer,
                sku,
                onSuccess: () => {
                  setLoading(false)
                  makeToast("You've processed your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong processing your crop...")
                },
              })
            }}
            fromWei={web3.utils.fromWei}
            sellCrop={(sku, productPrice) => {
              setLoading(true)
              sellCrop({
                instance,
                id: account,
                isFarmer,
                sku,
                productPrice: web3.utils.toWei(productPrice, "ether"),
                onSuccess: () => {
                  setLoading(false)
                  makeToast("You've put your crop up for sale!", true)
                  setShouldUpdate(true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast(
                    "Something went wrong putting your crop up for sale..."
                  )
                },
              })
            }}
            isDistributor={isDistributor}
            buyCrop={(sku, price) => {
              setLoading(true)
              buyCrop({
                instance,
                id: account,
                isDistributor,
                sku,
                productPrice: price,
                onSuccess: () => {
                  setLoading(false)
                  makeToast("You've bought some coffee!", true)
                  setShouldUpdate(true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong buying this crop...")
                },
              })
            }}
            markCropAsShipped={(sku, retailerID) => {
              setLoading(true)
              markCropAsShipped({
                instance,
                id: account,
                isDistributor,
                sku,
                retailerID,
                onSuccess: () => {
                  setLoading(false)
                  makeToast("You've shipped your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong shipping your crop...")
                },
              })
            }}
            isRetailer={isRetailer}
            receiveCrop={(sku) => {
              setLoading(true)
              receiveCrop({
                instance,
                id: account,
                isRetailer,
                sku,
                onSuccess: () => {
                  setLoading(false)
                  makeToast("You've received your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast(
                    "Something went wrong marking your crop as received..."
                  )
                },
              })
            }}
            isConsumer={isConsumer}
            purchaseCrop={(sku) => {
              setLoading(true)
              purchaseCrop({
                instance,
                id: account,
                isConsumer,
                sku,
                onSuccess: () => {
                  setLoading(false)
                  makeToast("You've purchased your crop!", true)
                  setShouldUpdate(true)
                },
                onFailure: () => {
                  setLoading(false)
                  makeToast("Something went wrong purchasing your crop...")
                },
              })
            }}
          />
          <hr className="section endSection" />
          <EventHistory eventHistory={eventHistory} contractURI={contractURI} />
          <hr className="section endSection" />
        </div>
      ) : null}
    </div>
  )
}

export default App
