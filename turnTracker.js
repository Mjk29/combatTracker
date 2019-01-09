
var errorLog = []

function displayStartMenu() {
	var startMenuDiv = document.getElementById("startMenuDiv")
	var lineBreakDiv = document.createElement("div")
	lineBreakDiv.innerHTML="<br>"

	var startMenuLabelNew = document.createElement("button")
	startMenuLabelNew.innerHTML = "New Turn Order"
	startMenuLabelNew.setAttribute("onclick","displayNewTurnOrders()")

	var startMenuLabelLoad = document.createElement("button")
	startMenuLabelLoad.innerHTML = "Load Turn Order"
	startMenuLabelLoad.setAttribute("onclick","querySavedTurnOrders()")

	startMenuDiv.appendChild(lineBreakDiv)
	startMenuDiv.appendChild(startMenuLabelNew)
	startMenuDiv.appendChild(startMenuLabelLoad)
}

function displayNewTurnOrders() {
	var startMenuDiv = document.getElementById("startMenuDiv")
	clearDIV(startMenuDiv)

	var turnOrderTitle = document.createElement("h1")
	var turnOrderTitleText = document.createTextNode("Turn Order")
	turnOrderTitle.appendChild(turnOrderTitleText)

	var addActorBtn = document.createElement("button")
	addActorBtn.setAttribute("onclick","addActor()")
	addActorBtn.innerHTML = "Add Actor"


	var lastTurnBtn = document.createElement("button")
	lastTurnBtn.setAttribute("onclick","displayNewTurnOrders()")
	lastTurnBtn.innerHTML = "Next Turn"

	var nextTurnBtn = document.createElement("button")
	nextTurnBtn.setAttribute("onclick","displayNewTurnOrders()")
	nextTurnBtn.innerHTML = "Last Turn"

	startMenuDiv.appendChild(turnOrderTitle)

	startMenuDiv.appendChild(addActorBtn)
	startMenuDiv.appendChild(lastTurnBtn)
	startMenuDiv.appendChild(nextTurnBtn)
	
	createNewTurnOrder()
}

function createNewTurnOrder() {
	var sendData={
		queryString : 'INSERT INTO dnd_testDB.turnorderData (`timestamp`) VALUES(NOW());',
		returnFunction: null,
		returnArgs: null,
	}
	queryDatabase(sendData)
	getTurnOrderID()
}

function getTurnOrderID() {
	var sendData={
		queryString : 'SELECT * from dnd_testDB.turnorderData ORDER BY `turnorderID` DESC LIMIT 1;',
		returnFunction: setupTurnOrderID,
		returnArgs: 0,
	}
	queryDatabase(sendData)
}

var currentTurnorderID
function setupTurnOrderID(returnData, arg) {
	currentTurnorderID = returnData[0].turnorderID
	console.log("SETTING UP TURN ORDER ID"+currentTurnorderID)
}


