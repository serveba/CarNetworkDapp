// The public file for automated testing can be found here: https://gist.github.com/ConsenSys-Academy/e9ec0d8d6c53b56ca9673cfa139b5644

var Car = artifacts.require('car')
let catchRevert = require("./exceptionsHelpers.js").catchRevert
const BN = web3.utils.BN

contract('Car', function(accounts) {

    const firstAccount = accounts[0]
    const secondAccount = accounts[1]
    const thirdAccount = accounts[2]


    const make = "Toyota"
    const model = "Camry"
    const chassisId = "SV30-0169266"
    const manufacturingYear = 2019
    const pictureUrl = "https://cars.usnews.com/static/images/Auto/izmo/i94428619/2019_toyota_camry_angularfront.jpg"
    const carDescription = "Good car"

    const eventType = "REVISION"
    const createdAt = "2020-01-30T18:00:15-07:00"
    const attachmentUrl = "https://cars.usnews.com/static/images/Auto/izmo/i94428619/2019_toyota_camry_angularfront.jpg"
    const eventDescription = "Changing tyres"


    let instance

    beforeEach(async () => {
        instance = await Car.new()
    })

    describe("Setup", async() => {

        it("OWNER should be set to the deploying address", async() => {
            const owner = await instance.owner()
            assert.equal(owner, firstAccount, "the deploying address should be the owner")
        })

        it("Check total supply when deploying the contract", async() => {
            instance = await Car.new()
            const totalSupply = await instance.totalSupply()
            
            assert.equal(totalSupply, 0, "the total supply must be one")
        })
    })

    describe("Functions", () => {

        it("mint() anyone can create a new car token", async () => {
            await instance.mint(make, model, chassisId, manufacturingYear, carDescription, pictureUrl)
            const totalSupply = await instance.totalSupply()
            
            assert.equal(totalSupply, 1, "Error minting the token")
        })

        it("checking tokenIds; anyone can retrieve its own token Ids", async () => {
            await instance.mint(make, model, chassisId, manufacturingYear, carDescription, pictureUrl)
            await instance.mint(make, model, chassisId, manufacturingYear, carDescription, pictureUrl)

            const balance = await instance.balanceOf(firstAccount);
            const tokenId1 = await instance.tokenOfOwnerByIndex(firstAccount, 0);
            const tokenId2 = await instance.tokenOfOwnerByIndex(firstAccount, 1);
            
            assert.equal(balance, 2, "Error with the balance")
            assert.equal(tokenId1, 1, "Error tokenId1 must be one")
            assert.equal(tokenId2, 2, "Error tokenId2 must be two")
        })

        it("addCarEvent() and getCarEvent(); the owner can add a new car event", async () => {
            await instance.mint(make, model, chassisId, manufacturingYear, carDescription, pictureUrl)       
            const tokenId = await instance.tokenOfOwnerByIndex(firstAccount, 0);

            await instance.addCarEvent(tokenId, eventType, createdAt, attachmentUrl, eventDescription)
            
            const data = await instance.getCarEvent(tokenId, 0)

            assert.equal(data[0], eventType, "Error with the eventType")
            assert.equal(data[1], createdAt, "Error with the createdAt")
            assert.equal(data[2], attachmentUrl, "Error with the attachmentUrl")
            assert.equal(data[3], eventDescription, "Error with the eventDescription")
        })        
    })

    describe("Circuit breaker pattern", () => {

        it("Freezes well", async () => {
            await instance.mint(make, model, chassisId, manufacturingYear, carDescription, pictureUrl)
            const tokenId = await instance.tokenOfOwnerByIndex(firstAccount, 0);    
    
            await instance.freeze()       
            await catchRevert(instance.addCarEvent(tokenId, eventType, createdAt, attachmentUrl, eventDescription))
        })

        it("Unfreezes well", async () => {
            await instance.mint(make, model, chassisId, manufacturingYear, carDescription, pictureUrl)
            const tokenId = await instance.tokenOfOwnerByIndex(firstAccount, 0);

            await instance.freeze()
            await catchRevert(instance.addCarEvent(tokenId, eventType, createdAt, attachmentUrl, eventDescription))
            await instance.unfreeze()

            await instance.addCarEvent(tokenId, eventType, createdAt, attachmentUrl, eventDescription)

            const data = await instance.getCarEvent(tokenId, 0)

            assert.equal(data[0], eventType, "Error with the eventType")
        })
    })


})


