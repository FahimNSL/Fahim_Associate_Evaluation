function climbStairs(n) {
   
    if (n === 1) return 1;
    if (n === 2) return 2;

    let preValue2 = 1;
    let preValue1 = 2;
    let current = 0;

    for (let i = 3; i <= n; i++) {
        current = preValue1 + preValue2;
        preValue2 = preValue1;
        preValue1 = current;
    }

    return current;
}


console.log(climbStairs(1));
console.log(climbStairs(2));
console.log(climbStairs(4));
console.log(climbStairs(5));
console.log(climbStairs(10));
console.log(climbStairs(15));
console.log(climbStairs(20));
console.log(climbStairs(50)); 
