import React from "react"
import "./EventHistory.scss"

export default function EventHistory({ eventHistory, contractURI }) {
  console.log("🚀 ~ eventHistory", eventHistory)
  const last10 =
    eventHistory.length <= 10
      ? eventHistory
      : eventHistory.reverse().slice(0, 10)
  console.log("🚀 ~ last10", last10)

  return (
    <div className="EventHistory section">
      <h2>Contract Event History: </h2>
      <p>Only the last 10 events will appear here.</p>
      <p>
        For whole list, click{" "}
        <a href={`https://rinkeby.etherscan.io/txs?a=${contractURI}`}>here</a>.
      </p>
      {last10.map((event) => (
        <div className="event" key={event.transactionHash}>
          <div className="data">
            <span>{`Transaction - Block ${event.blockNumber} `}</span>

            <a
              href={`https://rinkeby.etherscan.io/tx/${event.transactionHash}`}
            >
              {`${event.event}`}
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
