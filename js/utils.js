function shuffleArray(array, seed=Math.random()) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(_random(seed) * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
        ++seed;
    }
    return array;
}


function _random(seed) {
    let x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
}
