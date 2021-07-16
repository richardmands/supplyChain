import React, { useState } from "react"

import { statusMap } from "../constants"
import { FormItemColumn } from "./FormItem"

import "./Crops.scss"

function Crop({
  crop,
  action,
  onAction,
  form,
  fromWei,
  setCropDetailsModalOpen,
  setSelectedCropSku,
}) {
  const status = statusMap[crop.itemState]
  const [productPrice, setProductPrice] = useState(0)
  const [retailerID, setRetailerID] = useState("")

  return (
    <div
      className="Crop"
      role="button"
      onClick={() => {
        setCropDetailsModalOpen(true)
        setSelectedCropSku(crop.sku)
      }}
      onKeyPress={() => {
        setCropDetailsModalOpen(true)
        setSelectedCropSku(crop.sku)
      }}
      tabIndex={0}
    >
      <div className={`${status.toLowerCase()}`}>
        <div className="info">
          <div className="label">Farm: </div>
          <div className="data">{crop.originFarmName}</div>
        </div>
        <div className="info">
          <div className="label">Farm info: </div>
          <div className="data">{crop.originFarmInformation}</div>
        </div>
        <div className="info">
          <div className="label">Coffee info: </div>
          <div className="data">{crop.productNotes}</div>
        </div>
        {Number(crop.productPrice) ? (
          <div className="info">
            <div className="label">Coffee price: </div>
            <div className="data">{fromWei(crop.productPrice, "ether")}</div>
          </div>
        ) : null}
      </div>

      {action === "Sell" ? (
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault()
            onAction(productPrice)
          }}
        >
          <FormItemColumn
            name="productPrice"
            label="Price in Ether"
            value={productPrice}
            onChange={setProductPrice}
            type="number"
            isRequired
            min="0.001"
            step="0.001"
            precision={2}
          />

          <button
            className="button submitButton"
            onClick={onAction}
            type="submit"
          >
            <span className="buttonText">{action}</span>
          </button>
        </form>
      ) : null}

      {action === "Ship" ? (
        <form
          className="form"
          onSubmit={(event) => {
            event.preventDefault()
            onAction(retailerID)
          }}
        >
          <FormItemColumn
            name="retailerID"
            label="Retailer Wallet"
            value={retailerID}
            onChange={setRetailerID}
            isRequired
          />

          <button
            className="button submitButton"
            onClick={onAction}
            type="submit"
          >
            <span className="buttonText">{action}</span>
          </button>
        </form>
      ) : null}

      {!form && action ? (
        <button
          className="button submitButton"
          onClick={onAction}
          type="button"
        >
          <span className="buttonText">{action}</span>
        </button>
      ) : null}
    </div>
  )
}

