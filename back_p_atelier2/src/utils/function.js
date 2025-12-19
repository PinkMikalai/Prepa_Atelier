function calculateAverage(numbers) {
    if (!numbers || numbers.length === 0) {
        return null;
    }

    const sum = numbers.reduce((total, n) => total + n, 0);
    return sum / numbers.length;
}

module.exports = {
    calculateAverage
};
