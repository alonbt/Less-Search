$(document).ready(function(){
        lessSearch.init($("#searchLessString"));
		lessForm.init();
});

var lessSearch = {
    params : {
        searchTxt: "",
        searchTxtArr: [],
        data: "",
        originalData: "",
        matches : [],
        searchTxtCombArr : [],
        CombArrayByIndex : [],
        allMatches : [],
        allMatches1 : [],
        listOfMatches : []
    },
    init: function(inputObj) {
		
		//Init design elements
		lessDesign.onLoad();
		
        lessSearch.getData();
        lessSearch.displayData();
        lessSearch.getSearch(inputObj);
        
        inputObj.keyup(function(event) {
			lessDesign.erase();
            lessSearch.params.data = lessSearch.params.originalData;
            lessSearch.getSearch($(this));
                
            if (lessSearch.params.CombArrayByIndex[0] != null) {
                for (var que = 0; que < lessSearch.params.CombArrayByIndex[0].length; que++) {
                    lessSearch.changeData(lessSearch.params.data, 0, que, 0);
                }
            }
            lessSearch.params.listOfMatches = lessSearch.params.listOfMatches.sort(sortNumber);
			lessSearch.params.listOfMatches = removeDuplicatesFromListOfMatches(lessSearch.params.listOfMatches);
            lessSearch.params.data = lessSearch.highlightText(lessSearch.params.data,lessSearch.params.listOfMatches);
            lessSearch.displayData();			
            lessSearch.params.listOfMatches = [];    
			
			lessDesign.init();        
        });
        
    },
    changeData: function(dataChunk,index,caIndex,startPosition) {
        var newStartPosition;
        if (index < lessSearch.params.searchTxtCombArr[caIndex].length) {
            if (lessSearch.params.searchTxtCombArr[caIndex][index] != "") {
                var newDataChunk="";
                var ListOfMatches = lessSearch.matchStrings(dataChunk,lessSearch.params.CombArrayByIndex[index],startPosition,caIndex,index);
                for (var i=0; i < ListOfMatches.length; i++) {
                    newDataChunk = lessSearch.getnewDataChunk(dataChunk,ListOfMatches[i].end-startPosition,index).dataChunk;
                    startPosition += lessSearch.getnewDataChunk(dataChunk,ListOfMatches[i].end-startPosition,index).slicedFromStart;
                    lessSearch.changeData(newDataChunk,index+1,caIndex,startPosition);
                }
            }        
        }
        return dataChunk;
    },
    InsertSmallChunkToBigChunk: function(Small,Big,Pos) {
        dataChunk = Big.substr(0,Pos) + Small + Big.substr(Pos);
        return dataChunk;
        
    },
    sliceOutChunkAfterMatch: function(dataChunk,endNumber) {
        var startSlice = dataChunk.substr(0,endNumber);
        var restOfSlice = dataChunk.substr(endNumber,dataChunk.length);
        if (restOfSlice.match(/{/gi) != null) {
            var position = lessSearch.findClosingBracketPosition(restOfSlice);
            dataChunk = startSlice + restOfSlice.substr(0,position.start) + restOfSlice.substr(position.end+1,restOfSlice.length);    
        } else {
            dataChunk = startSlice + restOfSlice;
        }
        return dataChunk;
        
    },
    getnewDataChunk: function(dataChunk,matchEndPoint,index) {
        var obj = {};
        var dataChunkLength = dataChunk.length;
        dataChunk = dataChunk.substr(matchEndPoint);
        for (var i=0; i < dataChunk.length; i++){
            //If there is another word after the expression then don't look for brackets
            if (((dataChunk[i] != " ") && (dataChunk[i] != "{"))) {
                i = dataChunk.length;
                break;
            }
            //if there is an open bracket it is the chunk we where looking for
            if (dataChunk[i] == "{") {
                i++;
                break;
            }
        }
        
        obj.slicedFromStart = i+matchEndPoint;
        dataChunk = dataChunk.substr(i);
        var bracketCount = 1;
        /*if (index == 0) {
            bracketCount = 0;
        }*/
        var mustPassOnClosingBraket = false;
        for (var i=0; i < dataChunk.length; i++){
            if (dataChunk[i] == "{") {
                bracketCount++;
            }
            if (dataChunk[i] == "}") {
                bracketCount--;
                mustPassOnClosingBraket = true;
            }
            if ((bracketCount == 0) && mustPassOnClosingBraket) {
                break;
            }
        }
        obj.slicedFromEnd =    dataChunkLength - i;
        obj.dataChunk = dataChunk.substr(0,i-1);
        return obj;
        
    },
    findClosingBracketPosition: function(dataChunk) {  
        var positionData = {};
        positionData.start = 0;
        var braceCount = 1;        
        for (q=0; q < (dataChunk.length); q++) {
            if (dataChunk.charAt(q) == "{"){
                if (braceCount == 0) {
                    //positionData.start = q;
                }
                braceCount++;
            }
            if (dataChunk.charAt(q) == "}")
            {
                braceCount--;
                if (braceCount < 0) {

                }
            }    
            if ((dataChunk.charAt(q) == "}") && (braceCount==0)){
                positionData.end = q-1;
                break;
            }            
        }
        return positionData;
    },
    getData: function() {
        lessSearch.params.data = lessSearch.params.originalData;
    },
    displayData: function() {
        $('#lessCode pre').html(lessSearch.params.data);
    },
    getSearch: function(Obj) {
        lessSearch.params.searchTxt = $(Obj).val();
        lessSearch.params.searchTxtCombArr = arrangeArrayChars.getVariationsFromString(lessSearch.params.searchTxt);
        lessSearch.params.CombArrayByIndex = arrangeArrayChars.arrangeCombeArrayByIndex(lessSearch.params.searchTxtCombArr);
        
    },
    matchStrings: function(string,expArr,startPosition,i,level) {
        var matches = [];
        var toPushIt;
        var tempString;
		var variationArr = getCloseBracketVariation(expArr[i]);
		for (var t=0; t < variationArr.length; t++) {
	        if (variationArr[t] != "") {
	            var regexp;
	            //if it is the most outer search then search for only full words
	            if (level==0) {
	                regexp = new RegExp(RegExp.quote(variationArr[t]) + '\\b', 'g');
	                //regexp = new RegExp(RegExp.quote(variationArr[t]), 'g');    
	            //all other searches - search for any expression         
	            } else {
					//regexp = new RegExp(RegExp.quote(variationArr[t]) + '\\b', 'g');
	                regexp = new RegExp(RegExp.quote(variationArr[t]), 'g');    
	            }
	            tempString = MakeInnerBraketsWhiteSpace(string);
	            while ((match = regexp.exec(tempString)) != null) {
	                var obj = {};
	                obj.start = match.index + startPosition;
	                obj.end = obj.start + variationArr[t].length;
					obj.level = level
	                lessSearch.params.allMatches.push(obj);
	                toPushIt = true;
	                for (var q=0; q < lessSearch.params.listOfMatches.length; q++) {
	                    //Exclude elements without ampersand that has ampersand before them
	                    if ((match.index-1) >=0) {                
	                        if (tempString[match.index-1] == "&"){
	                            toPushIt = false;
	                        }                
	                    }
	                }
	                if (toPushIt) {
	                    lessSearch.params.listOfMatches.push(obj);
	                    matches.push(obj);
	                }
	            }
	        }			
		}
        return (matches);
    },
    highlightText: function(dataChunk,ListOfMatches) {
        for (var i=0; i < ListOfMatches.length; i++){
            dataChunk = dataChunk.substr(0, ListOfMatches[i].end) + "</span>" + dataChunk.substr(ListOfMatches[i].end);
            dataChunk = dataChunk.substr(0, ListOfMatches[i].start) + "<span class='highlighted level" + ListOfMatches[i].level +" " + ListOfMatches[i].lastLevel + "'>" + dataChunk.substr(ListOfMatches[i].start);
        }
        return dataChunk;
    },
};

var arrangeArrayChars = {
    variables : {
        
    },
    sliceStrings: function(str) {
        var obj = {}
        var slicePosition = str.search(" ");
        obj.strStart = str.slice(0,slicePosition);
        obj.strEnd = str.slice(slicePosition);
        var q=0;
        
        while ((obj.strEnd[q] == " ") && (obj.strEnd != null)) {
            obj.strEnd = obj.strEnd.slice(1,obj.strEnd.length);
        }
        
        return (obj);    
    },
    getVariationsFromString: function(str) {
        str = arrangeArrayChars.RemoveUnwantedWhiteSpace(str);
        var strArr = str.match(/( [.#:\[]|[.#:\[])?[^.#:\[ ]+/g);

        removeWhiteSpaceBetweeSquareBrackets(strArr);
        var combArr = [];
        if (strArr != null) {
            combNumber = Math.pow(2,(strArr.length -1));
            for (i=0; i <strArr.length; i++) {
                for (var q=0; q < combNumber; q++) {
                    if (combArr[q] == null) {
                        combArr[q] = [];
                    }
                    if (Math.floor(q/(Math.pow(2,strArr.length-i-1)) % 2) <= 0) {   
                        //if not a special character just push it in
                        if (!strArr[i].match(/[.#:\[]/g) || (i == 0)) {
                            combArr[q].push(strArr[i]);
        
                        } else {
                        //if it is a special character with space before it
                                if (strArr[i].match(/ ([.#:\[])/g)){
                                combArr[q].push(strArr[i].slice(1,strArr[i].length));
                                
                                } else {
                        //if there is no space then push it to next element with ampersand
                                combArr[q].push("&" + strArr[i]);
                                }
                        }
                    } else {
                            //if not a special character just add it in
                            if (!strArr[i].match(/[.#:\[]/g))    {
                            combArr[q][combArr[q].length-1] += " " + strArr[i];
                                   } else {
                            //if special char then add it to the previous one
                            combArr[q][combArr[q].length-1] += strArr[i];
                                   }
                    }
                }
            }            
        }
        return combArr;
    },
    arrangeCombeArrayByIndex: function(arr) {
        var combArrByIndex = [];
        if (arr[0] != null){
            for (var j=0; j < arr[0].length; j++) {
                combArrByIndex[j] = [];
                for (var i = 0; i < arr.length; i++) 
                {
                    if (arr[i][j] != undefined) 
                    {
                        combArrByIndex[j].push(arr[i][j])
                    } else {
                        combArrByIndex[j].push(null);
                    }
                }
            }
        }
        return (combArrByIndex)
    },
    RemoveUnwantedWhiteSpace: function(str) {
        str = str.replace(/ {2,}/g, ' ');
        //Remove last space if exist
        if(str[str.length-1] == " ") {
            str = str.slice(0,str.length-1);
        } 
        //Remove first space if exist
        if(str[0] == " ") {
            str = str.slice(1,str.length);
        }
        return str;
    }
}

function sortNumber(a,b)
{
    return b.start - a.start;
}

function arrangeInOnlyOneArray(DoubleArray) {
    var oneArrayMatches = [];
    for (var i=0; i < DoubleArray.length; i++) {
        while (DoubleArray[i].length > 0) {
            oneArrayMatches.push(DoubleArray[i].pop());
        }
    }
    return oneArrayMatches;
}

RegExp.quote = function(str) {
    return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

String.prototype.replaceAt = function(index, c) {
    return this.substr(0, index) + c + this.substr(index + (c.length == 0 ? 1 : c.length));
}

function MakeInnerBraketsWhiteSpace(string) {
    var bracketCount = 0;
    for (var i=0; i < string.length; i++){
        if (string[i] == "{"){
            bracketCount++;
        }
        if (string[i] == "}") {
            bracketCount--;        
        }
        if (bracketCount != 0) {
           string = string.replaceAt(i, " ");   
        }    
    }
    return string;
}

function removeAllWhiteSpacesFromCenter(str){
    for (var i=0; i < str.length; i++) {
        if (str[i] == " ") {
            str = str.substr(0,i) + str.substr(i+1,str.length) ;

        }
    }
    return str;
}

function removeWhiteSpaceBetweeSquareBrackets(strArr){
    var variations = [];
    var obj = {};
    var isOpenBracketFound = false;
    if (strArr != null) {
        for (var i = 0; i < strArr.length; i++) {
            if (!isOpenBracketFound && strArr[i].match(/[\[]/g) && !strArr[i].match(/[\]]/g)) {
                obj.startOfBracketElement = i;
                isOpenBracketFound = true;
            }
            if (isOpenBracketFound && (strArr[i].match(/[\]]/g))) {
                obj.endOfBracketElement = i;
                isOpenBracketFound = false;
                
                tempElement = "";
                for (var j = 0; j <= (obj.endOfBracketElement - obj.startOfBracketElement); j++) {
                    i--;
                    tempElement += strArr[obj.startOfBracketElement];
                    strArr.splice(obj.startOfBracketElement, 1);
                }
                obj.endOfBracketElement = 1000;
                obj.startOfBracketElement = 1000;
                
                strArr.splice(obj.startOfBracketElement, 0, tempElement);
            }
        }
    }
    return (strArr);
}

function getCloseBracketVariation(str) {
    var strVariations = [];
    strVariations[0] = str;
	if (str[0] == "[") {
		for (var i = 0; i < str.length; i++) {
			if (str[i] == "=") {
				strVariations[1] = str.substr(0, i) + " " + str.substr(i);
				strVariations[2] = str.substr(0, i) + "  " + str.substr(i);
			}
			if (str[i - 1] == "=") {
				strVariations[3] = str.substr(0, i - 1) + " = " + str.substr(i);
				strVariations[4] = str.substr(0, i - 1) + "  = " + str.substr(i);
				strVariations[5] = str.substr(0, i - 1) + "  =  " + str.substr(i);
				strVariations[6] = str.substr(0, i - 1) + "=  " + str.substr(i);
			}
		}
	}
    return(strVariations);
}

function removeDuplicatesFromListOfMatches(strArr) {
    for (var i=0; i < strArr.length; i++) {
        for (var j=0; j < strArr.length; j++) {
			if ((strArr[i] != null) && (strArr[j] != null)){
				if (i != j) {
		            if ((strArr[i].start == strArr[j].start)) {
		                //if they start the same and ends the same then dont push it
		                if (strArr[i].end == strArr[j].end) {
		                    strArr.splice(j,1);
							i--;
							
		                //if they start the same but ends differntly push the bigger one                    
		                } else {
		                    strArr[i].end = Math.max(strArr[i].end,strArr[j].end);
							strArr[i].start = Math.min(strArr[i].start,strArr[j].start);
		                    strArr.splice(j,1);
							i--;
		                }
		            //rule here should exclude match inside other match
		            } else if (((strArr[i].start >= strArr[j].start) && 
		                       (strArr[i].end <= strArr[j].end))) 
					{
								strArr.splice(i,1);
								i--;
					} 
					  else if (((strArr[i].start <= strArr[j].start) && 
		                       (strArr[i].end >= strArr[j].end)))
					{	
							   	strArr.splice(j,1);
								i--;
		            }		
				}
			}
        }
    }
	
	//Finding Last level objects
	var lastLevelIs = 0;
	for (i = 0; i < strArr.length; i++) {
		if (strArr[i].level > lastLevelIs) {
			lastLevelIs = strArr[i].level;
		}
	}
	for (i = 0; i < strArr.length; i++) {
		if (strArr[i].level == lastLevelIs) {
			strArr[i].lastLevel = "lastLevel";
		}
		else {
			strArr[i].lastLevel = "";	
		}
	}
	return strArr;
}


/*************************************************************/
var lessDesign = {
	v : {
		lastLevels : []
	},
	onLoad : function(){
		//show Demo Text
		/*
		$.get("readText.php?filename=demotext/demoText.txt", function(data) {
			$('#lessCode pre.styles').html(data);
		});	
		*/
		
		//Determain Size of #openingBox-background
		/*$('#openingBox-background').css({'width':$(window).width(),'height':$(window).height()})*/
	},
	init : function() {
		//Get results parameters
		$('#lessCode .lastLevel').each(function(index){
			lessDesign.v.lastLevels[index] = {};
			lessDesign.v.lastLevels[index].top = $(this).position().top;
			lessDesign.v.lastLevels[index].left = $(this).position().left;
		});
		//Scroll to last level but the first one that matches
		if (lessDesign.v.lastLevels[0]) {
			$(document).scrollTop(lessDesign.v.lastLevels[0].top);
		}
	},
	erase : function() {
		lessDesign.v.lastLevels.length = 0;
	},
	LoadDataFromInput : function(data) {
		lessSearch.params.originalData = data;
		$('#lessCode pre.styles').html(data);
		lessDesign.showHidePopUp(false);
	},
	showHidePopUp : function (isShow){
		if (isShow) {
			$('#openingBox').show();
			$('#openingBox-background').show();			
		} else {
			$('#openingBox').hide();
			$('#openingBox-background').hide();			
		}
	}
}

var lessForm = {
	p : {
		filename : ""
	},
	init : function() {
		
		//Copy paste code
	    $('form#getLessCode').submit(function(e){
	        e.preventDefault();
			lessForm.p.filename = "";
			lessDesign.LoadDataFromInput($('#textAreaLessText').val());

	        
	        
	        //$("pre.styles").snippet("css",{style:"ide-eclipse"});
	        // Finds <pre> elements with the class "styles"
	        // and snippet highlights the CSS code within
	        // using the "greenlcd" styling.
	
	    });
		
		//upload File
	    var uploader = new qq.FileUploader({
            element: document.getElementById('file-upload'),
            action: 'server/upload.php',
			allowedExtensions: ['css','less'], 
            //debug: true,
            params: {
                getContent: true
            },
            onComplete: function(id, fileName, responseJSON){
				lessForm.p.filename = fileName;
				lessDesign.LoadDataFromInput(responseJSON.content);
			},
        }); 
		
		//show Demo Text
		$('#viewDemoLink').click(function(e){
			e.preventDefault();
			lessForm.showDemo();
			lessForm.p.filename = "";
		});
		
		//Change to new Code
		$('#headerButtons #changeText').click(function(e){
			e.preventDefault();
			lessDesign.showHidePopUp(true);
		})	
		
		//Download file
		$('#downloadFile').click(function(e){
			e.preventDefault();
			window.location.href = 'server/create_and_download.php?filename=' + lessForm.p.filename + '&content=' + 'my name is alon';
			//$.get('server/create_and_download.php?filename=' + lessForm.p.filename + '&content=' + 'my name is alon', function(data){

			//});
		})
    },
	showDemo : function() {
		$.get("readText.php?filename=demotext/demoText.txt", function(data) {
		lessDesign.LoadDataFromInput(data);
		});	
	}  
}