var actorCount = 0
function addActor() {
	var turnOrderList = document.getElementById("turnOrderList")

	if (document.getElementById('startMenuTable') == null) {
		console.log("Creating table")
		var turnOrderTable = document.createElement("table")
		turnOrderTable.setAttribute("style","width:100%; border:1px solid black; table-layout: fixed;")
		turnOrderTable.setAttribute("border", "1")
		turnOrderTable.setAttribute("id", "startMenuTable")
		turnOrderList.appendChild(turnOrderTable)
	}
	else{
		turnOrderTable = document.getElementById('startMenuTable')
	}
	
	let newActor = document.createElement("tr")
	newActor.setAttribute("id",actorCount+"idNum")

	let topRow = document.createElement("tr")
	let bottomRow = document.createElement("tr")

	let actorNameNodeCell = document.createElement("td")
	actorNameNodeCell.setAttribute("colspan","2")
	actorNameNodeCell.setAttribute("style", "width:25%")

	let actorNameNode = document.createElement("input")
	actorNameNode.setAttribute("placeholder","Actor Name")
	actorNameNode.setAttribute("id",actorCount+"input")
	actorNameNode.setAttribute("style","width:100%")


	actorNameNodeCell.appendChild(actorNameNode)

	let actorNameBtnCell = document.createElement("td")
	let actorNameBtn = document.createElement("button")
	actorNameBtn.setAttribute('onclick','confirmActor('+actorCount+');')
	actorNameBtn.setAttribute("id",actorCount+"btn")
	actorNameBtn.innerHTML = "Confim"
	actorNameBtnCell.appendChild(actorNameBtn)

	topRow.appendChild(actorNameNodeCell)
	topRow.appendChild(actorNameBtnCell)
	newActor.appendChild(topRow)

	let actorPlayerCell = document.createElement("td")
	actorPlayerCell.setAttribute("style", "width:25%")
	let actorPlayerRadio = document.createElement("input")
	actorPlayerRadio.setAttribute("type","radio")
	actorPlayerRadio.setAttribute("name",actorCount+"loadDatabase")
	actorPlayerRadio.setAttribute("id",actorCount+"player")
	let actorPlayerRadioLabel= document.createTextNode("Player  ")
	actorPlayerCell.appendChild(actorPlayerRadio)
	actorPlayerCell.appendChild(actorPlayerRadioLabel)
	bottomRow.appendChild(actorPlayerCell)

	let actorMonsterCell = document.createElement("td")
	actorMonsterCell.setAttribute("style", "width:25%")
	let actorMonsterRadio = document.createElement("input")
	actorMonsterRadio.setAttribute("type","radio")
	actorMonsterRadio.setAttribute("name",actorCount+"loadDatabase")
	actorMonsterRadio.setAttribute("id",actorCount+"monster")
	actorMonsterRadio.setAttribute("checked","true")
	let actorMonsterRadioLabel= document.createTextNode("Monster  ")
	actorMonsterCell.appendChild(actorMonsterRadio)
	actorMonsterCell.appendChild(actorMonsterRadioLabel)
	bottomRow.appendChild(actorMonsterCell)

	let actorNewActorCell = document.createElement("td")
	actorNewActorCell.setAttribute("style", "width:25%")
	let actorNewActorRadio = document.createElement("input")
	actorNewActorRadio.setAttribute("type","radio")
	actorNewActorRadio.setAttribute("name",actorCount+"loadDatabase")
	actorNewActorRadio.setAttribute("id",actorCount+"actor")
	actorNewActorRadio.setAttribute("value","new")
	let actorNewActorRadioLabel= document.createTextNode("New Actor  ")
	actorNewActorCell.appendChild(actorNewActorRadio)
	actorNewActorCell.appendChild(actorNewActorRadioLabel)
	bottomRow.appendChild(actorNewActorCell)


	let actorLoadActorCell = document.createElement("td")
	actorLoadActorCell.setAttribute("style", "width:25%")
	let actorLoadActorCheckbox = document.createElement("input")
	actorLoadActorCheckbox.setAttribute("type","radio")
	actorLoadActorCheckbox.setAttribute("name",actorCount+"loadDatabase")
	actorLoadActorCheckbox.setAttribute("id",actorCount+"actor")
	actorLoadActorCheckbox.setAttribute("value","load")
	let actorLoadActorCheckboxLabel = document.createTextNode("Load Actor ")
	actorLoadActorCell.appendChild(actorLoadActorCheckbox)
	actorLoadActorCell.appendChild(actorLoadActorCheckboxLabel)
	bottomRow.appendChild(actorLoadActorCell)

	newActor.appendChild(bottomRow)

	actorCount+=1
	turnOrderTable.appendChild(newActor)
}

