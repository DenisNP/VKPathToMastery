// eslint-disable-next-line import/prefer-default-export
export const numPhrase = (num, one, few, many) => {
    const n = num < 0 ? 0 : num;
    const s = n.toString().padStart(2, '0');
    let numS = s.substring(s.length - 2, s.length);
    let lastN = Number.parseInt(numS, 10);

    if (lastN >= 11) return many;

    numS = numS.charAt(numS.length - 1).toString();
    lastN = Number.parseInt(numS, 10);

    if (lastN === 1) return one;
    if (lastN < 5) return few;
    return many;
};
