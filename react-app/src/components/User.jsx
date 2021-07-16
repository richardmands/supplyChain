import React from "react"

import "./User.scss"

export default function User({
  userId,
  isFarmer,
  setFarmer,
  isDistributor,
  setDistributor,
  isRetailer,
  setRetailer,
  isConsumer,
  setConsumer,
}) {
  return (
    <div className="User section">
      <h1>User</h1>
      <p>See your user information.</p>
      <hr />
      <h3>Your userId:</h3>
      <p>{userId}</p>

      <h3>Your roles:</h3>
      <p>Click to add / remove roles.</p>

      <div className="rolesContainer">
        <div
          className={`userRole ${isFarmer ? "active" : ""}`}
          onClick={setFarmer}
          role="button"
          tabIndex={0}
          onKeyPress={(event) => {
            if (event.code === "Enter") {
              setFarmer()
            }
          }}
        >
          <div className={`userRoleText ${isFarmer ? "active" : ""}`}>
            Farmer
          </div>
        </div>

        <div
          className={`userRole ${isDistributor ? "active" : ""}`}
          onClick={setDistributor}
          role="button"
          tabIndex={0}
          onKeyPress={(event) => {
            if (event.code === "Enter") {
              setDistributor()
            }
          }}
        >
          <div className={`userRoleText ${isDistributor ? "active" : ""}`}>
            Distributor
          </div>
        </div>

        <div
          className={`userRole ${isRetailer ? "active" : ""}`}
          onClick={setRetailer}
          role="button"
          tabIndex={0}
          onKeyPress={(event) => {
            if (event.code === "Enter") {
              setRetailer()
            }
          }}
        >
          <div className={`userRoleText ${isRetailer ? "active" : ""}`}>
            Retailer
          </div>
        </div>

        <div
          className={`userRole ${isConsumer ? "active" : ""}`}
          onClick={setConsumer}
          role="button"
          tabIndex={0}
          onKeyPress={(event) => {
            if (event.code === "Enter") {
              setConsumer()
            }
          }}
        >
          <div className={`userRoleText ${isConsumer ? "active" : ""}`}>
            Consumer
          </div>
        </div>
      </div>
    </div>
  )
}
