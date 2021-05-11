let DecimalSymbol = ".";

export const SetDecimalSymbol = (decimalSymbol) => {
  DecimalSymbol = decimalSymbol;
};

export const GetDecimalSymbol = () => {
  return DecimalSymbol;
};

export const IsNumeric = function (str) {
  if (typeof str != "string") return false;
  return (
    !isNaN(str) &&
    !isNaN(parseFloat(str))
  );
};

export const FormatNumber = (value, decimalPlaces, leadingZeros) => {
  let sValue = "";
  if (value == null) {
    return sValue;
  }
  if (typeof value === "number") {
    sValue = Parser(value, decimalPlaces);
    // sValue = sValue.replace(".", DecimalSymbol);
    // const parts = sValue.split(DecimalSymbol);
    const parts = sValue.split(".");
    const paddedInt = ZeroPad(parseInt(parts[0], 10), leadingZeros);
    if (parts[1] != null) {
      // return `${paddedInt}${DecimalSymbol}${parts[1]}`;
      return `${paddedInt}.${parts[1]}`;
    } else {
      return `${paddedInt}`;
    }
  } else {
    return sValue;
  }
};

const Parser = (value, decimalPlaces) => {
  let negative = false;
  if (decimalPlaces === undefined) {
    decimalPlaces = 0;
  }
  if (value < 0) {
    negative = true;
    value = value * -1;
  }
  const multiplicator = Math.pow(10, decimalPlaces);
  value = parseFloat((value * multiplicator).toFixed(11));
  value = (Math.round(value) / multiplicator).toFixed(decimalPlaces);
  if (negative) {
    value = (value * -1).toFixed(decimalPlaces);
  }
  return value;
};

const ZeroPad = (num, numZeros) => {
  const n = Math.abs(num);
  const zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
  let zeroString = Math.pow(10, zeros).toString().substr(1);
  if (num < 0) {
    zeroString = "-" + zeroString;
  }
  return zeroString + n;
};
