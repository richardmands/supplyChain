export async function checkIsFarmer({ instance, id, setIsFarmer }) {
  try {
    const data = await instance.methods.isFarmer(id).call()
    setIsFarmer(data)
  } catch (error) {
    console.log("🚀 ~ error", error)
  }
}

export async function setFarmer({
  instance,
  id,
  isFarmer,
  onSuccess,
  onFailure,
}) {
  try {
    if (isFarmer) {
      await instance.methods.renounceFarmer().send({ from: id, value: 0 })
    } else {
      await instance.methods.addFarmer(id).send({ from: id, value: 0 })
    }
    onSuccess()
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function checkIsDistributor({ instance, id, setIsDistributor }) {
  try {
    const data = await instance.methods.isDistributor(id).call()
    setIsDistributor(data)
  } catch (error) {
    console.log("🚀 ~ error", error)
  }
}

export async function setDistributor({
  instance,
  id,
  isDistributor,
  onSuccess,
  onFailure,
}) {
  try {
    if (isDistributor) {
      await instance.methods.renounceDistributor().send({ from: id, value: 0 })
    } else {
      await instance.methods.addDistributor(id).send({ from: id, value: 0 })
    }
    onSuccess()
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function checkIsRetailer({ instance, id, setIsRetailer }) {
  try {
    const data = await instance.methods.isRetailer(id).call()
    setIsRetailer(data)
  } catch (error) {
    console.log("🚀 ~ error", error)
  }
}

export async function setRetailer({
  instance,
  id,
  isRetailer,
  onSuccess,
  onFailure,
}) {
  try {
    if (isRetailer) {
      await instance.methods.renounceRetailer().send({ from: id, value: 0 })
    } else {
      await instance.methods.addRetailer(id).send({ from: id, value: 0 })
    }
    onSuccess()
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function checkIsConsumer({ instance, id, setIsConsumer }) {
  try {
    const data = await instance.methods.isConsumer(id).call()
    setIsConsumer(data)
  } catch (error) {
    console.log("🚀 ~ error", error)
  }
}

export async function setConsumer({
  instance,
  id,
  isConsumer,
  onSuccess,
  onFailure,
}) {
  try {
    if (isConsumer) {
      await instance.methods.renounceConsumer().send({ from: id, value: 0 })
    } else {
      await instance.methods.addConsumer(id).send({ from: id, value: 0 })
    }
    onSuccess()
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}