function confirmActor(actorNum) {
	var actorToConfirm = document.getElementById(actorNum+"input").value
	var radioElement = document.querySelector('input[name="'+actorNum+'loadDatabase"]:checked');
	var radioSel = radioElement.id
		radioSel = radioSel.substring(1)

	// If load actor, load most recent actor with same name from actorData
	if (radioSel == "actor" && radioElement.value == "load") {
		var queryString = "BEGIN NOT ATOMIC "
			+"CREATE TEMPORARY TABLE dnd_testDB.temporary_table "
			+"AS SELECT * FROM dnd_testDB.actorData "
			+"WHERE actorID =( SELECT MAX(actorID) "
			+"FROM dnd_testDB.actorData WHERE actorName = '"+actorToConfirm+"' );"

			+"UPDATE dnd_testDB.temporary_table SET turnorderID = '"+currentTurnorderID+"';"
			+"UPDATE dnd_testDB.temporary_table SET actorID = ((SELECT MAX(actorID) FROM dnd_testDB.actorData)+1);"

			+"INSERT INTO dnd_testDB.actorData "
			+"SELECT * FROM dnd_testDB.temporary_table;"

			+"SELECT * FROM dnd_testDB.actorData "
		 	+"WHERE actorID =( SELECT MAX(actorID) FROM dnd_testDB.actorData);"
			+"END;"
		
		var sendData={
			queryString : queryString,
			returnFunction: displayActorName,
			returnArgs: {actorNum,radioSel},
		}
		queryDatabase(sendData)
	}

	else if (radioSel == "actor" && radioElement.value == "new") {
		// If no name inputed set to unnammed
		if(actorToConfirm == ""){
			displayActorName([{actorName:"unnamed"}], {actorNum:actorNum, radioSel:radioSel})
			createNewActor("unnamed",actorNum)
		}
		else{
			displayActorName([{actorName:actorToConfirm}], {actorNum:actorNum, radioSel:radioSel})
			createNewActor(actorToConfirm,actorNum)	
		}
	}
	else if (radioSel == "monster" || radioSel == "player") {
		var queryString = "BEGIN NOT ATOMIC "
		+"CREATE TEMPORARY TABLE dnd_testDB.temporary_table AS SELECT * FROM dnd_testDB.actorData WHERE actorID =( SELECT MAX(actorID) FROM dnd_testDB.actorData );"

		+"UPDATE dnd_testDB.temporary_table SET actorID = actorID+1;"
		+"UPDATE dnd_testDB.temporary_table SET class = '"+actorToConfirm+"';"
		+"UPDATE dnd_testDB.temporary_table SET actorName = '"+actorToConfirm+"';"
		+"UPDATE dnd_testDB.temporary_table SET turnorderID = '"+currentTurnorderID+"';"
		+"UPDATE dnd_testDB.temporary_table SET timestamp = NOW();"

		+"UPDATE dnd_testDB.temporary_table tmp "
		    +"LEFT OUTER JOIN dnd_testDB."+radioSel+"Data table2 "
		    +"ON tmp.class = table2.actorName "
		    +"SET tmp.speed = table2.speed, "
		    	+"tmp.armorClass = table2.armorClass, "
		    	+"tmp.currentHitPoints = table2.maxHitPoints, "
		    	+"tmp.maxHitPoints = table2.maxHitPoints "
		    	if (radioSel == "player") {
		    		queryString +=", tmp.notes = table2.notes, "
		    					+"tmp.conditions = table2.conditions "
		    	}
		   queryString += "WHERE table2.actorName = tmp.class;"
		   
		+"INSERT INTO dnd_testDB.actorData SELECT * FROM dnd_testDB.temporary_table;"

		+"END;"

		console.log(queryString)



	}


}

function createNewActor(actorName, actorNum, actorData){
console.log("CREATENEWACTOR")
console.log(actorName)
console.log(actorNum)
console.log(actorData)


	if (actorData == null) {
		var queryString = "BEGIN NOT ATOMIC "
			+"INSERT INTO dnd_testDB.actorData"
			+"(actorName, turnorderID)"
			+"VALUES('"+actorName+"','"+currentTurnorderID+"');"
			+"SELECT * FROM dnd_testDB.actorData "
			+"WHERE actorID =( SELECT MAX(actorID) FROM dnd_testDB.actorData);"
			+"END"
	}
	else{
		var queryString = "INSERT INTO dnd_testDB.actorData"
			+"(actorName, class, armorClass, currentHitPoints, maxHitPoints, speed, conditions, notes, inventory, turnorderID)"
			+"VALUES('"+actorName+"','"+currentTurnorderID+"');"
	}
	var sendData={
		queryString:  queryString,
		returnFunction: displayActorName,
		returnArgs: {actorNum:actorNum}
	}
	queryDatabase(sendData)
}



