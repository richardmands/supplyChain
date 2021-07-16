import React from "react"
import "./Harvest.scss"
import { FormItem } from "./FormItem"

export default function Harvest({
  farmName,
  setFarmName,
  farmInformation,
  setFarmInformation,
  farmLatitude,
  setFarmLatitude,
  farmLongitude,
  setFarmLongitude,
  productNotes,
  setProductNotes,
  onSubmit,
}) {
  return (
    <div className="Harvest">
      <h2>Farmers: </h2>
      <h3>Harvest Coffee?</h3>
      <form className="form" onSubmit={onSubmit}>
        <FormItem
          name="farmName"
          label="Farm Name"
          value={farmName}
          onChange={setFarmName}
          isRequired
        />
        <FormItem
          name="farmInformation"
          label="Farm Information"
          value={farmInformation}
          onChange={setFarmInformation}
          type="textarea"
          isRequired
        />
        <FormItem
          name="latitude"
          label="Latitude"
          value={farmLatitude}
          onChange={setFarmLatitude}
          type="number"
          isRequired
        />
        <FormItem
          name="longitude"
          label="Longitude"
          value={farmLongitude}
          onChange={setFarmLongitude}
          type="number"
          isRequired
        />
        <FormItem
          name="productNotes"
          label="Product Notes"
          value={productNotes}
          onChange={setProductNotes}
          isRequired
        />
        <button type="submit" className="button submitButton">
          <span className="buttonText">Harvest</span>
        </button>
      </form>
    </div>
  )
}
