// Linear Complexity: O(n)
function sumToNA(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Constant Complexity: O(1)
// Using the formula n(n + 1) / 2
function sumToNB(n: number): number {
  return (n * (n + 1)) / 2;
}

// Linear Complexity: O(n)
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