function createInspectElements(actorData, returnArgs) {
	console.log(returnArgs)
	
	try{var actorData = actorData[0]}
	catch(e){errorLog.push(e)}

	console.log("CreatreInspectElement Actor Data")
	console.log(actorData)

	var inspectDiv = document.getElementById("inspectActorDiv")
	clearDIV(inspectDiv)

	var inspectActorData = document.createElement("div")
	inspectActorData.setAttribute("id","inspectActorData")
	inspectActorData.setAttribute("style","  display: none;")
	
	var inspectActorDB = document.createAttribute("actorDB")
	inspectActorDB.value = returnArgs.actorDB
	inspectActorData.setAttributeNode(inspectActorDB)
	
	var inspectActorID = document.createAttribute("actorID")
	inspectActorID.value = actorData.actorID
	inspectActorData.setAttributeNode(inspectActorID)

	inspectDiv.appendChild(inspectActorData)

	var inspectTable = document.createElement("table")
	inspectTable.setAttribute("id","inspectTable")
	inspectTable.setAttribute("border","1")
	inspectTable.setAttribute("style","width:100%; margin-top: 5%; font-size:2em;")

	var nameRow = document.createElement("tr")
	var nameTitle = document.createElement("td")
	nameTitle.setAttribute("style","width:25%;")
	nameTitle.innerHTML="Name : "
	var nameData = document.createElement("td")
	nameData.setAttribute("contenteditable", "true")
	nameData.setAttribute("style","width:75%;")
	nameData.setAttribute("id","actorNameElement")

	try{
		nameData.innerHTML = actorData.actorName
	}
	catch(e){errorLog.push(e)}
	nameRow.appendChild(nameTitle)
	nameRow.appendChild(nameData)

	var classRow = document.createElement("tr")
	var classTitle = document.createElement("td")
	classTitle.setAttribute("style","width:25%;")
	classTitle.innerHTML="Class : "
	var classData = document.createElement("td")
	classData.setAttribute("contenteditable", "true")
	classData.setAttribute("style","width:75%;")
	classData.setAttribute("id","classDataElement")
	try{classData.innerHTML = actorData.class}
	catch(e){errorLog.push(e)}
	classRow.appendChild(classTitle)
	classRow.appendChild(classData)

	var statTableRow = document.createElement("tr")
	var statTableTD = document.createElement("td")
	statTableTD.setAttribute("colspan","2")

	var statTable = document.createElement("table")
	statTable.setAttribute("style","width:100%; text-align: center;")
	statTable.setAttribute("border","1;")

	var statRowTop = document.createElement("tr")
	statRowTop.setAttribute("style","width:100%; height:2em;")
	
	var hpLabelCurrent = document.createElement("td")
	hpLabelCurrent.setAttribute("style","width:25%;")
	hpLabelCurrent.innerHTML = "HP Current"
	var hpLabelMax = document.createElement("td")
	hpLabelMax.setAttribute("style","width:25%;")
	hpLabelMax.innerHTML = "HP Max"

	var acLabel = document.createElement("td")
	acLabel.setAttribute("style","width:25%;")
	acLabel.innerHTML = "AC"
	var speedLabel = document.createElement("td")
	speedLabel.setAttribute("style","width:25%;")
	speedLabel.innerHTML = "SP"
	statRowTop.appendChild(hpLabelCurrent)
	statRowTop.appendChild(hpLabelMax)
	statRowTop.appendChild(acLabel)
	statRowTop.appendChild(speedLabel)

	var statRowBot = document.createElement("tr")
	statRowBot.setAttribute("style","width:100%; height:2em;")
	
	var hpDataCurrent = document.createElement("td")
	hpDataCurrent.setAttribute("style","width:25%;")
	hpDataCurrent.setAttribute("contenteditable", "true")
	hpDataCurrent.setAttribute("id","hpDataCurrentElement")
	try{hpDataCurrent.innerHTML = actorData.currentHitPoints}
	catch(e){errorLog.push(e)}	

	var hpDataMax = document.createElement("td")
	hpDataMax.setAttribute("style","width:25%;")
	hpDataMax.setAttribute("contenteditable", "true")
	hpDataMax.setAttribute("id","hpDataMaxElement")
	try{hpDataMax.innerHTML = actorData.maxHitPoints}
	catch(e){errorLog.push(e)}	

	var acData = document.createElement("td")
	acData.setAttribute("style","width:25%;")
	acData.setAttribute("contenteditable", "true")
	acData.setAttribute("id","acDataElement")
	try{acData.innerHTML = actorData.armorClass}
	catch(e){errorLog.push(e)}	
	
	var speedData = document.createElement("td")
	speedData.setAttribute("style","width:25%;")
	speedData.setAttribute("contenteditable", "true")
	speedData.setAttribute("id","speedDataElement")
	try{speedData.innerHTML = actorData.speed}
	catch(e){errorLog.push(e)}	

	statRowBot.appendChild(hpDataCurrent)
	statRowBot.appendChild(hpDataMax)
	statRowBot.appendChild(acData)
	statRowBot.appendChild(speedData)
	statTable.appendChild(statRowTop)
	statTable.appendChild(statRowBot)
	statTableTD.appendChild(statTable)
	statTableRow.appendChild(statTableTD)

	var conditionsRow = document.createElement("tr")
	var conditionsTitle = document.createElement("td")
	conditionsTitle.setAttribute("style","width:25%;")
	conditionsTitle.innerHTML="Conditions"
	var conditionsData = document.createElement("td")
	conditionsData.setAttribute("contenteditable", "true")
	conditionsData.setAttribute("style","width:75%;")
	conditionsData.setAttribute("id","conditionsDataElement")
	try{conditionsData.innerHTML = actorData.conditions}
	catch(e){errorLog.push(e)}
	conditionsRow.appendChild(conditionsTitle)
	conditionsRow.appendChild(conditionsData)
	
	var notesRow = document.createElement("tr")
	var notesTitle = document.createElement("td")
	notesTitle.setAttribute("style","width:25%;")
	notesTitle.innerHTML="Notes"
	var notesData = document.createElement("td")
	notesData.setAttribute("contenteditable", "true")
	notesData.setAttribute("style","width:75%;")
	notesData.setAttribute("id","notesDataElement")
	try{notesData.innerHTML = actorData.notes}
	catch(e){errorLog.push(e)}
	notesRow.appendChild(notesTitle)
	notesRow.appendChild(notesData)

	var inventoryRow = document.createElement("tr")
	var inventoryTitle = document.createElement("td")
	inventoryTitle.setAttribute("style","width:25%;")
	inventoryTitle.innerHTML="Inventory"
	var inventoryData = document.createElement("td")
	inventoryData.setAttribute("contenteditable", "true")
	inventoryData.setAttribute("style","width:75%;")
	inventoryData.setAttribute("id","inventoryDataElement")
	try{inventoryData.innerHTML = actorData.inventory}
	catch(e){errorLog.push(e)}
	inventoryRow.appendChild(inventoryTitle)
	inventoryRow.appendChild(inventoryData)


	var inspectUpdateBtnRow = document.createElement("tr")
	var inspectUpdateBtnTD = document.createElement("td")
	inspectUpdateBtnTD.setAttribute("style","width:100%; text-align:center")
	inspectUpdateBtnTD.setAttribute("colspan","4")
	var inspectUpdateBtn = document.createElement("button")
	inspectUpdateBtn.setAttribute("onclick","updateActorDB("+returnArgs.actorNum+",\""+returnArgs.actorDB+"\")")
	inspectUpdateBtn.innerHTML = "Update"

	inspectUpdateBtnTD.appendChild(inspectUpdateBtn)
	inspectUpdateBtnRow.appendChild(inspectUpdateBtnTD)

	inspectTable.appendChild(nameRow)
	inspectTable.appendChild(classRow)
	inspectTable.appendChild(statTableRow)
	inspectTable.appendChild(conditionsRow)
	inspectTable.appendChild(notesRow)
	inspectTable.appendChild(inventoryRow)
	inspectTable.appendChild(inspectUpdateBtnRow)
	inspectDiv.appendChild(inspectTable)
}


