import React from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { statusMap } from "../constants"
import "./CropDetailsModal.scss"

const CropDetailsModal = ({ isOpen, toggleModal, crop, fromWei }) => (
  <Modal isOpen={isOpen} toggle={toggleModal} className="CropDetailsModal">
    <ModalHeader>Coffee Details:</ModalHeader>
    <ModalBody>
      <div className="details">
        <div className="info">
          <div className="label">Owner: </div>
          <div className="data">{crop.ownerID}</div>
        </div>
        <div className="info">
          <div className="label">SKU: </div>
          <div className="data">{crop.sku}</div>
        </div>
        <div className="info">
          <div className="label">Status: </div>
          <div className="data">{statusMap[crop.itemState]}</div>
        </div>
        <br />

        <div className="info">
          <div className="label">Farmer: </div>
          <div className="data">{crop.originFarmerID}</div>
        </div>
        <div className="info">
          <div className="label">Farm: </div>
          <div className="data">{crop.originFarmName}</div>
        </div>
        <div className="info">
          <div className="label">Farm info: </div>
          <div className="data">{crop.originFarmInformation}</div>
        </div>
        <div className="info">
          <div className="label">Farm latitude: </div>
          <div className="data">{crop.originFarmLatitude || "0"}</div>
        </div>
        <div className="info">
          <div className="label">Farm longitude: </div>
          <div className="data">{crop.originFarmLongitude || "0"}</div>
        </div>
        <br />

        <div className="info">
          <div className="label">Coffee info: </div>
          <div className="data">{crop.productNotes}</div>
        </div>
        <div className="info">
          <div className="label">Coffee price: </div>
          <div className="data">{fromWei(crop.productPrice, "ether")}</div>
        </div>
        <br />
        <div className="info">
          <div className="label">Distributor: </div>
          <div className="data">{crop.distributorID}</div>
        </div>
        <div className="info">
          <div className="label">Retailer: </div>
          <div className="data">{crop.retailerID}</div>
        </div>
        <div className="info">
          <div className="label">Consumer: </div>
          <div className="data">{crop.consumerID}</div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={toggleModal}>
        Close
      </Button>
    </ModalFooter>
  </Modal>
)

export default CropDetailsModal
