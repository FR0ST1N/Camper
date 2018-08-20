/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    var result;
    var onlynum = input.replace(/[^\d./]/g, '');
    var allnums = onlynum.split('/');
    if (allnums[0] === ''){
      allnums = []
    }
    switch(allnums.length) {
      case 0:
        result = 1;
        break;
      case 1:
        result = allnums[0];
        break;
      case 2:
        result = allnums[0]/allnums[1];
        break;
      default:
        result = 'not a valid number';
    }
    return result;
  };
  
  this.getUnit = function(input) {
    var result;
    var onlyunit = input.replace(/[^a-zA-Z]+/g, '');
    //console.log(onlyunit);
    var allUnits = ['gal','mi','km','kg','lbs', 'l'];
    if (allUnits.indexOf(onlyunit.toLowerCase()) !== -1) {
      result = onlyunit;
    } else {
      result = 'invalid unit';
    }
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    var result;
    //console.log(initUnit);
    var allUnits = ['gal','mi','km','kg','lbs', 'l'];
    switch(initUnit.toLowerCase()) {
      case allUnits[3]:
        result = allUnits[4];
        break;
      case allUnits[4]:
        result = allUnits[3];
        break;
      case allUnits[1]:
        result = allUnits[2];
        break;      
      case allUnits[2]:
        result = allUnits[1];
        break;      
      case allUnits[0]:
        result = allUnits[5];
        break;      
      case allUnits[5]:
        result = allUnits[0];
        break;      
    }
    //console.log(result);
    return result;
  };

  this.spellOutUnit = function(unit) {
    var result;
    switch(unit.toLowerCase()) {
      case 'kg':
        result = 'kilograms';
        break;
      case 'lbs':
        result = 'pounds';
        break;
      case 'mi':
        result = 'miles';
        break;      
      case 'km':
        result = 'kilometers';
        break;      
      case 'gal':
        result = 'gallons';
        break;      
      case 'l':
        result = 'liters';
        break;      
    } 
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;
    switch(initUnit.toLowerCase()) {
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;      
      case 'km':
        result = initNum / miToKm;
        break;      
      case 'gal':
        result = initNum * galToL;
        break;      
      case 'l':
        result = initNum / galToL;
        break;      
    }
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result;
    result = initNum+' '+this.spellOutUnit(initUnit)+' converts to '+returnNum.toFixed(5)+' '+this.spellOutUnit(returnUnit);
    return result;
  };
  
}

module.exports = ConvertHandler;