function updateActorDB(actorNum, actorDB) {
	var newActorName = document.getElementById("actorNameElement").innerHTML
	queryString = 
	"BEGIN NOT ATOMIC "
	+"UPDATE dnd_testDB.actorData "
	+"SET actorName='"+newActorName+"',"
	+"class='"+document.getElementById("classDataElement").innerHTML+"',"
	+"armorClass='"+document.getElementById("acDataElement").innerHTML+"',"
	+"currentHitPoints='"+document.getElementById("hpDataCurrentElement").innerHTML+"',"
	+"maxHitPoints='"+document.getElementById("hpDataMaxElement").innerHTML+"',"
	+"speed='"+document.getElementById("speedDataElement").innerHTML+"',"
	+"conditions='"+document.getElementById("conditionsDataElement").innerHTML+"',"
	+"notes='"+document.getElementById("notesDataElement").innerHTML+"',"
	+"inventory='"+document.getElementById("inventoryDataElement").innerHTML+"'"
	+"WHERE actorID='"+document.getElementById("inspectActorData").attributes.actorID.value+"'"
	+"AND turnorderID='"+currentTurnorderID+"';"

	+"SELECT * FROM dnd_testDB.actorData "
	+"WHERE actorID='"+document.getElementById("inspectActorData").attributes.actorID.value+"'"
	+"AND turnorderID='"+currentTurnorderID+"';"
	+"END;"



	console.log(queryString)

	var returnArgs = {actorNum:actorNum, radioSel:actorDB}
	var sendData={
		queryString:  queryString,
		returnFunction: displayActorName,
		returnArgs: returnArgs
	}
	queryDatabase(sendData)
}

function printResponse(response, args) {
	console.log("printResponse")
	console.log(response)
	console.log(args)

}


