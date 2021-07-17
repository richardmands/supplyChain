export async function getEventHistory({ instance, setEventHistory }) {
  try {
    const events = await instance.getPastEvents("allEvents", {
      fromBlock: 1,
    })
    setEventHistory(events)
  } catch (error) {
    console.log("🚀 ~ error", error)
  }
}
