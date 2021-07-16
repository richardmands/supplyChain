const SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    before(async () => {
        supplyChain = await SupplyChain.deployed()
    })
    
    // 1st Test
    describe('SupplyChain functions correctly', () => {
        before("See accounts", async () => {
            console.log("ganache-cli accounts used here...")
            console.log("🚀 ~ accounts", accounts)
            console.log("Contract Owner: accounts[0] ", accounts[0])
            console.log("Farmer: accounts[1] ", accounts[1])
            console.log("Distributor: accounts[2] ", accounts[2])
            console.log("Retailer: accounts[3] ", accounts[3])
            console.log("Consumer: accounts[4] ", accounts[4])
        })

        it('setFarmer() / isFarmer()', async () => {
            await supplyChain.addFarmer(accounts[1])
            const isFarmer1 = await supplyChain.isFarmer(accounts[1])
            const isFarmer2 = await supplyChain.isFarmer(accounts[0])
            assert.equal(isFarmer1, true, 'Error: Should be Farmer')
            assert.equal(isFarmer2, false, 'Error: Should not be Farmer')
        })
       
        
        it('setDistributor() / isDistributor()', async () => {
            await supplyChain.addDistributor(accounts[2])
            const isDistributor1 = await supplyChain.isDistributor(accounts[2])
            const isDistributor2 = await supplyChain.isDistributor(accounts[0])
            assert.equal(isDistributor1, true, 'Error: Should be Distributor')
            assert.equal(isDistributor2, false, 'Error: Should not be Distributor')
        })
        
        it('setRetailer() / isRetailer()', async () => {
            await supplyChain.addRetailer(accounts[3])
            const isRetailer1 = await supplyChain.isRetailer(accounts[3])
            const isRetailer2 = await supplyChain.isRetailer(accounts[0])
            assert.equal(isRetailer1, true, 'Error: Should be Retailer')
            assert.equal(isRetailer2, false, 'Error: Should not be Retailer')
        })
        
        it('setConsumer() / isConsumer()', async () => {
            await supplyChain.addConsumer(accounts[4])
            const isConsumer1 = await supplyChain.isConsumer(accounts[4])
            const isConsumer2 = await supplyChain.isConsumer(accounts[0])
            assert.equal(isConsumer1, true, 'Error: Should be Consumer')
            assert.equal(isConsumer2, false, 'Error: Should not be Consumer')
        })
        
        it('harvestItem()', async () => {
            const farm1 = {
                name: 'Farmville',
                info: 'Many chickens and pigs.',
                lat: -102.2,
                long: 37.9
            }

            const productNotes = "Full bodied with lovely aroma."

            const sku1 = await supplyChain.getCurrentSku()
            assert.equal(sku1, 1, 'Error: wrong Sku!')

            try {
                await supplyChain.harvestItem(
                    farm1.name, farm1.info, farm1.lat, farm1.long, productNotes, { from : accounts[3] }
                )
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            
            await supplyChain.harvestItem(
                farm1.name, farm1.info, farm1.lat, farm1.long, productNotes, { from : accounts[1] }
            )
                
            const sku2 = await supplyChain.getCurrentSku()
            assert.equal(sku2, 2, 'Error: wrong Sku!')
        }) 
        
        it('getItem()', async () => {
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.originFarmerID, accounts[1])
            assert.equal(item1.originFarmName, 'Farmville')
            assert.equal(item1.productNotes, 'Full bodied with lovely aroma.')
            assert.equal(item1.itemState, '0')
        }) 
        
        it('processItem()', async () => {
            try {
                await supplyChain.processItem(1, { from : accounts[0]})
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            await supplyChain.processItem(1, { from : accounts[1]})
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.itemState, '1')
        }) 
      
        it('packItem()', async () => {
            try {
                await supplyChain.packItem(1, { from : accounts[2]})
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            await supplyChain.packItem(1, { from : accounts[1]})
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.itemState, '2')
        }) 
       
        it('sellItem()', async () => {
            try {
                await supplyChain.sellItem(1, web3.utils.toWei("2", "ether"), { from : accounts[0]})
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            await supplyChain.sellItem(1, web3.utils.toWei("2", "ether"), { from : accounts[1]})
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.itemState, '3')
        }) 
     
        it('buyItem()', async () => {
            // error as accounts[3] is not a distributor
            try {
                await supplyChain.buyItem(1, { from : accounts[3], value: web3.utils.toWei("3", "ether")})
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            
            await supplyChain.buyItem(1, { from : accounts[2], value: web3.utils.toWei("3", "ether")})
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.itemState, '4')
            assert.equal(item1.productPrice, 2000000000000000000)
            assert.equal(item1.distributorID, accounts[2])
        }) 
        
        it('shipItem()', async () => {
            try {
                await supplyChain.shipItem(1, accounts[3], { from : accounts[3] })
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            await supplyChain.shipItem(1, accounts[3], { from : accounts[2] })
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.itemState, '5')
            assert.equal(item1.retailerID, accounts[3])
        }) 
       
        it('receiveItem()', async () => {
            try {
                await supplyChain.receiveItem(1, { from : accounts[4] })
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            await supplyChain.receiveItem(1, { from : accounts[3] })
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.itemState, '6')
        }) 
       
        it('purchaseItem()', async () => {
            try {
                await supplyChain.purchaseItem(1, { from : accounts[3] })
            } catch (error) {
                console.log("🚀 ~ error.data.name", error.data.name)
                assert.equal(error.data.name, 'RuntimeError', "Wrong error message");
            }
            await supplyChain.purchaseItem(1, { from : accounts[4] })
            const item1 = await supplyChain.getItem(1)
            assert.equal(item1.itemState, '7')
        }) 
    })
});

