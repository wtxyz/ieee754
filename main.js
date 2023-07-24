const impl = require("./impl");

// Run test
const targetNum = 3.141592;
const ieee754Str = impl.decimalToIEEE754Format(targetNum);
const decimalNumber = impl.IEEE754FormatToDecimal(ieee754Str);