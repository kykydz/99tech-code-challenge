function sumToNA(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sumToNB(n: number): number {
  return (n * (n + 1)) / 2;
}

function sumToNC(n: number): number {
  if (n === 1) {
    return 1;
  }
  return n + sumToNC(n - 1);
}

const resultSumAsumToNA = sumToNA(100); // 5050
console.log(resultSumAsumToNA);

const resultSumAsumToNB = sumToNB(100); // 5050
console.log(resultSumAsumToNB);

const resultSumAsumToNC = sumToNC(100); // 5050
console.log(resultSumAsumToNC);
