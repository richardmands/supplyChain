export async function getCurrentSku({ instance, onSuccess }) {
  try {
    const sku = await instance.methods.getCurrentSku().call()
    onSuccess(sku)
  } catch (error) {
    console.log("🚀 ~ error", error)
  }
}

async function getCrop({ instance, sku }) {
  try {
    const item = await instance.methods.getItem(sku).call()
    return item
  } catch (error) {
    console.log("🚀 ~ error", error)
    return null
  }
}

export async function getCrops({ instance, skus, setCrops, onFinish }) {
  const promises = skus.map((sku) => getCrop({ instance, sku }))

  Promise.allSettled(promises)
    .then((results) => {
      const crops = {}
      results.forEach((result) => {
        if (result.value.sku > 0) {
          crops[result.value.sku] = { ...result.value }
        }
      })
      setCrops(crops)
      onFinish()
    })
    .catch((error) => {
      console.log("🚀 ~ error", error)
      onFinish()
    })
}

export async function harvestCrop({
  instance,
  id,
  isFarmer,
  farmName,
  farmInformation,
  farmLatitude,
  farmLongitude,
  productNotes,
  onSuccess,
  onFailure,
}) {
  try {
    if (isFarmer) {
      const bool = await instance.methods
        .harvestItem(
          farmName,
          farmInformation,
          farmLatitude,
          farmLongitude,
          productNotes
        )
        .send({ from: id, value: 0 })
      console.log("🚀 ~ bool", bool)
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function processCrop({
  instance,
  id,
  isFarmer,
  sku,
  gasPrice,
  gasLimit,
  onSuccess,
  onFailure,
}) {
  try {
    if (isFarmer) {
      await instance.methods
        .processItem(sku)
        .send({ from: id.toLowerCase(), value: 0, gasLimit, gasPrice })
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function packCrop({
  instance,
  id,
  isFarmer,
  sku,
  onSuccess,
  onFailure,
}) {
  try {
    if (isFarmer) {
      await instance.methods.packItem(sku).send({ from: id, value: 0 })
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function sellCrop({
  instance,
  id,
  isFarmer,
  sku,
  productPrice,
  onSuccess,
  onFailure,
}) {
  try {
    if (isFarmer) {
      await instance.methods
        .sellItem(sku, productPrice)
        .send({ from: id, value: 0 })
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function buyCrop({
  instance,
  id,
  isDistributor,
  sku,
  productPrice,
  onSuccess,
  onFailure,
}) {
  try {
    if (isDistributor) {
      await instance.methods
        .buyItem(sku)
        .send({ from: id, value: productPrice })
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function markCropAsShipped({
  instance,
  id,
  isDistributor,
  sku,
  retailerID,
  onSuccess,
  onFailure,
}) {
  try {
    if (isDistributor) {
      await instance.methods
        .shipItem(sku, retailerID)
        .send({ from: id, value: 0 })
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function receiveCrop({
  instance,
  id,
  isRetailer,
  sku,
  onSuccess,
  onFailure,
}) {
  try {
    if (isRetailer) {
      await instance.methods.receiveItem(sku).send({ from: id, value: 0 })
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}

export async function purchaseCrop({
  instance,
  id,
  isConsumer,
  sku,
  onSuccess,
  onFailure,
}) {
  console.log("🚀 ~ purchaseCrop")
  try {
    if (isConsumer) {
      await instance.methods.purchaseItem(sku).send({ from: id, value: 0 })
      onSuccess()
    } else {
      onFailure()
    }
  } catch (error) {
    console.log("🚀 ~ error", error)
    onFailure()
  }
}