function displayActorName(actorData, returnArgs) {
	console.log("displayActorName")
	console.log(actorData)
	if (actorData.length == 0) {
		alert("No actor found")
		return
	}
	try{
		if (actorData[0][0].actorName != undefined) {
			actorData = actorData[0]
			returnArgs.radioSel = "actor"
		}
	}
	catch(e){errorLog.push(e)}

	displayActorData = actorData
	displayArgs = returnArgs
	console.log("DISPLAYACTORNAME")
	console.log(actorData)
		console.log(returnArgs)
	var actorToClear = document.getElementById(returnArgs.actorNum+"idNum")
	
	clearDIV(actorToClear)

	var displayRow = document.createElement("tr")

	var currentTurn = document.createElement("td")
	currentTurn.setAttribute("style", "width:15%; font-size:2em")
	currentTurn.innerHTML="-->"
	displayRow.appendChild(currentTurn)

	var actorName = document.createElement("td")
	actorName.setAttribute("style", "width:65%; font-size:2em; text-align: center")
	actorName.setAttribute("id", returnArgs.actorNum+"actorName")
	actorName.value = actorData[0].actorID	
	var turnOrderTitleText = document.createTextNode(actorData[0].actorName)
	actorName.appendChild(turnOrderTitleText)
	displayRow.appendChild(actorName)

	var actorInspectTD = document.createElement("td")
	var actorInspectBtn = document.createElement("button")
	actorInspectBtn.setAttribute("style", "width:100%; font-size:1em")
	actorInspectBtn.setAttribute("id", returnArgs.actorNum+"actorInspectBtn")
	actorInspectBtn.setAttribute("onclick", 'inspectActor("'+actorData[0].actorID+'","'+returnArgs.radioSel+'","'+returnArgs.actorNum+'")')
	actorInspectBtn.innerHTML="Inspect"

	actorInspectTD.appendChild(actorInspectBtn)
	displayRow.appendChild(actorInspectTD)



	actorToClear.appendChild(displayRow)
}


function inspectActor(actorID, actorDB, actorNum){
	console.log(actorID)
	console.log(actorDB)
	var sendData={
		queryString: "SELECT * FROM dnd_testDB."+actorDB+"Data WHERE actorID = '"+actorID+"'",
		returnFunction: createInspectElements,
		returnArgs: {actorNum:actorNum,actorDB:actorDB}
	}
	queryDatabase(sendData)
}

function displayInspectActor(actorData, actorNum){
	console.log(actorData)

}







function querySavedTurnOrders() {
	// Get saved turn orders from DB
	var sendData={
		queryString: "SELECT * FROM dnd_testDB.turnorderData",
		returnFunction: displaySavedTurnOrders,
		returnArgs: 0,
	}
	queryDatabase(sendData)
}

function displaySavedTurnOrders(returnedData,arg2) {
	turnorderDataList = returnedData
	var startMenuDiv = document.getElementById("startMenuDiv")

	clearDIV(startMenuDiv)
	let lineBreak = document.createElement("hr")
	startMenuDiv.appendChild(lineBreak)

	for (loadedTurn in returnedData){
		console.log(returnedData[loadedTurn])
		let LT = document.createElement("button")
		LT.setAttribute("onclick","selectTurnOrder("+returnedData[loadedTurn].turnorderID+")")

		let lineBreak = document.createElement("hr")
		LT.innerHTML = returnedData[loadedTurn].timestamp
		startMenuDiv.appendChild(LT)
		startMenuDiv.appendChild(lineBreak)

	}
}


function selectTurnOrder(turnorderID) {
	selectedTurnOrder = turnorderDataList.find(x => x.turnorderID === String(turnorderID))
	var startMenuDiv = document.getElementById("startMenuDiv")
	clearDIV(startMenuDiv)
}

function generateSampleJson() {
	element = []
	element.push({id:"Secus",db:"playerData"})
	element.push({id:"Buffalo",db:"playerData"})
	element.push({id:"Wilton",db:"actorData"})
	element.push({id:"tarrasque",db:"monsterData"})

	jsoned = JSON.stringify(element)
}




function clearDIV(divID) {
	while (divID.firstChild) {
		divID.removeChild(divID.firstChild);
	}
}


function queryDatabase(sendData) {
	var sending = JSON.stringify(sendData)
	$.ajax({
		type: 'POST',
		url: "http://127.0.0.1:1337/",
		data: sending,
		contentType: 'application/json',
		success: function(data) {
			if (sendData.returnFunction != null) {
				sendData.returnFunction(data, sendData.returnArgs)
			}
		},
	});
}
