/**
 * The implement of Decimal to IEEE 754 format with Single precision.
 * @Date 2023/07/24
 * @Author Winter
 * @Ref https://en.wikipedia.org/wiki/IEEE_754
 * */

const decimalToIEEE754Format = (targetNum) => {
    let sign = 0;
    // 32 bit float number layout:[sign,exponent(8 bits),fraction(or Mantissa) in 23 bits]

    if (targetNum < 0.0) sign = 1 // sign bit

    const normalizeTargetNum = Math.abs(targetNum);

    // split the number to Integral part and Fractional part.
    let intPart = Math.floor(normalizeTargetNum);
    let fractionPart = normalizeTargetNum - intPart;

    let intPartBin = intPart.toString(2);// 0000 0011 ==> 11

    // the output has many bits, we only need 23 bits including integral part binary in total.
    let fractionPartBin = fractionPart.toString(2).split(".")[1];

    // add 127 to intPart of exp(eg: b0011 to b1.1(1.FFFFF * 2^N), now N is 1 at here.)
    let expPart = (intPartBin.length - 1 + 127).toString(2);

    let fractionPartInResult = `${intPartBin}${fractionPartBin}`.slice(1);

    let temp = `${sign}#${expPart}#${fractionPartInResult}`

    while (temp.length < 32 + 2) temp += "0" // 32 is valid bits, 2 is # chars.

    temp = temp.slice(0, 34);// Slice to 32 bits(loss some precision)

    console.log(targetNum, `Represent in IEEE 754: `, temp)

    return temp.replaceAll("#", "");//remove all # symbols.;
}

const IEEE754FormatToDecimal = (ieee754Str) => {
    // Represent a IEEE 754 to Decimal.
    const signFactor = ieee754Str[0] == 0 ? 1 : -1;
    const expBits = ieee754Str.slice(1, 9);
    const mantissaBits = ieee754Str.slice(9);

    const expNum = parseInt(expBits, 2);
    const biasExpNum = expNum - 127;

    const realPartStr = `1${mantissaBits.slice(0, biasExpNum)}`;// 100[10110001](1.FFFFFFFF * 2^1) ==> 11
    const realPartNum = parseInt(realPartStr, 2);// 11 ==> 3

    const fractionPartStr = mantissaBits.slice(biasExpNum);//110[10110001](1.FFFFFFFF * 2^3) ==> 10110001

    // convert fractionPartStr to Fraction Number
    let decimal = 0.0;
    for (let i = 0; i < fractionPartStr.length; i++) {
        decimal = decimal + (fractionPartStr[i] * (2 ** (-1 * (i + 1))));
    }

    const fractionPartNum = decimal;

    const realNum = signFactor * (realPartNum + fractionPartNum).toFixed(6);

    console.log(ieee754Str, "Represent in Decimal: ", realNum)

    return realNum;
}

exports.IEEE754FormatToDecimal = IEEE754FormatToDecimal;
exports.decimalToIEEE754Format = decimalToIEEE754Format;