export default function Crops({
  setCropDetailsModalOpen,
  setSelectedCropSku,
  account,
  crops,
  isFarmer,
  processCrop,
  packCrop,
  sellCrop,
  isDistributor,
  buyCrop,
  markCropAsShipped,
  isRetailer,
  receiveCrop,
  isConsumer,
  purchaseCrop,
  fromWei,
}) {
  const cropsArray = Object.values(crops)
  const harvested = cropsArray.filter((crop) => crop.itemState === "0")
  const processed = cropsArray.filter((crop) => crop.itemState === "1")
  const packed = cropsArray.filter((crop) => crop.itemState === "2")
  const forSale = cropsArray.filter((crop) => crop.itemState === "3")
  const sold = cropsArray.filter((crop) => crop.itemState === "4")
  const shipped = cropsArray.filter((crop) => crop.itemState === "5")
  const received = cropsArray.filter((crop) => crop.itemState === "6")
  const purchased = cropsArray.filter((crop) => crop.itemState === "7")

  return (
    <div className="Crops section">
      <h1>Coffees</h1>
      <p>See where all our coffees are in the supply chain.</p>
      <hr />
      <h2>Coffee Harvested</h2>
      <p>Farmers can harvest coffee and get it ready for sale.</p>
      {harvested.length ? (
        <div className="cropsContainer">
          {harvested
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => {
              const action =
                isFarmer &&
                crop.ownerID.toLowerCase() === account.toLowerCase() &&
                "Process"
              return (
                <Crop
                  key={crop.sku}
                  crop={crop}
                  action={action}
                  onAction={() => processCrop(crop.sku)}
                  setCropDetailsModalOpen={setCropDetailsModalOpen}
                  setSelectedCropSku={setSelectedCropSku}
                />
              )
            })}
        </div>
      ) : (
        <p>No coffees...</p>
      )}

      <hr />
      <h3>Coffee Processed</h3>
      {processed.length ? (
        <div className="cropsContainer">
          {processed
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => {
              const action =
                isFarmer &&
                crop.ownerID.toLowerCase() === account.toLowerCase() &&
                "Pack"
              return (
                <Crop
                  key={crop.sku}
                  crop={crop}
                  action={action}
                  onAction={() => packCrop(crop.sku)}
                  setCropDetailsModalOpen={setCropDetailsModalOpen}
                  setSelectedCropSku={setSelectedCropSku}
                />
              )
            })}
        </div>
      ) : (
        <p>No coffees...</p>
      )}

      <hr />
      <h3>Coffee Packed</h3>
      {packed.length ? (
        <div className="cropsContainer">
          {packed
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => {
              const action =
                isFarmer &&
                crop.ownerID.toLowerCase() === account.toLowerCase() &&
                "Sell"
              return (
                <Crop
                  key={crop.sku}
                  crop={crop}
                  action={action}
                  onAction={(productPrice) => {
                    if (typeof productPrice === "string") {
                      sellCrop(crop.sku, productPrice)
                    }
                  }}
                  form
                  setCropDetailsModalOpen={setCropDetailsModalOpen}
                  setSelectedCropSku={setSelectedCropSku}
                />
              )
            })}
        </div>
      ) : (
        <p>No coffees...</p>
      )}

      <hr />
      <h3>Coffee For Sale</h3>
      <p>Distributors can buy coffee.</p>
      {forSale.length ? (
        <div className="cropsContainer">
          {forSale
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => {
              const action = isDistributor && "BuyCoffee"
              return (
                <Crop
                  key={crop.sku}
                  crop={crop}
                  action={action}
                  onAction={() => buyCrop(crop.sku, crop.productPrice)}
                  fromWei={fromWei}
                  setCropDetailsModalOpen={setCropDetailsModalOpen}
                  setSelectedCropSku={setSelectedCropSku}
                />
              )
            })}
        </div>
      ) : (
        <p>No coffees...</p>
      )}

      <hr />
      <h3>Coffee Sold to Distributor</h3>
      <p>
        Distributors can mark sold coffee as shipped. Make sure to include the
        correct wallet address of the retailer.
      </p>
      {sold.length ? (
        <div className="cropsContainer">
          {sold
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => {
              const action =
                isDistributor &&
                crop.ownerID.toLowerCase() === account.toLowerCase() &&
                "Ship"
              return (
                <Crop
                  key={crop.sku}
                  crop={crop}
                  action={action}
                  onAction={(retailerID) => {
                    if (typeof retailerID === "string") {
                      markCropAsShipped(crop.sku, retailerID)
                    }
                  }}
                  fromWei={fromWei}
                  form
                  setCropDetailsModalOpen={setCropDetailsModalOpen}
                  setSelectedCropSku={setSelectedCropSku}
                />
              )
            })}
        </div>
      ) : (
        <p>No coffees...</p>
      )}

      <hr />
      <h3>Coffee Shipped</h3>
      <p>
        Retailers can mark coffee as received if they are the intended
        recipient.
      </p>
      {shipped.length ? (
        <div className="cropsContainer">
          {shipped
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => {
              const action =
                isRetailer &&
                crop.retailerID.toLowerCase() === account.toLowerCase() &&
                "Mark Recieved"
              return (
                <Crop
                  key={crop.sku}
                  crop={crop}
                  action={action}
                  onAction={() => receiveCrop(crop.sku)}
                  fromWei={fromWei}
                  setCropDetailsModalOpen={setCropDetailsModalOpen}
                  setSelectedCropSku={setSelectedCropSku}
                />
              )
            })}
        </div>
      ) : (
        <p>No coffees...</p>
      )}

      <hr />
      <h3>Coffee Received by Retailer</h3>
      <p>Consumers can buy coffee.</p>
      {received.length ? (
        <div className="cropsContainer">
          {received
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => {
              const action = isConsumer && "Get Free Sample"
              return (
                <Crop
                  key={crop.sku}
                  crop={crop}
                  action={action}
                  onAction={() => purchaseCrop(crop.sku)}
                  fromWei={fromWei}
                  setCropDetailsModalOpen={setCropDetailsModalOpen}
                  setSelectedCropSku={setSelectedCropSku}
                />
              )
            })}
        </div>
      ) : (
        <p>No coffees...</p>
      )}

      <hr />
      <h3>Coffee Purchased by Consumer</h3>
      <p>Purchased coffee should be drunk quickly for maximum freshness!</p>
      {purchased.length ? (
        <div className="cropsContainer">
          {purchased
            .sort((a, b) => a.sku - b.sku)
            .map((crop) => (
              <Crop
                key={crop.sku}
                crop={crop}
                fromWei={fromWei}
                setCropDetailsModalOpen={setCropDetailsModalOpen}
                setSelectedCropSku={setSelectedCropSku}
              />
            ))}
        </div>
      ) : (
        <p>No coffee</p>
      )}
    </div>
  )
}
